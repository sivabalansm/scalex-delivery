import { Table, z } from "@botpress/runtime";

/**
 * Session Survey Table
 * Post-session survey responses collected when users start a new conversation.
 */
export default new Table({
  name: "sessionSurveyTable",
  columns: {
    userId: z.string(),
    conversationId: z.string(),
    overallRating: z.number(), // 1-5 stars
    bestFeature: {
      schema: z.string().optional(),
      searchable: true,
    },
    improvementSuggestion: {
      schema: z.string().optional(),
      searchable: true,
    },
    expectedCapabilities: {
      schema: z.string().optional(),
      searchable: true,
    },
    wouldRecommend: z.number().optional(), // 1-10 NPS
    timestamp: z.string(),
  },
});
