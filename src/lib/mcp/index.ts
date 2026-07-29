import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listEvents from "./tools/list-events";
import createEvent from "./tools/create-event";
import updateEvent from "./tools/update-event";
import deleteEvent from "./tools/delete-event";
import listTeam from "./tools/list-team";
import upsertTeam from "./tools/upsert-team";
import deleteTeam from "./tools/delete-team";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "khcww-mcp",
  title: "KHCWW",
  version: "0.1.0",
  instructions:
    "Tools for the Kirinyaga Healthcare Workers' Welfare (KHCWW) site. Use `list_events` and `list_team_members` to read public roster data. Admin-only tools (`create_event`, `update_event`, `delete_event`, `upsert_team_member`, `delete_team_member`) require the signed-in user to hold the admin role; RLS enforces this and returns an error otherwise.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listEvents, createEvent, updateEvent, deleteEvent, listTeam, upsertTeam, deleteTeam],
});
