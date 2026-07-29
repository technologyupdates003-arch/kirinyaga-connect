import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "update_event",
  title: "Update event",
  description: "Update fields on an existing KHCWW event by id. Requires admin role (enforced by RLS).",
  inputSchema: {
    id: z.string().uuid(),
    title: z.string().optional(),
    event_date: z.string().nullable().optional(),
    event_time: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    agenda: z.string().nullable().optional(),
    status: z.enum(["upcoming", "past", "cancelled"]).optional(),
    cover_image_url: z.string().url().nullable().optional(),
    rsvp_url: z.string().url().nullable().optional(),
    gallery_url: z.string().url().nullable().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ id, ...patch }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx).from("events").update(patch).eq("id", id).select().single();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { event: data } };
  },
});
