import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Shield, FileText, ScrollText, Wallet, Sparkles, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { site } from "@/content/site";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/team")({
  head: () => pageSeo({
    path: "/team",
    title: "Leadership & Office Bearers — KHCWW",
    description: "Meet the office bearers of Kirinyaga Healthcare Workers' Welfare leading our community of healthcare professionals.",
    keywords: "KHCWW leadership, office bearers, welfare chairperson, Kirinyaga healthcare team",
  }),
  component: TeamPage,
});

const iconMap: Record<string, LucideIcon> = {
  Crown, Shield, FileText, ScrollText, Wallet, Sparkles,
};

function TeamPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Leadership</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">Our office bearers.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Volunteer leaders elected by the membership to serve the welfare and uphold our shared mission.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {site.team.map((m, i) => {
            const Icon = iconMap[m.icon] ?? Sparkles;
            const isPatron = m.role.toLowerCase().includes("patron");
            return (
              <motion.div
                key={m.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="bg-gradient-card border border-border/60 rounded-2xl p-7 shadow-soft hover:shadow-elegant transition-smooth"
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${isPatron ? "bg-accent" : "bg-gradient-hero"} shadow-soft`}>
                  <Icon className={`h-6 w-6 ${isPatron ? "text-accent-foreground" : "text-primary-foreground"}`} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{m.role}</h3>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {m.name || "Office bearer"}
                </div>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-border/60 bg-secondary/40 text-sm text-muted-foreground">
          Office bearers' names will be published here once confirmed by the welfare. Members will be notified.
        </div>
      </section>
    </SiteLayout>
  );
}
