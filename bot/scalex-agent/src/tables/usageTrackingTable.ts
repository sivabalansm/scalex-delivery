import { Table, z } from "@botpress/runtime";

/**
 * Usage Tracking Table
 * Tracks which tools and workflows users trigger during conversations.
 */
export default new Table({
  name: "usageTrackingTable",
  columns: {
    userId: z.string(),
    conversationId: z.string(),
    eventType: z.string(), // "tool_call" | "file_upload" | "session_start"
    toolName: z.string().optional(),
    queryType: z.string().optional(),
    metadata: z.string().optional(), // JSON string for extras
    timestamp: z.string(),
  },
});
