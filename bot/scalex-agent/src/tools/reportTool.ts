import { Autonomous, z } from "@botpress/runtime";
import type { Client } from "@botpress/client";
import {
  analyzeMissingProtections,
  analyzeRedlineRecommendations,
  analyzeNegotiationPriorities,
  type ReportClause,
} from "../utils/report-llm-analysis";
import { generateContractReport } from "../utils/report-generator";

/**
 * On-demand tool for generating or retrieving a Contract Review Summary DOCX.
 * If a report already exists, returns the existing URL.
 * Otherwise generates a new report from stored clause data.
 */
export function createGenerateReportTool(client: Client, userId: string) {
  return new Autonomous.Tool({
    name: "generate_contract_report",
    description:
      "Generate or retrieve a Contract Review Summary Word document for a previously analyzed contract. Returns a download link for the DOCX report containing risk summary, missing protections, recommended redlines, and negotiation priorities.",
    input: z.object({
      contractId: z
        .number()
        .describe("The contract ID to generate a report for"),
    }),
    output: z.object({
      reportUrl: z.string(),
      message: z.string(),
      isNew: z.boolean(),
    }),
    handler: async ({ contractId }) => {
      console.debug("[TOOL] generate_contract_report called", { contractId, userId });

      // 1. Look up contract
      let contractRow;
      try {
        const result = await client.getTableRow({
          table: "contractsUploadTable",
          id: contractId,
        });
        contractRow = result.row;
      } catch {
        return {
          reportUrl: "",
          message: `Contract with ID ${contractId} not found.`,
          isNew: false,
        };
      }

      // Security: ensure the contract belongs to this user
      if (contractRow.userId?.toString() !== userId) {
        return {
          reportUrl: "",
          message: "You don't have access to this contract.",
          isNew: false,
        };
      }

      // 2. If report already exists, return it
      const existingUrl = contractRow.reportFileUrl?.toString();
      if (existingUrl) {
        console.debug("[TOOL] Returning existing report URL");
        return {
          reportUrl: existingUrl,
          message: "Report already exists for this contract.",
          isNew: false,
        };
      }

      // 3. Check contract is completed
      if (contractRow.status?.toString() !== "completed") {
        return {
          reportUrl: "",
          message: `Contract analysis is not yet complete (status: ${contractRow.status}). Please wait for extraction to finish.`,
          isNew: false,
        };
      }

      // 4. Fetch clauses from extractedClausesTable
      const { rows: clauseRows } = await client.findTableRows({
        table: "extractedClausesTable",
        filter: {
          contractId: { $eq: contractId },
          userId: { $eq: userId },
        },
        limit: 200,
        orderBy: "position",
        orderDirection: "asc",
      });

      if (clauseRows.length === 0) {
        return {
          reportUrl: "",
          message: "No clauses found for this contract. The extraction may have failed.",
          isNew: false,
        };
      }

      console.debug("[TOOL] Found clauses for report:", clauseRows.length);

      // 5. Build ReportClause array
      const reportClauses: ReportClause[] = clauseRows.map((row) => ({
        clauseType: row.clauseType?.toString() || "other",
        title: row.title?.toString() || "Untitled",
        text: row.text?.toString() || "",
        keyPoints: (() => {
          try {
            return JSON.parse(row.keyPoints?.toString() || "[]");
          } catch {
            return [];
          }
        })(),
        riskLevel: (row.riskLevel?.toString() as "low" | "medium" | "high") || "low",
        benchmarkDeviation: row.benchmarkDeviation?.toString(),
        redlineRecommendation: row.redlineRecommendation?.toString(),
        section: row.section?.toString(),
      }));

      // 6. Run LLM analyses
      const contractTitle = contractRow.title?.toString() || "Contract";
      const counterparty = contractRow.counterparty?.toString();
      const contractType = contractRow.contractType?.toString();
      const summary = contractRow.summary?.toString() || "";

      const [missingProtections, redlineRecommendations, negotiationPriorities] =
        await Promise.all([
          analyzeMissingProtections(reportClauses, contractType),
          analyzeRedlineRecommendations(reportClauses),
          analyzeNegotiationPriorities(reportClauses),
        ]);

      // 7. Generate DOCX
      const reportBuffer = await generateContractReport({
        contractTitle,
        counterparty,
        clauses: reportClauses,
        summary,
        missingProtections,
        redlineRecommendations,
        negotiationPriorities,
      });

      // 8. Upload
      const { file } = await client.uploadFile({
        key: `contract-report-${contractId}.docx`,
        content: reportBuffer,
        tags: { contractId: String(contractId) },
      });

      const reportUrl = file.url;

      // 9. Update contract record
      await client.updateTableRows({
        table: "contractsUploadTable",
        rows: [{ id: contractId, reportFileUrl: reportUrl }],
      });

      console.info("[TOOL] Report generated and uploaded:", reportUrl);

      return {
        reportUrl,
        message: `Contract Review Summary report has been generated for "${contractTitle}".`,
        isNew: true,
      };
    },
  });
}
