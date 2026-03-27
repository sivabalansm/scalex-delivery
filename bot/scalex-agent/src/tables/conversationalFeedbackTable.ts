import { Table, z } from "@botpress/runtime";

/**
 * Conversational Feedback Table
 * Stores bot-asked perception questions and user responses.
 */
export default new Table({
  name: "conversationalFeedbackTable",
  columns: {
    userId: z.string(),
    conversationId: z.string(),
    questionAsked: z.string(),
    userResponse: {
      schema: z.string(),
      searchable: true,
    },
    responseCategory: z.string().optional(),
    timestamp: z.string(),
  },
});
