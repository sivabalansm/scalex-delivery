import { Table, z } from "@botpress/runtime";
import { ClauseTypeEnum, RiskLevelEnum } from "../utils/constants";

/**
 * Extracted Clauses Table
 * Stores extracted contractual clauses with risk level, source citation,
 * and benchmark comparison data.
 */
export default new Table({
  name: "extractedClausesTable",
  columns: {
    userId: z.string(), // Owner of this clause
    contractId: z.number(),
    fileId: z.string(),
    passageId: z.string().optional(),
    clauseType: ClauseTypeEnum,
    title: {
      schema: z.string(),
      searchable: true,
    },
    section: z.string().optional(),
    text: {
      schema: z.string(),
      searchable: true,
    },
    // JSON strings for structured data
    keyPoints: {
      schema: z.string(), // JSON array of strings
      searchable: true,
    },
    riskLevel: RiskLevelEnum,
    position: z.number().optional(),
    foundInPassages: z.string().optional(), // JSON array of passage IDs
    // Citation metadata - for source traceability
    pageNumber: z.number().optional(), // Page where clause was found
    passageContent: z.string().optional(), // Full source passage text
    // ScaleX benchmark comparison fields
    benchmarkId: z.string().optional(), // Reference to contractBenchmarksTable Clause_ID
    benchmarkDeviation: z.string().optional(), // "above_high" | "below_low" | "within_range"
    redlineRecommendation: z.string().optional(), // Suggested redline/negotiation action
  },
});
