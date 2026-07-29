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
  name: "upsert_team_member",
  title: "Create or update team member",
  description: "Create a new team member, or update an existing one when `id` is provided. Requires admin role (enforced by RLS).",
  inputSchema: {
    id: z.string().uuid().optional(),
    role: z.string().min(1),
    name: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().default("Sparkles"),
    photo_url: z.string().url().optional(),
    display_order: z.number().int().default(0),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ id, ...input }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const payload = {
      role: input.role,
      name: input.name ?? null,
      description: input.description ?? null,
      icon: input.icon,
      photo_url: input.photo_url ?? null,
      display_order: input.display_order,
    };
    const client = sb(ctx);
    const { data, error } = id
      ? await client.from("team_members").update(payload).eq("id", id).select().single()
      : await client.from("team_members").insert(payload).select().single();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { member: data } };
  },
});
