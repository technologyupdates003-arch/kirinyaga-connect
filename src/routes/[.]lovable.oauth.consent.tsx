import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type OAuthAuthDetails = {
  client?: { name?: string; client_uri?: string } | null;
  redirect_url?: string;
  redirect_to?: string;
} | null;

type OAuthAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthAuthDetails; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthAuthDetails; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthAuthDetails; error: { message: string } | null }>;
};

function oauth(): OAuthAuthNamespace {
  return (supabase.auth as unknown as { oauth: OAuthAuthNamespace }).oauth;
}

function isSafeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//");
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) {
      throw redirect({ to: "/login", search: { next: isSafeNext(next) ? next : "/" } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="container mx-auto max-w-md py-20">
      <h1 className="text-xl font-semibold">Authorization error</h1>
      <p className="mt-2 text-sm text-muted-foreground">{(error as Error)?.message ?? String(error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "an app";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (err) { setBusy(false); setError(err.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  return (
    <main className="container mx-auto max-w-md py-20">
      <h1 className="text-2xl font-bold">Connect {clientName} to KHCWW</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This lets {clientName} call KHCWW tools on your behalf. Admin-only actions still require your admin role.
      </p>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex gap-2">
        <Button onClick={() => decide(true)} disabled={busy}>Approve</Button>
        <Button variant="outline" onClick={() => decide(false)} disabled={busy}>Deny</Button>
      </div>
    </main>
  );
}
