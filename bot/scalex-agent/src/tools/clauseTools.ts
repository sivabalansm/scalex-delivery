import { Autonomous, z, adk } from "@botpress/runtime";
import type { Client } from "@botpress/client";
import { ClauseTypeEnum, RiskLevelEnum, BenchmarkDeviationEnum } from "../utils/constants";

/**
 * Clause schema used by tools
 */
export const ClauseToolSchema = z.object({
  id: z.number(),
  title: z.string(),
  clauseType: z.string(),
  riskLevel: z.string(),
  text: z.string(),
  keyPoints: z.array(z.string()),
  benchmarkDeviation: z.string().optional(),
  redlineRecommendation: z.string().optional(),
});

export type ClauseToolData = z.infer<typeof ClauseToolSchema>;

/**
 * Creates a query_extracted_clauses tool for searching extracted clauses.
 * Extended with benchmarkDeviation filter for ScaleX procurement analysis.
 */
export function createQueryClausesTool(client: Client, userId: string) {
  return new Autonomous.Tool({
    name: "query_extracted_clauses",
    description:
      "Search extracted clauses by clause type, risk level, benchmark deviation, IDs, or text content. Use this after a contract has been analyzed.",
    input: z.object({
      clauseIds: z
        .array(z.number())
        .optional()
        .describe("Filter to specific clause IDs"),
      contractId: z
        .number()
        .optional()
        .describe("Contract ID to search within (if known)"),
      clauseType: ClauseTypeEnum.optional().describe("Filter by clause type"),
      riskLevel: RiskLevelEnum.optional().describe("Filter by risk level"),
      searchText: z
        .string()
        .optional()
        .describe("Search for text content in clauses"),
      benchmarkDeviation: BenchmarkDeviationEnum.optional()
        .describe("Filter by benchmark deviation: above_high, below_low, or within_range"),
    }),
    output: z.object({
      clauses: z.array(ClauseToolSchema),
      count: z.number(),
    }),
    handler: async ({ clauseIds, contractId, clauseType, riskLevel, searchText, benchmarkDeviation }) => {
      console.debug("[TOOL] query_extracted_clauses called", {
        userId,
        clauseIds,
        contractId,
        clauseType,
        riskLevel,
        searchText,
        benchmarkDeviation,
      });

      // Build filter - ALWAYS include userId for security (LLM cannot override)
      const filter: Record<string, unknown> = {
        userId: { $eq: userId }, // MANDATORY: scope to current user
      };

      if (clauseIds && clauseIds.length > 0) {
        filter.id = { $in: clauseIds };
      }

      if (contractId) {
        filter.contractId = { $eq: contractId };
      }

      if (clauseType) {
        filter.clauseType = { $eq: clauseType };
      }

      if (riskLevel) {
        filter.riskLevel = { $eq: riskLevel };
      }

      if (benchmarkDeviation) {
        filter.benchmarkDeviation = { $eq: benchmarkDeviation };
      }

      // Execute search
      const { rows } = await client.findTableRows({
        table: "extractedClausesTable",
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        search: searchText,
        limit: 50,
        orderBy: "position",
        orderDirection: "asc",
      });

      // Parse and format results
      const clauses = rows.map((row) => ({
        id: Number(row.id),
        title: row.title.toString(),
        clauseType: row.clauseType.toString(),
        riskLevel: row.riskLevel.toString(),
        text: row.text.toString(),
        keyPoints: JSON.parse(row.keyPoints.toString()),
        benchmarkDeviation: row.benchmarkDeviation?.toString(),
        redlineRecommendation: row.redlineRecommendation?.toString(),
      }));

      console.debug("[TOOL] Found clauses:", clauses.length);

      return {
        clauses,
        count: clauses.length,
      };
    },
  });
}

/**
 * Creates a summarize_extracted_clauses tool for analyzing clauses.
 * Includes procurement-expert instructions for ScaleX context.
 */
export function createSummarizeClausesTool() {
  return new Autonomous.Tool({
    name: "summarize_extracted_clauses",
    description:
      "Analyze clauses and answer questions about them. Use after query_extracted_clauses to provide insights, risk analysis, comparisons, or recommendations. Pass the clauses from query_extracted_clauses output.",
    input: z.object({
      question: z
        .string()
        .describe("The question or analysis request about the clauses"),
      clauses: z
        .array(ClauseToolSchema)
        .describe("Clauses from query_extracted_clauses output to analyze"),
    }),
    output: z.object({
      answer: z.string(),
      type: z.enum([
        "answer",
        "ambiguous",
        "out_of_topic",
        "invalid_question",
        "missing_knowledge",
      ]),
      followUp: z.string().optional(),
      citedClauseIds: z.array(z.number()),
    }),
    handler: async ({ question, clauses }) => {
      console.debug("[TOOL] summarize_extracted_clauses called", {
        question,
        clauseCount: clauses.length,
      });

      if (clauses.length === 0) {
        return {
          answer: "No clauses provided to analyze.",
          type: "missing_knowledge" as const,
          citedClauseIds: [],
        };
      }

      const result = await adk.zai.answer(clauses, question, {
        instructions: `You are a procurement contract analysis expert specializing in outsourcing and managed services agreements.
Provide clear, actionable insights about the clauses.
When discussing risk, explain the implications and recommend specific actions.
When benchmark deviations are present, highlight them and suggest negotiation strategies.
Use markdown formatting (headings, bullets) for readability.
Always reference specific clauses when making claims.
Focus on commercial impact, SLA obligations, and risk mitigation strategies.`,
      });

      if (result.type === "answer") {
        return {
          answer: result.answer,
          type: "answer" as const,
          citedClauseIds: result.citations.map((c) => c.item.id),
        };
      } else if (result.type === "ambiguous") {
        return {
          answer: result.answers[0]?.answer || "The question is ambiguous.",
          type: "ambiguous" as const,
          followUp: result.follow_up,
          citedClauseIds: [],
        };
      } else {
        return {
          answer: result.reason,
          type: result.type,
          citedClauseIds: [],
        };
      }
    },
  });
}
