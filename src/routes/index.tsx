import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Calendar, Shield, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-healthcare.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KHCWW — Kirinyaga Healthcare Workers' Welfare" },
      { name: "description", content: "A welfare community for healthcare workers in Kirinyaga County. Join us in unity, mutual support, and social growth." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 pt-12 pb-20 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Caring for those who care for our community
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground">
                Kirinyaga Healthcare{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">Workers' Welfare</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                A united community of healthcare professionals across Kirinyaga County —
                standing together in unity, mutual support, and shared growth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-elegant">
                  <Link to="/register">
                    Join Welfare <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/events">View Events</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { v: "Unity", l: "Among workers" },
                  { v: "Care", l: "In times of need" },
                  { v: "Growth", l: "Together" },
                ].map((s) => (
                  <div key={s.v} className="border-l-2 border-primary/30 pl-3">
                    <div className="font-display font-bold text-foreground">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-hero rounded-3xl blur-2xl opacity-25" />
              <img
                src={heroImg}
                alt="Healthcare workers from Kirinyaga County standing together"
                className="relative rounded-3xl shadow-elegant w-full object-cover aspect-[4/5] sm:aspect-[5/4]"
              />
              <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl shadow-soft p-4 hidden sm:flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <Heart className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Voluntary membership</div>
                  <div className="text-muted-foreground">Open to all healthcare workers</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-gradient-soft py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">What we stand for</h2>
            <p className="mt-3 text-muted-foreground">
              Four pillars that guide everything our welfare does.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: "Unity", desc: "Bringing together healthcare workers across the county." },
              { icon: Shield, title: "Support", desc: "Standing with each other in moments of need." },
              { icon: Calendar, title: "Engagement", desc: "Meaningful social and community activities." },
              { icon: Sparkles, title: "Growth", desc: "Social, economic, and professional development." },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-gradient-card border border-border/60 rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-smooth"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 lg:p-16 shadow-elegant">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Become part of something bigger
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg leading-relaxed">
              Membership is voluntary and open to healthcare workers in Kirinyaga.
              Register today to stand with your colleagues.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="shadow-soft">
                <Link to="/register">Register now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
