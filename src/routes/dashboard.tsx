import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Image as ImageIcon, ShieldCheck, Clock, XCircle, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — KHCWW" }] }),
  component: DashboardPage,
});

type Member = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  workplace: string;
  department: string;
  next_of_kin_name: string;
  next_of_kin_contact: string;
  status: "pending" | "approved" | "rejected";
  id_card_path: string | null;
  passport_photo_path: string | null;
  created_at: string;
};

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<{ id?: string; photo?: string }>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Member>>({});

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setMember(data as Member | null);
      setForm(data ?? {});
      if (data) {
        const urls: { id?: string; photo?: string } = {};
        if (data.id_card_path) {
          const { data: s } = await supabase.storage.from("member-documents").createSignedUrl(data.id_card_path, 3600);
          urls.id = s?.signedUrl;
        }
        if (data.passport_photo_path) {
          const { data: s } = await supabase.storage.from("member-documents").createSignedUrl(data.passport_photo_path, 3600);
          urls.photo = s?.signedUrl;
        }
        setSignedUrls(urls);
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!member) return;
    const { error } = await supabase.from("members").update({
      full_name: form.full_name,
      phone: form.phone,
      workplace: form.workplace,
      department: form.department,
      next_of_kin_name: form.next_of_kin_name,
      next_of_kin_contact: form.next_of_kin_contact,
    }).eq("id", member.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      setMember({ ...member, ...form } as Member);
      setEditing(false);
    }
  };

  if (authLoading || loading) {
    return <SiteLayout><div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Loading...</div></SiteLayout>;
  }

  if (!member) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto text-center bg-gradient-card border border-border/60 rounded-3xl p-10 shadow-soft">
            <h1 className="text-2xl font-bold text-foreground">No registration on file</h1>
            <p className="mt-3 text-muted-foreground">You haven't registered as a welfare member yet.</p>
            <Button asChild className="mt-6 bg-gradient-hero text-primary-foreground"><Link to="/register">Register now</Link></Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Member dashboard</span>
            <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">Welcome, {member.full_name.split(" ")[0]}</h1>
          </div>
          <StatusBadge status={member.status} />
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-card border border-border/60 rounded-2xl p-6 lg:p-8 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">Profile</h2>
              {editing ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setForm(member); }}>Cancel</Button>
                  <Button size="sm" onClick={save}>Save</Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </div>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <Row label="Full name" value={form.full_name} editing={editing} onChange={(v) => setForm({ ...form, full_name: v })} />
              <Row label="Phone" value={form.phone} editing={editing} onChange={(v) => setForm({ ...form, phone: v })} />
              <Row label="Email" value={member.email} editing={false} onChange={() => {}} />
              <Row label="Workplace" value={form.workplace} editing={editing} onChange={(v) => setForm({ ...form, workplace: v })} />
              <Row label="Department" value={form.department} editing={editing} onChange={(v) => setForm({ ...form, department: v })} />
              <Row label="Next of kin" value={form.next_of_kin_name} editing={editing} onChange={(v) => setForm({ ...form, next_of_kin_name: v })} />
              <Row label="Next of kin contact" value={form.next_of_kin_contact} editing={editing} onChange={(v) => setForm({ ...form, next_of_kin_contact: v })} />
            </div>
          </div>

          <div className="bg-gradient-card border border-border/60 rounded-2xl p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-foreground">Documents</h2>
            <div className="mt-5 space-y-4">
              <DocLink icon={FileText} label="ID Card" url={signedUrls.id} />
              <DocLink icon={ImageIcon} label="Passport photo" url={signedUrls.photo} />
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Document URLs expire after 1 hour and refresh on reload.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function StatusBadge({ status }: { status: Member["status"] }) {
  const map = {
    pending: { label: "Pending review", icon: Clock, cls: "bg-accent/40 text-accent-foreground border-accent" },
    approved: { label: "Approved member", icon: ShieldCheck, cls: "bg-primary/15 text-primary border-primary/30" },
    rejected: { label: "Not approved", icon: XCircle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
  }[status];
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${map.cls}`}>
      <Icon className="h-3.5 w-3.5" /> {map.label}
    </span>
  );
}

function Row({ label, value, editing, onChange }: { label: string; value: string | null | undefined; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</Label>
      {editing ? (
        <Input className="mt-1.5" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <div className="mt-1 text-foreground">{value || "—"}</div>
      )}
    </div>
  );
}

function DocLink({ icon: Icon, label, url }: { icon: React.ElementType; label: string; url?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          View <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">Not uploaded</span>
      )}
    </div>
  );
}
