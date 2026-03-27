import { adk, z } from "@botpress/runtime";
import { ClauseTypeEnum, RiskLevelEnum } from "./constants";

/**
 * Core extraction types and functions for contract clause analysis.
 * Adapted from clause-extraction example with procurement-specific context.
 */

// ============================================================================
// Clause Schema
// ============================================================================

export const ClauseSchema = z.object({
  clauseType: ClauseTypeEnum.describe("Category of the contractual clause"),
  title: z
    .string()
    .describe("Clause heading or title as it appears in the document"),
  section: z
    .string()
    .optional()
    .describe(
      "Section or article number if present (e.g., '7.2', 'Article III')"
    ),
  text: z.string().describe("Full verbatim text of the clause"),
  keyPoints: z
    .array(z.string())
    .describe("3-5 key points summarizing the clause obligations and rights"),
  riskLevel: RiskLevelEnum.describe("Risk level for this clause (low, medium, high)"),
  relatedSections: z
    .array(z.string())
    .optional()
    .describe("References to other sections this clause relates to"),
});

export type Clause = z.infer<typeof ClauseSchema>;

// ============================================================================
// Extraction Schema (for Zai extraction)
// ============================================================================

export const ClausesExtractionSchema = z.object({
  clauses: z
    .array(ClauseSchema)
    .describe("All contractual clauses found in this text"),
  documentContext: z
    .object({
      contractType: z
        .string()
        .optional()
        .describe("Type of contract (NDA, MSA, SaaS, Employment, etc.)"),
      parties: z
        .array(z.string())
        .optional()
        .describe("Parties to the contract"),
    })
    .optional(),
});

export type ClausesExtraction = z.infer<typeof ClausesExtractionSchema>;

// ============================================================================
// Passage (input from Files API)
// ============================================================================

export interface Passage {
  id: string;
  content: string;
  metadata?: {
    pageNumber?: number;
    breadcrumb?: string;
    position?: number;
    type?: string;
    subtype?: string;
  };
}

// ============================================================================
// Citation (source traceability)
// ============================================================================

export interface PassageCitation {
  id: string;
  pageNumber?: number;
  content: string;
  position?: number;
}

// ============================================================================
// Raw and Consolidated Clauses
// ============================================================================

export interface RawClauseWithSource extends Clause {
  passageId: string;
  passageIndex: number;
  citation: PassageCitation;
}

// ============================================================================
// Batch Extraction Schema
// ============================================================================

/**
 * Schema for batch extraction - each clause includes which passage it came from
 */
export const BatchClauseSchema = ClauseSchema.extend({
  passageNumber: z
    .number()
    .describe("Which passage (1-N) this clause was found in"),
});

export const BatchExtractionSchema = z.object({
  clauses: z
    .array(BatchClauseSchema)
    .describe("All contractual clauses found across the passages"),
  documentContext: z
    .object({
      contractType: z
        .string()
        .optional()
        .describe("Type of contract (NDA, MSA, SaaS, Employment, etc.)"),
      parties: z
        .array(z.string())
        .optional()
        .describe("Parties to the contract"),
    })
    .optional(),
});

export type BatchExtraction = z.infer<typeof BatchExtractionSchema>;

// ============================================================================
// Prompts
// ============================================================================

export const BATCH_EXTRACTION_INSTRUCTIONS = `
You are a procurement contract analyst specializing in outsourcing and managed services agreements. Your task is to extract and analyze contractual clauses from multiple passages of the same document.

You will receive multiple passages, each numbered (PASSAGE 1, PASSAGE 2, etc.).
Extract clauses from ALL passages and note which passage number each clause came from.

For each clause found:
1. Identify the clause type. Use procurement-specific types when applicable:
   - Standard types: payment_terms, liability_limitation, indemnification, termination, confidentiality, force_majeure, warranties, governing_law, dispute_resolution, intellectual_property, assignment, amendment
   - Procurement types: sla_terms (service levels, credits, remedies), pricing_terms (rate structures, fee schedules), volume_commitment (minimum volumes, take-or-pay), data_protection (GDPR, data handling, breach notification), transition_assistance (exit/transition support), governance (steering committees, reporting, escalation), rate_escalation (annual increases, CPI adjustments), auto_renewal (automatic renewal terms), exclusivity (exclusive provider requirements), benchmarking_rights (right to benchmark pricing), insurance_requirements (coverage requirements)
   - Use "other" only if none of the above fit
2. Extract the full verbatim text
3. Summarize key points (3-5 bullet points) focusing on obligations, rights, and commercial impact
4. Assess risk level (low, medium, high) considering procurement implications
5. Note the passageNumber (1-N) where you found this clause

IMPORTANT:
- Process ALL passages, not just the first one
- If no clear contractual clauses are found in a passage, that's fine - move to the next
- Be thorough but precise - only extract actual legal/commercial clauses, not general document text
- A single clause may span multiple passages - extract it once with the first passage number
- Pay special attention to SLA terms, pricing structures, and termination/transition provisions
`;

// ============================================================================
// Extraction Functions
// ============================================================================

/**
 * Benchmark data from contractBenchmarksTable for enriching extraction context
 */
export interface BenchmarkContext {
  clauseType: string;
  benchmarkLow?: number;
  benchmarkMedian?: number;
  benchmarkHigh?: number;
  unit?: string;
  riskLevel?: string;
  standardLanguage?: string;
  redFlags?: string;
  negotiationPoints?: string;
}

/**
 * Extract clauses from a batch of passages using Zai
 * More efficient than single-passage extraction (reduces API overhead)
 */
