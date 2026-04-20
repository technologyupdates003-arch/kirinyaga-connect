import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Upload, FileText } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — KHCWW" },
      { name: "description", content: "Register as a welfare member of Kirinyaga Healthcare Workers' Welfare." },
    ],
  }),
  component: RegisterPage,
});

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_BYTES = 5 * 1024 * 1024;

const fileSchema = z
  .instanceof(File, { message: "File required" })
  .refine((f) => f.size <= MAX_BYTES, "Max 5MB")
  .refine((f) => ACCEPTED.includes(f.type), "Must be JPG, PNG, WEBP or PDF");

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  national_id: z.string().trim().min(4).max(20),
  workplace: z.string().trim().min(2).max(150),
  department: z.string().trim().min(2).max(120),
  next_of_kin_name: z.string().trim().min(2).max(120),
  next_of_kin_contact: z.string().trim().min(7).max(120),
  id_card: fileSchema,
  passport_photo: fileSchema.refine(
    (f) => f.type.startsWith("image/"),
    "Passport photo must be an image"
  ),
});

type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const { user } = useAuth();
  const [done, setDone] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: FormValues) => {
    try {
      const folder = user?.id ?? `public-${crypto.randomUUID()}`;
      const idPath = `${folder}/id-${Date.now()}-${v.id_card.name}`;
      const photoPath = `${folder}/photo-${Date.now()}-${v.passport_photo.name}`;

      const [{ error: e1 }, { error: e2 }] = await Promise.all([
        supabase.storage.from("member-documents").upload(idPath, v.id_card, { upsert: false }),
        supabase.storage.from("member-documents").upload(photoPath, v.passport_photo, { upsert: false }),
      ]);
      if (e1 || e2) throw new Error(e1?.message || e2?.message);

      const { error } = await supabase.from("members").insert({
        user_id: user?.id ?? null,
        full_name: v.full_name,
        phone: v.phone,
        email: v.email,
        national_id: v.national_id,
        workplace: v.workplace,
        department: v.department,
        next_of_kin_name: v.next_of_kin_name,
        next_of_kin_contact: v.next_of_kin_contact,
        id_card_path: idPath,
        passport_photo_path: photoPath,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Registration submitted!");
    } catch (err: any) {
      toast.error(err.message ?? "Registration failed");
    }
  };

  if (done) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto text-center bg-gradient-card border border-border/60 rounded-3xl p-10 shadow-elegant">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9 text-primary" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-foreground">Registration received!</h1>
            <p className="mt-3 text-muted-foreground">
              Thank you for joining KHCWW. A welfare officer will review your application
              and you'll hear from us soon.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
              {!user && <Button asChild className="bg-gradient-hero text-primary-foreground"><Link to="/login">Create login</Link></Button>}
              {user && <Button asChild className="bg-gradient-hero text-primary-foreground"><Link to="/dashboard">Go to dashboard</Link></Button>}
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Registration</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">Welfare member registration</h1>
          <p className="mt-5 text-muted-foreground">
            Fill in your details and upload a copy of your ID and a passport-size photo.
            All information is kept confidential.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 max-w-3xl space-y-8">
          <FormSection title="Personal information">
            <Field id="full_name" label="Full name" error={form.formState.errors.full_name?.message}>
              <Input id="full_name" {...form.register("full_name")} maxLength={120} />
            </Field>
            <Field id="phone" label="Phone number" error={form.formState.errors.phone?.message}>
              <Input id="phone" type="tel" placeholder="+254..." {...form.register("phone")} maxLength={20} />
            </Field>
            <Field id="email" label="Email address" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" {...form.register("email")} maxLength={255} />
            </Field>
            <Field id="national_id" label="National ID number" error={form.formState.errors.national_id?.message}>
              <Input id="national_id" {...form.register("national_id")} maxLength={20} />
            </Field>
          </FormSection>

          <FormSection title="Workplace">
            <Field id="workplace" label="Workplace / facility" error={form.formState.errors.workplace?.message}>
              <Input id="workplace" placeholder="e.g. Kerugoya County Referral Hospital" {...form.register("workplace")} maxLength={150} />
            </Field>
            <Field id="department" label="Department" error={form.formState.errors.department?.message}>
              <Input id="department" placeholder="e.g. Maternity, Pharmacy, Records" {...form.register("department")} maxLength={120} />
            </Field>
          </FormSection>

          <FormSection title="Next of kin">
            <Field id="next_of_kin_name" label="Next of kin name" error={form.formState.errors.next_of_kin_name?.message}>
              <Input id="next_of_kin_name" {...form.register("next_of_kin_name")} maxLength={120} />
            </Field>
            <Field id="next_of_kin_contact" label="Next of kin contact" error={form.formState.errors.next_of_kin_contact?.message}>
              <Input id="next_of_kin_contact" {...form.register("next_of_kin_contact")} maxLength={120} />
            </Field>
          </FormSection>

          <FormSection title="Documents">
            <FileField
              id="id_card"
              label="ID card upload"
              hint="Image or PDF, max 5MB"
              accept="image/*,application/pdf"
              file={form.watch("id_card")}
              error={form.formState.errors.id_card?.message as string | undefined}
              onChange={(f) => form.setValue("id_card", f as any, { shouldValidate: true })}
            />
            <FileField
              id="passport_photo"
              label="Passport photo upload"
              hint="Image only (JPG/PNG/WEBP), max 5MB"
              accept="image/*"
              file={form.watch("passport_photo")}
              error={form.formState.errors.passport_photo?.message as string | undefined}
              onChange={(f) => form.setValue("passport_photo", f as any, { shouldValidate: true })}
            />
          </FormSection>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting} size="lg" className="bg-gradient-hero text-primary-foreground shadow-elegant">
              {form.formState.isSubmitting ? "Submitting..." : "Submit registration"}
            </Button>
            <p className="text-xs text-muted-foreground">No payments are processed. Your data is private.</p>
          </div>
        </form>
      </section>
    </SiteLayout>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-card border border-border/60 rounded-2xl p-6 lg:p-7 shadow-soft">
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function FileField({
  id, label, hint, accept, file, error, onChange,
}: {
  id: string; label: string; hint: string; accept: string; file: File | undefined; error?: string;
  onChange: (f: File) => void;
}) {
  return (
    <div className="sm:col-span-1">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className="mt-1.5 flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-border rounded-xl px-4 py-6 hover:border-primary/60 hover:bg-secondary/40 transition-smooth"
      >
        {file ? (
          <>
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-foreground truncate max-w-full">{file.name}</span>
            <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · click to replace</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Click to upload</span>
            <span className="text-xs text-muted-foreground">{hint}</span>
          </>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange(f);
          }}
        />
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
