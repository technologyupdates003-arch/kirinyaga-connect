import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, FileText, Image as ImageIcon, Calendar, Mail, Settings, Plus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — KHCWW" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading) return <SiteLayout><div className="container mx-auto py-24 text-center text-muted-foreground">Loading...</div></SiteLayout>;

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto text-center bg-gradient-card border border-border/60 rounded-3xl p-10 shadow-soft">
            <h1 className="text-2xl font-bold text-foreground">Admin access required</h1>
            <p className="mt-3 text-muted-foreground">
              You don't have admin permissions. Contact a welfare officer to grant you access.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Your user ID: <code className="bg-muted px-2 py-1 rounded">{user?.id}</code>
            </p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</span>
          <h1 className="mt-2 text-3xl lg:text-4xl font-bold text-foreground">Welfare administration</h1>
        </div>

        <Tabs defaultValue="members" className="mt-8">
          <TabsList className="bg-secondary/60">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-6"><MembersTab /></TabsContent>
          <TabsContent value="events" className="mt-6"><EventsTab /></TabsContent>
          <TabsContent value="messages" className="mt-6"><MessagesTab /></TabsContent>
          <TabsContent value="settings" className="mt-6"><SettingsTab /></TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

/* ---------- MEMBERS ---------- */

type AdminMember = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  national_id: string;
  workplace: string;
  department: string;
  next_of_kin_name: string;
  next_of_kin_contact: string;
  status: "pending" | "approved" | "rejected";
  id_card_path: string | null;
  passport_photo_path: string | null;
  created_at: string;
};

