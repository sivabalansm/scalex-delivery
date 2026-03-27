import { z } from "@botpress/runtime";

/**
 * Shared constants and enums for clause extraction
 * Single source of truth - import from here, not duplicate
 */

// ============================================================================
// Clause Type Enum
// ============================================================================

export const CLAUSE_TYPES = [
  "payment_terms",
  "liability_limitation",
  "indemnification",
  "termination",
  "confidentiality",
  "force_majeure",
  "warranties",
  "governing_law",
  "dispute_resolution",
  "intellectual_property",
  "assignment",
  "amendment",
  // Procurement-specific clause types
  "sla_terms",
  "pricing_terms",
  "volume_commitment",
  "data_protection",
  "transition_assistance",
  "governance",
  "rate_escalation",
  "auto_renewal",
  "exclusivity",
  "benchmarking_rights",
  "insurance_requirements",
  "other",
] as const;

export const ClauseTypeEnum = z.enum(CLAUSE_TYPES);
export type ClauseType = z.infer<typeof ClauseTypeEnum>;

// ============================================================================
// Risk Level Enum
// ============================================================================

export const RISK_LEVELS = ["low", "medium", "high"] as const;

export const RiskLevelEnum = z.enum(RISK_LEVELS);
export type RiskLevel = z.infer<typeof RiskLevelEnum>;

// ============================================================================
// Benchmark Deviation Enum
// ============================================================================

export const BENCHMARK_DEVIATIONS = [
  "above_high",
  "below_low",
  "within_range",
] as const;

export const BenchmarkDeviationEnum = z.enum(BENCHMARK_DEVIATIONS);
export type BenchmarkDeviation = z.infer<typeof BenchmarkDeviationEnum>;

// ============================================================================
// Extraction Configuration
// ============================================================================

export const EXTRACTION_CONFIG = {
  /** Number of parallel batch extractions */
  BATCH_CONCURRENCY: 3,
  /** Max rows per database insert */
  DB_INSERT_BATCH_SIZE: 50,
  /** Passages to fetch per API call */
  PASSAGE_FETCH_LIMIT: 200,
  /** Milliseconds between indexing status checks */
  INDEXING_POLL_INTERVAL_MS: 2000,
  /** Max wait for file indexing to complete */
  INDEXING_TIMEOUT_MS: 120000,
} as const;

// ============================================================================
// Passage Batching Configuration
// ============================================================================

export const BATCHING_CONFIG = {
  /** Minimum passage length to include in batch */
  MIN_PASSAGE_LENGTH: 50,
  /** Maximum passages per extraction batch */
  MAX_BATCH_SIZE: 10,
  /** Target tokens per batch (approximate) */
  TARGET_BATCH_TOKENS: 8000,
} as const;

// ============================================================================
// Clause Type to Benchmark Mapping
// ============================================================================

/**
 * Maps extracted clause types to contractBenchmarksTable Clause_Type values.
 * Used to look up benchmark data for deviation analysis.
 */
export const CLAUSE_TO_BENCHMARK_MAP: Record<string, string> = {
  termination: "TERMINATION_NOTICE",
  payment_terms: "PAYMENT_TERMS",
  liability_limitation: "LIABILITY_CAP",
  indemnification: "INDEMNIFICATION",
  confidentiality: "CONFIDENTIALITY_PERIOD",
  force_majeure: "FORCE_MAJEURE",
  warranties: "WARRANTY_PERIOD",
  sla_terms: "SLA_CREDITS",
  pricing_terms: "PRICING_TERMS",
  rate_escalation: "RATE_ESCALATION",
  auto_renewal: "AUTO_RENEWAL",
  data_protection: "DATA_PROTECTION",
  transition_assistance: "TRANSITION_ASSISTANCE",
  insurance_requirements: "INSURANCE_REQUIREMENTS",
  benchmarking_rights: "BENCHMARKING_RIGHTS",
  exclusivity: "EXCLUSIVITY",
  governance: "GOVERNANCE",
  volume_commitment: "VOLUME_COMMITMENT",
};
