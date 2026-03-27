import { Workflow, z, context, adk } from "@botpress/runtime";
import {
  updateExtractionProgressComponent,
  type ExtractionData,
} from "../utils/progress-component";
import { addActivity, updateActivity } from "../utils/activity-helpers";
import { getPassages } from "../utils/files";
import {
  extractFromBatchWithBenchmarks,
  type RawClauseWithSource,
  type BenchmarkContext,
} from "../utils/extraction";
import {
  batchPassages,
  getBatchingSummary,
  type PassageBatch,
} from "../utils/passage-batching";
import { EXTRACTION_CONFIG, CLAUSE_TO_BENCHMARK_MAP } from "../utils/constants";

const { BATCH_CONCURRENCY, DB_INSERT_BATCH_SIZE } = EXTRACTION_CONFIG;

/**
 * Clause Extraction Workflow (WF-06: Contract Risk Analysis)
 *
 * 5-phase pipeline:
 * 1. Fetch & Batch passages (0-10%)
 * 2. Extract clauses with benchmark context (10-70%)
 * 3. Flatten results (70-75%)
 * 4. Store + benchmark comparison (75-90%)
 * 5. Generate summary (90-100%)
 */
export default new Workflow({
  name: "extract_clauses",
  timeout: "10m",
  input: z.object({
    conversationId: z.string(),
    userId: z.string(),
    messageId: z.string(),
    fileId: z.string(),
    documentName: z.string(),
    userParty: z.enum(["party_a", "party_b"]).describe("Which party the user represents for risk assessment"),
  }),
  output: z.object({
    contractId: z.number(),
    clauseCount: z.number(),
  }),
  handler: async ({ input, step }) => {
    const { userId, messageId, fileId, documentName, userParty } = input;

    console.info("[WORKFLOW] Starting extract_clauses workflow", {
      userId,
      messageId,
      fileId,
      documentName,
    });

    // Helper to update UI progress
    const updateUI = async (opts: {
      progress: number;
      clausesFound?: number;
      status?: ExtractionData["status"];
      error?: string;
      passageStats?: {
        total: number;
        processed: number;
        skipped: number;
        withClauses: number;
      };
      currentBatch?: {
        index: number;
        total: number;
        sectionHeader?: string;
        passageCount: number;
        pageRange?: { start: number; end: number };
      };
      clauses?: Array<{
        id: number;
        clauseType: string;
        title: string;
        section?: string;
        text: string;
        keyPoints: string[];
        riskLevel: "low" | "medium" | "high";
      }>;
      summary?: string;
    }) => {
      await updateExtractionProgressComponent(messageId, userId, {
        topic: documentName,
        sources: [{ fileId, fileName: documentName }],
        ...opts,
      });
    };

    // ========================================
    // PHASE 1: Create Contract Record, Fetch Benchmarks, Fetch/Batch Passages
    // ========================================
    const { contractId, batches, batchingStats, benchmarks } = await step(
      "fetch-and-batch",
      async () => {
        console.debug("[WORKFLOW] Phase 1: Fetching and batching passages");

        const readActivityId = await addActivity(
          messageId,
          userId,
          "reading",
          `Waiting for file indexing...`,
          { uniqueKey: "reading" }
        );

        await updateUI({ progress: 5 });

        const client = context.get("client");

        // Create contract record in database
        const { rows } = await client.createTableRows({
          table: "contractsUploadTable",
          rows: [
            {
              userId,
              fileId,
              fileKey: fileId,
              title: documentName,
              status: "analyzing",
              messageId,
            },
          ],
        });

        const contractId = Number(rows[0]?.id);
        if (!contractId) {
          throw new Error("Failed to create contract record");
        }

        // Fetch benchmark data from contractBenchmarksTable
        const benchmarks: BenchmarkContext[] = [];
        try {
          const { rows: benchmarkRows } = await client.findTableRows({
            table: "contractBenchmarksTable",
            limit: 50,
          });

          for (const row of benchmarkRows) {
            benchmarks.push({
              clauseType: row.Clause_Type?.toString() || "",
              benchmarkLow: row.Benchmark_Low ? Number(row.Benchmark_Low) : undefined,
              benchmarkMedian: row.Benchmark_Median ? Number(row.Benchmark_Median) : undefined,
              benchmarkHigh: row.Benchmark_High ? Number(row.Benchmark_High) : undefined,
              unit: row.Unit?.toString(),
              riskLevel: row.Risk_Level?.toString(),
              standardLanguage: row.Standard_Language?.toString(),
              redFlags: row.Red_Flags?.toString(),
              negotiationPoints: row.Negotiation_Points?.toString(),
            });
          }
          console.debug(`[WORKFLOW] Loaded ${benchmarks.length} benchmarks`);
        } catch (err) {
          console.warn("[WORKFLOW] Failed to load benchmarks, continuing without:", err);
        }

        // Fetch passages from Files API (with indexing status updates)
        const passages = await getPassages(fileId, {
          onStatusChange: async (status, elapsedSec) => {
            await updateActivity(readActivityId, {
              text: `Indexing: ${status} (${elapsedSec}s elapsed)`,
            });
          },
        });

        if (passages.length === 0) {
          throw new Error(
            "No passages found in document - file may not be indexed"
          );
        }

        // Batch passages by document sections
        const batchingResult = batchPassages(passages);
        const batchingSummary = getBatchingSummary(batchingResult);

        await updateActivity(readActivityId, {
          status: "done",
          text: `Read ${passages.length} passages • ${batchingSummary}`,
        });

        await updateUI({
          progress: 10,
          passageStats: {
            total: batchingResult.stats.totalPassages,
            processed: 0,
            skipped: batchingResult.stats.skippedPassages,
            withClauses: 0,
          },
        });

        console.debug("[WORKFLOW] Phase 1 complete:", {
          contractId,
          totalPassages: passages.length,
          batchCount: batchingResult.batches.length,
          skipped: batchingResult.stats.skippedPassages,
          benchmarksLoaded: benchmarks.length,
        });

        return {
          contractId,
          batches: batchingResult.batches,
          batchingStats: batchingResult.stats,
          benchmarks,
        };
      }
    );

    // ========================================
    // PHASE 2: Extract Clauses from Batches (Parallel)
    // ========================================
    let totalClausesFound = 0;
    let processedPassages = 0;

    const rawClauses = await step.map(
      "extract-batch",
      batches,
      async (batch: PassageBatch, { i: batchIndex }) => {
        const batchNum = batchIndex + 1;
        const totalBatches = batches.length;

        console.debug(
          `[WORKFLOW] Extracting batch ${batchNum}/${totalBatches}` +
            (batch.sectionHeader ? ` (${batch.sectionHeader.slice(0, 50)}...)` : "")
        );

        try {
          // Build a meaningful label with fallbacks
          let batchLabel: string;
          if (batch.sectionHeader) {
            batchLabel = batch.sectionHeader.slice(0, 50);
          } else if (batch.stats.pageRange) {
            const { start, end } = batch.stats.pageRange;
            batchLabel = start === end ? `Page ${start}` : `Pages ${start}-${end}`;
          } else {
            batchLabel = `Batch ${batchNum}/${totalBatches}`;
          }

          const extractActivityId = await addActivity(
            messageId,
            userId,
            "extracting",
            `Analyzing ${batch.passages.length} passages • ${batchLabel}`,
            { contractId, uniqueKey: `extract-batch-${batchIndex}` }
          );

          // Update progress (10-70% range for extraction phase)
          const progressPercent =
            10 + Math.floor((batchIndex / totalBatches) * 60);

          await updateUI({
            progress: progressPercent,
            currentBatch: {
              index: batchNum,
              total: totalBatches,
              sectionHeader: batch.sectionHeader,
              passageCount: batch.passages.length,
              pageRange: batch.stats.pageRange,
            },
            passageStats: {
              total: batchingStats.totalPassages,
              processed: processedPassages,
              skipped: batchingStats.skippedPassages,
              withClauses: totalClausesFound,
            },
          });

          // Extract clauses with benchmark context
          const result = await extractFromBatchWithBenchmarks(
            batch.passages,
            benchmarks,
            batch.sectionHeader,
            userParty
          );

          // Update running totals
          processedPassages += batch.passages.length;
          totalClausesFound += result.clauses.length;

          await updateActivity(extractActivityId, {
            status: "done",
            text: `${result.clauses.length} clauses • ${batchLabel}`,
          });

          return result.clauses;
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.error("[WORKFLOW] Batch extraction failed:", {
            batch: batchNum,
            total: totalBatches,
            passageCount: batch.passages.length,
            error: errorMsg,
          });

          await addActivity(
            messageId,
            userId,
            "extracting",
            `Batch ${batchNum} failed: ${errorMsg.slice(0, 100)}`,
            { contractId, uniqueKey: `extract-batch-${batchIndex}-error` }
          );

          // Return empty array on error, don't fail entire workflow
          processedPassages += batch.passages.length;
          return [];
        }
      },
      { concurrency: BATCH_CONCURRENCY }
    );

    console.debug("[WORKFLOW] Phase 2 complete, raw clauses:", {
      totalClauses: rawClauses.flat().length,
      batchesProcessed: batches.length,
    });

    // ========================================
    // PHASE 3: Flatten Raw Clauses
    // ========================================
    const allClauses = rawClauses.flat();

    console.debug("[WORKFLOW] Phase 3: Flattened clauses:", {
      totalClauses: allClauses.length,
    });

    await updateUI({
      progress: 75,
      clausesFound: allClauses.length,
      passageStats: {
        total: batchingStats.totalPassages,
        processed: batchingStats.contentPassages,
        skipped: batchingStats.skippedPassages,
        withClauses: totalClausesFound,
      },
    });

    // ========================================
    // PHASE 4: Store Results + Benchmark Comparison
    // ========================================
    await step("store-results", async () => {
      console.debug("[WORKFLOW] Phase 4: Storing results and comparing benchmarks");

      const storeActivityId = await addActivity(
        messageId,
        userId,
        "storing",
        `Storing ${allClauses.length} clauses and comparing against benchmarks`,
        { contractId, uniqueKey: "storing" }
      );

      await updateUI({ progress: 80 });

      const client = context.get("client");

      // Build benchmark lookup map: Clause_Type -> benchmark row
      const benchmarkLookup = new Map<string, BenchmarkContext>();
      for (const b of benchmarks) {
        benchmarkLookup.set(b.clauseType, b);
      }

      // Prepare clause rows with benchmark comparison
      let deviationCount = 0;
      const clauseRows = allClauses.map((clause, index) => {
        // Look up benchmark for this clause type
        const benchmarkKey = CLAUSE_TO_BENCHMARK_MAP[clause.clauseType];
        const benchmark = benchmarkKey ? benchmarkLookup.get(benchmarkKey) : undefined;

        let benchmarkId: string | undefined;
        let benchmarkDeviation: string | undefined;
        let redlineRecommendation: string | undefined;

        if (benchmark) {
          benchmarkId = benchmarkKey;
          // Determine deviation based on risk level as a proxy
          // (actual numeric comparison would require extracting values from clause text)
          if (clause.riskLevel === "high" && benchmark.riskLevel !== "HIGH") {
            benchmarkDeviation = "above_high";
            deviationCount++;
            redlineRecommendation = benchmark.negotiationPoints || `Review ${clause.clauseType} clause - risk exceeds benchmark expectations`;
          } else if (clause.riskLevel === "low" && benchmark.riskLevel === "HIGH") {
            benchmarkDeviation = "below_low";
            redlineRecommendation = `${clause.clauseType} terms appear favorable - verify against benchmark standards`;
          } else {
            benchmarkDeviation = "within_range";
          }

          // Add red flag context if available
          if (benchmark.redFlags && clause.riskLevel === "high") {
            redlineRecommendation = `${redlineRecommendation || ""} Red flags: ${benchmark.redFlags}`.trim();
          }
        }

        return {
          userId,
          contractId,
          fileId,
          passageId: clause.passageId,
          clauseType: clause.clauseType,
          title: clause.title,
          section: clause.section,
          text: clause.text,
          keyPoints: JSON.stringify(clause.keyPoints),
          riskLevel: clause.riskLevel,
          position: index,
          foundInPassages: JSON.stringify([clause.passageId]),
          pageNumber: clause.citation.pageNumber,
          passageContent: clause.citation.content,
          benchmarkId,
          benchmarkDeviation,
          redlineRecommendation,
        };
      });

      // Batch insert clauses in chunks
      for (let i = 0; i < clauseRows.length; i += DB_INSERT_BATCH_SIZE) {
        const chunk = clauseRows.slice(i, i + DB_INSERT_BATCH_SIZE);
        await client.createTableRows({
          table: "extractedClausesTable",
          rows: chunk,
        });
        console.debug(
          `[WORKFLOW] Stored clauses ${i + 1}-${Math.min(i + DB_INSERT_BATCH_SIZE, clauseRows.length)}`
        );
      }

      // Calculate risk score (percentage of high-risk clauses)
      const highRiskCount = allClauses.filter(c => c.riskLevel === "high").length;
      const riskScore = allClauses.length > 0
        ? Math.round((highRiskCount / allClauses.length) * 100)
        : 0;

      // Build deviation summary
      const deviationSummary = JSON.stringify({
        total: allClauses.length,
        benchmarked: clauseRows.filter(r => r.benchmarkId).length,
        deviations: deviationCount,
        highRisk: highRiskCount,
      });

      // Update contract record with completion status
      await client.updateTableRows({
        table: "contractsUploadTable",
        rows: [
          {
            id: contractId,
            status: "completed",
            clauseCount: allClauses.length,
            riskScore,
            benchmarkDeviations: deviationSummary,
          },
        ],
      });

      await updateActivity(storeActivityId, {
        status: "done",
        text: `Stored ${allClauses.length} clauses • ${deviationCount} benchmark deviations found`,
      });

      // Transform for UI display
      const clausesForUI = allClauses.map((clause, index) => ({
        id: index + 1,
        clauseType: clause.clauseType,
        title: clause.title,
        section: clause.section,
        text: clause.text,
        keyPoints: clause.keyPoints,
        riskLevel: clause.riskLevel,
      }));

      await updateUI({
        progress: 90,
        clausesFound: allClauses.length,
        clauses: clausesForUI,
      });

      console.debug("[WORKFLOW] Phase 4 complete");
    });

    // ========================================
    // PHASE 5: Generate Contract Summary
    // ========================================
    await step("generate-summary", async () => {
      console.debug("[WORKFLOW] Phase 5: Generating summary");

      const summaryActivityId = await addActivity(
        messageId,
        userId,
        "summarizing",
        "Generating contract risk analysis summary...",
        { contractId, uniqueKey: "summarizing" }
      );

      await updateUI({
        progress: 95,
        status: "summarizing",
      });

      const client = context.get("client");

      // Build clause content for summarization
      const clauseContent = allClauses.map((clause) => {
        const riskLabel = clause.riskLevel === "high" ? "[HIGH RISK] " :
                          clause.riskLevel === "medium" ? "[MEDIUM RISK] " : "";
        return `${riskLabel}${clause.clauseType.toUpperCase()}: ${clause.title}\n${clause.text}\nKey points: ${clause.keyPoints.join("; ")}`;
      }).join("\n\n---\n\n");

      // Build benchmark deviation summary for the prompt
      const deviationClauses = allClauses.filter((_, i) => {
        const row = allClauses[i];
        return row && CLAUSE_TO_BENCHMARK_MAP[row.clauseType];
      });
      const deviationContext = deviationClauses.length > 0
        ? `\nBENCHMARK CONTEXT: ${deviationClauses.length} clauses were compared against procurement industry benchmarks.`
        : "";

      const partyLabel = userParty === "party_a" ? "the service provider/vendor" : "the client/customer";

      const summary = await adk.zai.text(
        `Provide a 2-3 sentence executive summary of this contract from the perspective of ${partyLabel}.
${deviationContext}

Requirements:
- Highlight the most important terms and key obligations
- Note any high-risk clauses that require attention or deviate from industry benchmarks
- Focus on: contract type, key parties' obligations, payment terms, SLAs, notable risks
- Be concise but informative - scannable in 10 seconds
- Do NOT use citations or reference markers

CLAUSES:
${clauseContent}`,
        { length: 150 }
      );

      // Save summary to contractsUploadTable
      await client.updateTableRows({
        table: "contractsUploadTable",
        rows: [{ id: contractId, summary }],
      });

      await updateActivity(summaryActivityId, {
        status: "done",
        text: summary ? "Contract risk analysis summary generated" : "Summary generation completed",
      });

      // Final completion activity
      await addActivity(
        messageId,
        userId,
        "complete",
        `Analysis complete: ${allClauses.length} clauses extracted`,
        { uniqueKey: "complete" }
      );

      // Update UI with final status and summary
      await updateUI({
        progress: 100,
        status: "done",
        summary,
      });

      console.debug("[WORKFLOW] Phase 5 complete");
    });

    console.info("[WORKFLOW] Workflow complete!", {
      contractId,
      clauseCount: allClauses.length,
      batchesProcessed: batches.length,
      passagesProcessed: batchingStats.contentPassages,
      passagesSkipped: batchingStats.skippedPassages,
    });

    return {
      contractId,
      clauseCount: allClauses.length,
    };
  },
});
