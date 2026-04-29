import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/membership")({
  head: () => pageSeo({
    path: "/membership",
    title: "Membership — Join KHCWW",
    description: "Membership in Kirinyaga Healthcare Workers' Welfare is voluntary and open to all healthcare workers in Kirinyaga County.",
    keywords: "join KHCWW, healthcare worker membership, Kirinyaga welfare registration",
  }),
  component: MembershipPage,
});

const points = [
  "Membership is fully voluntary — no one is obligated to join.",
  "Open to all healthcare workers serving in Kirinyaga County.",
  "Members are expected to participate in welfare activities and meetings.",
  "Active engagement strengthens the community for everyone.",
];

function MembershipPage() {
  const org = site.organisation;
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Membership</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">Join a community that cares.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            KHCWW welcomes every healthcare worker in Kirinyaga who shares our values of unity,
            mutual support, and growth. Here's what you should know before you join.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-5 gap-8 items-start">
          <ul className="lg:col-span-3 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-4 p-5 bg-gradient-card border border-border/60 rounded-2xl shadow-soft">
                <div className="shrink-0 h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center mt-0.5">
                  <Check className="h-4 w-4 text-primary" strokeWidth={3} />
                </div>
                <p className="text-foreground/90 leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-2 sticky top-24 bg-gradient-hero rounded-3xl p-8 shadow-elegant text-primary-foreground">
            <h3 className="font-display text-2xl font-bold">Ready to join?</h3>
            <p className="mt-3 text-primary-foreground/85 leading-relaxed">
              Reach out to a welfare officer or contact us directly to begin the registration process.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-6 w-full shadow-soft">
              <Link to="/contact">
                Contact us to join <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-4 text-xs text-primary-foreground/70 text-center">
              Email {org.email}
            </p>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
