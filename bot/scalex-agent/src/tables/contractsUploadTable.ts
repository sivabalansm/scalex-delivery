import { Table, z } from "@botpress/runtime";

/**
 * Contract Status Enum
 * Tracks the lifecycle of uploaded contract documents
 */
export const ContractStatus = z.enum([
  "pending",     // Uploaded, waiting to start extraction
  "analyzing",   // Currently extracting clauses
  "completed",   // Extraction complete
  "error",       // Extraction failed
]);

/**
 * Contracts Upload Table
 * Stores metadata about uploaded contract documents for clause extraction.
 * Extended with ScaleX-specific fields: towerCode, riskScore, benchmarkDeviations.
 */
export default new Table({
  name: "contractsUploadTable",
  columns: {
    userId: z.string(),
    fileId: z.string(),
    fileKey: z.string(),
    title: {
      schema: z.string(),
      searchable: true,
    },
    counterparty: {
      schema: z.string().optional(),
      searchable: true,
    },
    contractType: z.string().optional(),
    status: ContractStatus,
    clauseCount: z.number().optional(),
    summary: {
      schema: z.string().optional(),
      searchable: true,
    },
    messageId: z.string().optional(),
    errorMessage: z.string().optional(),
    // ScaleX-specific fields
    towerCode: z.string().optional(), // Link to towers table
    riskScore: z.number().optional(), // Overall risk score (0-100)
    benchmarkDeviations: z.string().optional(), // JSON summary of deviations
    reportFileUrl: z.string().optional(), // URL of generated DOCX report
  },
});

export type ContractStatus = z.infer<typeof ContractStatus>;
