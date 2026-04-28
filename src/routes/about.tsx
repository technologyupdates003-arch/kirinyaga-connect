import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, HeartHandshake, PartyPopper, TrendingUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageSeo({
    path: "/about",
    title: "About KHCWW — Our Mission, Values & Objectives",
    description: "Learn about Kirinyaga Healthcare Workers' Welfare — our mission, values, and objectives drawn from our constitution.",
    keywords: "about KHCWW, healthcare welfare mission, Kirinyaga healthcare community",
  }),
  component: AboutPage,
});

const objectives = [
  { icon: Users, title: "Unity among healthcare workers", desc: "Building lasting bonds across hospitals, clinics, and facilities throughout Kirinyaga County." },
  { icon: HeartHandshake, title: "Support in times of need", desc: "Standing with members and their families during life's most difficult moments." },
  { icon: PartyPopper, title: "Participation in social events", desc: "Celebrating milestones, weddings, graduations, and community gatherings together." },
  { icon: TrendingUp, title: "Social, economic & professional growth", desc: "Empowering members to thrive personally, financially, and in their careers." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">About us</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">A welfare built by us, for us.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Kirinyaga Healthcare Workers' Welfare (KHCWW) is a voluntary community of healthcare
            professionals serving Kirinyaga County. Born from our shared values and codified in our
            constitution, we exist to make sure no member walks alone — in joy or in difficulty.
          </p>
        </motion.div>

        <div className="mt-16 grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-card border border-border/60 rounded-3xl p-8 lg:p-10 shadow-soft"
          >
            <h2 className="font-display text-2xl font-bold text-foreground">From our constitution</h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We are healthcare workers serving the people of Kirinyaga. Our work is demanding,
                often unseen, and always vital. KHCWW exists so that the same care we give to
                others is something we extend, intentionally, to one another.
              </p>
              <p>
                Membership is voluntary. We do not pursue political, partisan, or commercial agendas.
                We pursue community — through structured meetings, social activities, and quiet
                acts of solidarity when members need them most.
              </p>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Our objectives</h2>
            {objectives.map((o, i) => (
              <motion.div
                key={o.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:shadow-soft transition-smooth"
              >
                <div className="shrink-0 h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <o.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{o.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{o.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
