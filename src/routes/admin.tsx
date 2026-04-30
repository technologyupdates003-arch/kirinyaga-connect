import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Calendar, Users, LogOut, Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — KHCWW" }, { name: "robots", content: "noindex" }] }),
});

type EventRow = {
  id: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  description: string | null;
  agenda: string | null;
  status: string;
  cover_image_url: string | null;
  rsvp_url: string | null;
  gallery_url: string | null;
};

type TeamRow = {
  id: string;
  role: string;
  name: string;
  description: string | null;
  icon: string;
  photo_url: string | null;
  display_order: number;
};

const ICONS = ["Crown", "Shield", "ScrollText", "FileText", "Wallet", "Sparkles", "Star", "Users", "Heart"];
const STATUSES = ["upcoming", "past", "cancelled"];

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading) return <SiteLayout><div className="container py-20 text-center text-muted-foreground">Loading…</div></SiteLayout>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-foreground">Admin access required</h1>
          <p className="mt-3 text-muted-foreground">Your account ({user.email}) doesn't have admin privileges yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">Ask an existing admin to grant you the <code className="bg-secondary px-1.5 py-0.5 rounded">admin</code> role in <code className="bg-secondary px-1.5 py-0.5 rounded">user_roles</code>.</p>
          <Button className="mt-6" variant="outline" onClick={() => signOut().then(() => navigate({ to: "/" }))}>Sign out</Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage events and leadership team.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">View site</Link>
            <Button variant="outline" size="sm" onClick={() => signOut().then(() => navigate({ to: "/" }))}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="events" className="mt-8">
          <TabsList>
            <TabsTrigger value="events"><Calendar className="h-4 w-4 mr-1.5" />Events</TabsTrigger>
            <TabsTrigger value="team"><Users className="h-4 w-4 mr-1.5" />Team</TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="mt-6"><EventsAdmin /></TabsContent>
          <TabsContent value="team" className="mt-6"><TeamAdmin /></TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

/* ---------------- Events ---------------- */

function EventsAdmin() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false, nullsFirst: false });
    if (error) toast.error(error.message);
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Event deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setCreating(true); setEditing(null); }}>
          <Plus className="h-4 w-4" /> New event
        </Button>
      </div>

      {(creating || editing) && (
        <EventForm
          initial={editing}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : events.length === 0 ? (
        <p className="text-muted-foreground">No events yet.</p>
      ) : (
        <div className="grid gap-3">
          {events.map((e) => (
            <Card key={e.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{e.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === "upcoming" ? "bg-primary/10 text-primary" : e.status === "past" ? "bg-secondary text-muted-foreground" : "bg-destructive/10 text-destructive"}`}>{e.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {e.event_date ?? "No date"} {e.event_time && `· ${e.event_time}`} {e.location && `· ${e.location}`}
                  </p>
                  {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(e); setCreating(false); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" onClick={() => remove(e.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EventForm({ initial, onCancel, onSaved }: { initial: EventRow | null; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    event_date: initial?.event_date ?? "",
    event_time: initial?.event_time ?? "",
    location: initial?.location ?? "",
    description: initial?.description ?? "",
    agenda: initial?.agenda ?? "",
    status: initial?.status ?? "upcoming",
    cover_image_url: initial?.cover_image_url ?? "",
    rsvp_url: initial?.rsvp_url ?? "",
    gallery_url: initial?.gallery_url ?? "",
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      event_date: form.event_date || null,
      event_time: form.event_time || null,
      location: form.location || null,
      description: form.description || null,
      agenda: form.agenda || null,
      status: form.status,
      cover_image_url: form.cover_image_url || null,
      rsvp_url: form.rsvp_url || null,
      gallery_url: form.gallery_url || null,
    };
    const { error } = initial
      ? await supabase.from("events").update(payload).eq("id", initial.id)
      : await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Event updated" : "Event created");
    onSaved();
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{initial ? "Edit event" : "New event"}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
          </div>
          <div>
            <Label>Time</Label>
            <Input placeholder="e.g. 10:00 AM" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Agenda</Label>
            <Textarea rows={4} placeholder="One item per line" value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} />
          </div>
          <div>
            <Label>Cover image URL</Label>
            <Input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} />
          </div>
          <div>
            <Label>RSVP URL</Label>
            <Input value={form.rsvp_url} onChange={(e) => setForm({ ...form, rsvp_url: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Gallery URL (album)</Label>
            <Input value={form.gallery_url} onChange={(e) => setForm({ ...form, gallery_url: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}><X className="h-4 w-4" /> Cancel</Button>
            <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ---------------- Team ---------------- */

function TeamAdmin() {
  const [team, setTeam] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<TeamRow | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true });
    if (error) toast.error(error.message);
    setTeam(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this team member?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setCreating(true); setEditing(null); }}>
          <Plus className="h-4 w-4" /> Add member
        </Button>
      </div>

      {(creating || editing) && (
        <TeamForm
          initial={editing}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : team.length === 0 ? (
        <p className="text-muted-foreground">No team members yet.</p>
      ) : (
        <div className="grid gap-3">
          {team.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{m.role} <span className="text-xs font-normal text-muted-foreground">#{m.display_order}</span></h3>
                  <p className="text-sm text-muted-foreground">{m.name || <em>Unnamed</em>} · icon: {m.icon}</p>
                  {m.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{m.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(m); setCreating(false); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" onClick={() => remove(m.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamForm({ initial, onCancel, onSaved }: { initial: TeamRow | null; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    role: initial?.role ?? "",
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "Sparkles",
    photo_url: initial?.photo_url ?? "",
    display_order: initial?.display_order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      role: form.role,
      name: form.name,
      description: form.description || null,
      icon: form.icon,
      photo_url: form.photo_url || null,
      display_order: Number(form.display_order) || 0,
    };
    const { error } = initial
      ? await supabase.from("team_members").update(payload).eq("id", initial.id)
      : await supabase.from("team_members").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Member updated" : "Member added");
    onSaved();
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{initial ? "Edit member" : "Add member"}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Role *</Label>
            <Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label>Icon</Label>
            <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ICONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Display order</Label>
            <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Photo URL</Label>
            <Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
          </div>
          <div className="sm:col-span-2 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}><X className="h-4 w-4" /> Cancel</Button>
            <Button type="submit" disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
