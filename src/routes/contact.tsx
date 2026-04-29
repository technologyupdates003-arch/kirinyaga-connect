import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageSeo({
    path: "/contact",
    title: "Contact KHCWW — Get in Touch",
    description: "Contact Kirinyaga Healthcare Workers' Welfare. Reach out via email or phone for inquiries and support.",
    keywords: "contact KHCWW, healthcare welfare contact, Kirinyaga welfare email",
  }),
  component: ContactPage,
});

function ContactPage() {
  const org = site.organisation;
  const mailtoHref = `mailto:${org.email}?subject=KHCWW%20Inquiry`;

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">We'd love to hear from you.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Questions about membership, events, or the welfare? Reach us directly through any of the channels below.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          <ContactCard icon={Mail} title="Email">
            <a href={`mailto:${org.email}`} className="hover:text-primary transition-smooth break-all">
              {org.email}
            </a>
          </ContactCard>
          <ContactCard icon={Phone} title="Phone">
            <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-smooth">
              {org.phone}
            </a>
          </ContactCard>
          <ContactCard icon={MapPin} title="Location">
            <span>{org.location}</span>
          </ContactCard>
        </div>

        <div className="mt-10 bg-gradient-hero rounded-3xl p-8 lg:p-10 shadow-elegant text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold">Send us a message</h3>
            <p className="mt-2 text-primary-foreground/85 max-w-xl">
              Click below to open your email app with our address pre-filled. We usually respond within a few days.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shadow-soft">
            <a href={mailtoHref}>Email us <Send className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">Office hours: {org.hours}</p>
      </section>
    </SiteLayout>
  );
}

function ContactCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 flex items-start gap-4 shadow-soft">
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
