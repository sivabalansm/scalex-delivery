import { Table, z } from "@botpress/runtime";

/**
 * Message Feedback Table
 * Per-message thumbs up/down ratings with optional comments.
 */
export default new Table({
  name: "messageFeedbackTable",
  columns: {
    userId: z.string(),
    conversationId: z.string(),
    messageId: z.string(),
    rating: z.number(), // 1 = up, -1 = down
    comment: z.string().optional(),
    messagePreview: z.string().optional(),
    timestamp: z.string(),
  },
});
