import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageSeo({
    path: "/contact",
    title: "Contact KHCWW — Get in Touch",
    description: "Contact Kirinyaga Healthcare Workers' Welfare. Reach out via email or our contact form for inquiries and support.",
    keywords: "contact KHCWW, healthcare welfare contact, Kirinyaga welfare email",
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(values);
    setSubmitting(false);
    if (error) {
      toast.error("Could not send message. Please try again.");
    } else {
      toast.success("Message sent — we'll be in touch soon.");
      reset();
    }
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">We'd love to hear from you.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Questions about membership, events, or the welfare? Send us a message — we usually respond within a few days.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-2 space-y-4">
            <ContactCard icon={Mail} title="Email">
              <a href="mailto:Khcww2020@gmail.com" className="hover:text-primary transition-smooth break-all">
                Khcww2020@gmail.com
              </a>
            </ContactCard>
            <ContactCard icon={MapPin} title="Location">
              <span>KCRH, Kirinyaga County, Kenya</span>
            </ContactCard>
          </aside>

          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 bg-gradient-card border border-border/60 rounded-3xl p-6 lg:p-8 shadow-soft space-y-5">
            <Field id="name" label="Your name" error={errors.name?.message}>
              <Input id="name" placeholder="Jane Wanjiru" {...register("name")} maxLength={100} />
            </Field>
            <Field id="email" label="Email address" error={errors.email?.message}>
              <Input id="email" type="email" placeholder="you@example.com" {...register("email")} maxLength={255} />
            </Field>
            <Field id="message" label="Message" error={errors.message?.message}>
              <Textarea id="message" rows={6} placeholder="How can we help?" {...register("message")} maxLength={2000} />
            </Field>
            <Button type="submit" disabled={submitting} className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-soft">
              {submitting ? "Sending..." : <>Send message <Send className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function ContactCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 flex items-start gap-4 shadow-soft">
      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</div>
        <div className="mt-1 text-foreground">{children}</div>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