function MembersTab() {
  const [rows, setRows] = useState<AdminMember[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const load = async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as AdminMember[]);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("members").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    load();
  };

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-smooth ${
              filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-70">
              ({f === "all" ? rows.length : rows.filter((r) => r.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No registrations.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <MemberCard key={m.id} m={m} onStatus={setStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function MemberCard({ m, onStatus }: { m: AdminMember; onStatus: (id: string, s: "approved" | "rejected") => void }) {
  const [docUrls, setDocUrls] = useState<{ id?: string; photo?: string }>({});
  const [open, setOpen] = useState(false);

  const loadDocs = async () => {
    const urls: { id?: string; photo?: string } = {};
    if (m.id_card_path) {
      const { data } = await supabase.storage.from("member-documents").createSignedUrl(m.id_card_path, 3600);
      urls.id = data?.signedUrl;
    }
    if (m.passport_photo_path) {
      const { data } = await supabase.storage.from("member-documents").createSignedUrl(m.passport_photo_path, 3600);
      urls.photo = data?.signedUrl;
    }
    setDocUrls(urls);
  };

  return (
    <div className="bg-gradient-card border border-border/60 rounded-2xl p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{m.full_name}</h3>
            <StatusPill status={m.status} />
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{m.workplace} · {m.department}</div>
          <div className="mt-1 text-xs text-muted-foreground">{m.email} · {m.phone} · ID {m.national_id}</div>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) loadDocs(); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">View details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{m.full_name}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                <Detail k="Email" v={m.email} />
                <Detail k="Phone" v={m.phone} />
                <Detail k="National ID" v={m.national_id} />
                <Detail k="Workplace" v={m.workplace} />
                <Detail k="Department" v={m.department} />
                <Detail k="Next of kin" v={`${m.next_of_kin_name} (${m.next_of_kin_contact})`} />
                <div className="flex gap-2 pt-3 border-t border-border">
                  {docUrls.id && <Button asChild size="sm" variant="outline"><a href={docUrls.id} target="_blank" rel="noopener noreferrer"><FileText className="h-4 w-4 mr-1.5" />ID</a></Button>}
                  {docUrls.photo && <Button asChild size="sm" variant="outline"><a href={docUrls.photo} target="_blank" rel="noopener noreferrer"><ImageIcon className="h-4 w-4 mr-1.5" />Photo</a></Button>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {m.status !== "approved" && (
            <Button size="sm" onClick={() => onStatus(m.id, "approved")} className="bg-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
          )}
          {m.status !== "rejected" && (
            <Button size="sm" variant="outline" onClick={() => onStatus(m.id, "rejected")}>
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-muted-foreground">{k}</div>
      <div className="col-span-2 text-foreground">{v}</div>
    </div>
  );
}

function StatusPill({ status }: { status: AdminMember["status"] }) {
  const cls = status === "approved" ? "bg-primary/15 text-primary"
    : status === "rejected" ? "bg-destructive/15 text-destructive"
    : "bg-accent/40 text-accent-foreground";
  return <span className={`text-[10px] uppercase tracking-wider font-semibold rounded-full px-2 py-0.5 ${cls}`}>{status}</span>;
}

/* ---------- EVENTS ---------- */

function EventsTab() {
  type EventRow = { id: string; title: string; event_date: string | null; description: string | null; location: string | null; cover_image_url: string | null };
  const [rows, setRows] = useState<EventRow[]>([]);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setRows((data ?? []) as EventRow[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      title: editing.title,
      event_date: editing.event_date || null,
      description: editing.description,
      location: editing.location,
      cover_image_url: editing.cover_image_url,
    };
    const { error } = editing.id
      ? await supabase.from("events").update(payload).eq("id", editing.id)
      : await supabase.from("events").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Event saved");
    setOpen(false); setEditing(null); load();
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted"); load();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setEditing({ id: "", title: "", event_date: "", description: "", location: "", cover_image_url: "" }); setOpen(true); }} className="bg-gradient-hero text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> New event
        </Button>
      </div>
      <div className="space-y-3">
        {rows.map((e) => (
          <div key={e.id} className="bg-gradient-card border border-border/60 rounded-xl p-4 shadow-soft flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground">{e.event_date ?? "No date"} · {e.location ?? "No location"}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(e); setOpen(true); }}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => del(e.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Date</Label><Input type="date" value={editing.event_date ?? ""} onChange={(e) => setEditing({ ...editing, event_date: e.target.value })} /></div>
              <div><Label>Location</Label><Input value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></div>
              <div><Label>Cover image URL (optional)</Label><Input value={editing.cover_image_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={4} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- MESSAGES ---------- */

function MessagesTab() {
  type Msg = { id: string; name: string; email: string; message: string; created_at: string };
  const [rows, setRows] = useState<Msg[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Msg[]);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    await supabase.from("contact_messages").delete().eq("id", id);
    load();
  };
  return (
    <div className="space-y-3">
      {rows.length === 0 ? <p className="text-muted-foreground text-sm">No messages yet.</p> : null}
      {rows.map((m) => (
        <div key={m.id} className="bg-gradient-card border border-border/60 rounded-xl p-5 shadow-soft">
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span className="font-medium text-foreground">{m.name}</span></div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.email} · {new Date(m.created_at).toLocaleString()}</div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => del(m.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
          <p className="mt-3 text-sm text-foreground/90 whitespace-pre-wrap">{m.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- SETTINGS ---------- */

function SettingsTab() {
  const [galleryUrl, setGalleryUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("gallery_url").eq("id", 1).maybeSingle();
      setGalleryUrl(data?.gallery_url ?? "");
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    const { error } = await supabase.from("site_settings").update({ gallery_url: galleryUrl }).eq("id", 1);
    if (error) toast.error(error.message);
    else toast.success("Gallery URL saved");
  };

  return (
    <div className="max-w-2xl bg-gradient-card border border-border/60 rounded-2xl p-6 lg:p-8 shadow-soft">
      <div className="flex items-center gap-2 text-foreground"><Settings className="h-4 w-4 text-primary" /><h3 className="font-semibold">Gallery URL</h3></div>
      <p className="mt-2 text-sm text-muted-foreground">
        The URL shown on the public Gallery page. Currently linked to your Pixieset gallery.
      </p>
      <Input className="mt-4" disabled={loading} value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} />
      <Button className="mt-4 bg-gradient-hero text-primary-foreground" onClick={save}>Save</Button>
    </div>
  );
}
