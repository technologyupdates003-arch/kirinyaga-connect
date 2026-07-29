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
  name: "create_event",
  title: "Create event",
  description: "Create a new KHCWW event. Requires admin role (enforced by RLS).",
  inputSchema: {
    title: z.string().min(1),
    event_date: z.string().optional().describe("YYYY-MM-DD"),
    event_time: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    agenda: z.string().optional(),
    status: z.enum(["upcoming", "past", "cancelled"]).default("upcoming"),
    cover_image_url: z.string().url().optional(),
    rsvp_url: z.string().url().optional(),
    gallery_url: z.string().url().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx).from("events").insert({
      title: input.title,
      event_date: input.event_date ?? null,
      event_time: input.event_time ?? null,
      location: input.location ?? null,
      description: input.description ?? null,
      agenda: input.agenda ?? null,
      status: input.status,
      cover_image_url: input.cover_image_url ?? null,
      rsvp_url: input.rsvp_url ?? null,
      gallery_url: input.gallery_url ?? null,
    }).select().single();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { event: data } };
  },
});