export async function extractFromBatch(
  passages: Passage[],
  sectionHeader?: string,
  userParty?: "party_a" | "party_b"
): Promise<{ clauses: RawClauseWithSource[]; passageCount: number }> {
  if (passages.length === 0) {
    return { clauses: [], passageCount: 0 };
  }

  // Format passages with clear separators
  const formattedPassages = passages
    .map((p, i) => {
      const pageInfo = p.metadata?.pageNumber
        ? ` (Page ${p.metadata.pageNumber})`
        : "";
      return `--- PASSAGE ${i + 1}${pageInfo} ---\n${p.content}`;
    })
    .join("\n\n");

  // Add section context if available
  const sectionContext = sectionHeader
    ? `\nSECTION CONTEXT: ${sectionHeader}\n`
    : "";

  // Add party context for risk assessment perspective
  const partyContext = userParty
    ? `\nUSER PERSPECTIVE: The user represents ${userParty === "party_a" ? "Party A (the service provider/vendor)" : "Party B (the client/customer)"}. Assess risk from THEIR perspective - clauses favorable to the other party should be marked as higher risk.\n`
    : "";

  const prompt = `${BATCH_EXTRACTION_INSTRUCTIONS}

You will analyze ${passages.length} passages.${sectionContext}${partyContext}

TEXT:
${formattedPassages}`;

  const result = await adk.zai.extract(prompt, BatchExtractionSchema);

  // Map results back to passage IDs with full citation data
  const rawClauses: RawClauseWithSource[] = result.clauses.map((clause) => {
    // passageNumber is 1-indexed, array is 0-indexed
    const passageIndex = Math.max(0, Math.min(clause.passageNumber - 1, passages.length - 1));
    const passage = passages[passageIndex];

    return {
      clauseType: clause.clauseType,
      title: clause.title,
      section: clause.section,
      text: clause.text,
      keyPoints: clause.keyPoints,
      riskLevel: clause.riskLevel,
      relatedSections: clause.relatedSections,
      passageId: passage.id,
      passageIndex: passage.metadata?.position || passageIndex,
      // Full citation data for source traceability
      citation: {
        id: passage.id,
        pageNumber: passage.metadata?.pageNumber,
        content: passage.content,
        position: passage.metadata?.position,
      },
    };
  });

  return {
    clauses: rawClauses,
    passageCount: passages.length,
  };
}

/**
 * Extract clauses from a batch with benchmark context.
 * Enriches the extraction prompt with contract benchmark data from contractBenchmarksTable
 * so the LLM can provide risk-aware assessment based on industry standards.
 */
export async function extractFromBatchWithBenchmarks(
  passages: Passage[],
  benchmarks: BenchmarkContext[],
  sectionHeader?: string,
  userParty?: "party_a" | "party_b"
): Promise<{ clauses: RawClauseWithSource[]; passageCount: number }> {
  if (passages.length === 0) {
    return { clauses: [], passageCount: 0 };
  }

  // Format passages with clear separators
  const formattedPassages = passages
    .map((p, i) => {
      const pageInfo = p.metadata?.pageNumber
        ? ` (Page ${p.metadata.pageNumber})`
        : "";
      return `--- PASSAGE ${i + 1}${pageInfo} ---\n${p.content}`;
    })
    .join("\n\n");

  // Add section context if available
  const sectionContext = sectionHeader
    ? `\nSECTION CONTEXT: ${sectionHeader}\n`
    : "";

  // Add party context for risk assessment perspective
  const partyContext = userParty
    ? `\nUSER PERSPECTIVE: The user represents ${userParty === "party_a" ? "Party A (the service provider/vendor)" : "Party B (the client/customer)"}. Assess risk from THEIR perspective - clauses favorable to the other party should be marked as higher risk.\n`
    : "";

  // Format benchmark context
  let benchmarkContext = "";
  if (benchmarks.length > 0) {
    const benchmarkLines = benchmarks.map((b) => {
      const parts = [`  - ${b.clauseType}`];
      if (b.benchmarkLow !== undefined && b.benchmarkHigh !== undefined) {
        parts.push(`Range: ${b.benchmarkLow}-${b.benchmarkHigh} ${b.unit || ""}`);
        if (b.benchmarkMedian !== undefined) {
          parts.push(`Median: ${b.benchmarkMedian}`);
        }
      }
      if (b.redFlags) parts.push(`Red flags: ${b.redFlags}`);
      if (b.negotiationPoints) parts.push(`Negotiation: ${b.negotiationPoints}`);
      return parts.join(" | ");
    });

    benchmarkContext = `
INDUSTRY BENCHMARKS (from procurement database):
When assessing risk, compare extracted clause values against these benchmarks:
${benchmarkLines.join("\n")}

Flag clauses that deviate significantly from benchmark ranges as higher risk.
`;
  }

  const prompt = `${BATCH_EXTRACTION_INSTRUCTIONS}
${benchmarkContext}
You will analyze ${passages.length} passages.${sectionContext}${partyContext}

TEXT:
${formattedPassages}`;

  const result = await adk.zai.extract(prompt, BatchExtractionSchema);

  // Map results back to passage IDs with full citation data
  const rawClauses: RawClauseWithSource[] = result.clauses.map((clause) => {
    const passageIndex = Math.max(0, Math.min(clause.passageNumber - 1, passages.length - 1));
    const passage = passages[passageIndex];

    return {
      clauseType: clause.clauseType,
      title: clause.title,
      section: clause.section,
      text: clause.text,
      keyPoints: clause.keyPoints,
      riskLevel: clause.riskLevel,
      relatedSections: clause.relatedSections,
      passageId: passage.id,
      passageIndex: passage.metadata?.position || passageIndex,
      citation: {
        id: passage.id,
        pageNumber: passage.metadata?.pageNumber,
        content: passage.content,
        position: passage.metadata?.position,
      },
    };
  });

  return {
    clauses: rawClauses,
    passageCount: passages.length,
  };
}
