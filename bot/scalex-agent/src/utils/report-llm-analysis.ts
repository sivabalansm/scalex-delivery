import { adk } from "@botpress/runtime";
import { CLAUSE_TYPES } from "./constants";

/**
 * Extracted clause data needed for report analysis.
 * Matches the shape stored in extractedClausesTable.
 */
export interface ReportClause {
  clauseType: string;
  title: string;
  text: string;
  keyPoints: string[];
  riskLevel: "low" | "medium" | "high";
  benchmarkDeviation?: string;
  redlineRecommendation?: string;
  section?: string;
}

/**
 * Standard protections expected per contract type.
 * Used to detect missing clauses.
 */
const STANDARD_PROTECTIONS: Record<string, string[]> = {
  service_agreement: [
    "termination",
    "liability_limitation",
    "sla_terms",
    "data_protection",
    "confidentiality",
    "indemnification",
    "governing_law",
    "dispute_resolution",
    "insurance_requirements",
  ],
  procurement: [
    "termination",
    "liability_limitation",
    "sla_terms",
    "data_protection",
    "confidentiality",
    "indemnification",
    "governing_law",
    "dispute_resolution",
    "insurance_requirements",
    "pricing_terms",
    "volume_commitment",
    "transition_assistance",
    "benchmarking_rights",
    "rate_escalation",
    "governance",
  ],
  default: [
    "termination",
    "liability_limitation",
    "confidentiality",
    "indemnification",
    "governing_law",
    "dispute_resolution",
    "data_protection",
  ],
};

/**
 * Analyze which standard protections are missing from the contract.
 */
export async function analyzeMissingProtections(
  clauses: ReportClause[],
  contractType?: string
): Promise<string[]> {
  const foundTypes = new Set(clauses.map((c) => c.clauseType));

  // Determine which checklist to use
  let checklistKey = "default";
  if (contractType) {
    const normalized = contractType.toLowerCase().replace(/[^a-z_]/g, "_");
    if (normalized.includes("procurement") || normalized.includes("outsourc")) {
      checklistKey = "procurement";
    } else if (normalized.includes("service") || normalized.includes("msa")) {
      checklistKey = "service_agreement";
    }
  }

  const expectedTypes = STANDARD_PROTECTIONS[checklistKey] || STANDARD_PROTECTIONS.default;
  const missingTypes = expectedTypes.filter((t) => !foundTypes.has(t));

  if (missingTypes.length === 0) {
    return [];
  }

  // Use LLM to generate human-readable descriptions
  const missingList = missingTypes
    .map((t) => t.replace(/_/g, " "))
    .join(", ");

  const analysis = await adk.zai.text(
    `Given a ${contractType || "general"} contract that is MISSING the following standard protections: ${missingList}

For each missing protection, provide a one-sentence explanation of:
- What the protection covers
- Why it matters / the risk of omitting it

Format as a bullet list. One bullet per missing protection. Keep each bullet under 30 words.
Example format:
- Termination clause: Defines exit rights and notice periods. Without it, parties may be locked into unfavorable terms indefinitely.`,
    { length: 300 }
  );

  // Parse bullets from the response
  return analysis
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter((line) => line.length > 10);
}

/**
 * Generate specific redline recommendations for high/medium risk clauses.
 */
export async function analyzeRedlineRecommendations(
  clauses: ReportClause[]
): Promise<Array<{ clauseTitle: string; clauseType: string; originalExcerpt: string; suggestedChange: string }>> {
  const riskyClasses = clauses.filter(
    (c) => c.riskLevel === "high" || c.riskLevel === "medium"
  );

  if (riskyClasses.length === 0) {
    return [];
  }

  // Build clause summaries for the prompt
  const clauseSummaries = riskyClasses
    .map((c, i) => {
      const excerpt = c.text.length > 300 ? c.text.slice(0, 300) + "..." : c.text;
      const existing = c.redlineRecommendation ? `\nExisting recommendation: ${c.redlineRecommendation}` : "";
      return `[${i + 1}] ${c.clauseType.toUpperCase()} — "${c.title}" (${c.riskLevel} risk)\nText: ${excerpt}${existing}`;
    })
    .join("\n\n");

  const analysis = await adk.zai.text(
    `You are a procurement contract attorney. For each clause below, provide a specific redline recommendation.

CLAUSES:
${clauseSummaries}

For each clause, output exactly this format (one per clause, separated by ---):
CLAUSE: [number]
ORIGINAL: [Quote the specific problematic language, max 50 words]
SUGGESTED: [Provide the exact replacement language that reduces risk]

Be specific — don't say "add a cap", say "Liability shall not exceed 12 months of fees paid under this Agreement."
Focus on the highest-impact change for each clause.`,
    { length: 500 }
  );

  // Parse structured response
  const recommendations: Array<{ clauseTitle: string; clauseType: string; originalExcerpt: string; suggestedChange: string }> = [];
  const blocks = analysis.split("---").map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const clauseMatch = block.match(/CLAUSE:\s*\[?(\d+)\]?/i);
    const originalMatch = block.match(/ORIGINAL:\s*(.+?)(?=\nSUGGESTED:|$)/is);
    const suggestedMatch = block.match(/SUGGESTED:\s*(.+?)$/is);

    if (clauseMatch && originalMatch && suggestedMatch) {
      const idx = parseInt(clauseMatch[1]) - 1;
      const clause = riskyClasses[idx];
      if (clause) {
        recommendations.push({
          clauseTitle: clause.title,
          clauseType: clause.clauseType,
          originalExcerpt: originalMatch[1].trim(),
          suggestedChange: suggestedMatch[1].trim(),
        });
      }
    }
  }

  // Fallback: if parsing failed, create basic recommendations from existing data
  if (recommendations.length === 0) {
    for (const clause of riskyClasses) {
      if (clause.redlineRecommendation) {
        recommendations.push({
          clauseTitle: clause.title,
          clauseType: clause.clauseType,
          originalExcerpt: clause.text.slice(0, 150) + (clause.text.length > 150 ? "..." : ""),
          suggestedChange: clause.redlineRecommendation,
        });
      }
    }
  }

  return recommendations;
}

/**
 * Analyze and prioritize negotiation items by risk and impact.
 */
export async function analyzeNegotiationPriorities(
  clauses: ReportClause[]
): Promise<string[]> {
  if (clauses.length === 0) {
    return [];
  }

  // Build a summary of all clauses with risk info
  const clauseSummary = clauses
    .map((c) => {
      const deviation = c.benchmarkDeviation ? ` [benchmark: ${c.benchmarkDeviation}]` : "";
      return `- ${c.clauseType} "${c.title}" (${c.riskLevel} risk)${deviation}: ${c.keyPoints.slice(0, 2).join("; ")}`;
    })
    .join("\n");

  const analysis = await adk.zai.text(
    `You are a procurement negotiation strategist. Based on these extracted contract clauses, provide a prioritized negotiation list.

CLAUSES:
${clauseSummary}

Create a numbered list of the top 5-8 negotiation priorities, ordered by urgency/impact (highest first).
Each item should be 1-2 sentences: what to negotiate and why.
Focus on items that have the greatest commercial impact or risk exposure.
Start each item with the clause type in brackets, e.g., [Liability Limitation].`,
    { length: 400 }
  );

  // Parse numbered list
  return analysis
    .split("\n")
    .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line) => line.length > 15);
}
