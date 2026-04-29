import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Users,
  Calendar,
  Shield,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  Stethoscope,
  HandHeart,
  Quote,
  CheckCircle2,
  Globe,
  Mail,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import logo from "@/assets/khcww-logo.png";
import { site } from "@/content/site";
import agmHall from "@/assets/gallery/agm-hall.jpg";
import agmSpeaker from "@/assets/gallery/agm-speaker.jpg";
import busExterior from "@/assets/gallery/bus-exterior.jpg";
import busInterior1 from "@/assets/gallery/bus-interior-1.jpg";
import busInterior2 from "@/assets/gallery/bus-interior-2.jpg";
import busInterior3 from "@/assets/gallery/bus-interior-3.jpg";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageSeo({
    path: "/",
    title: "KHCWW — Kirinyaga Healthcare Workers' Welfare",
    description: "A welfare organisation uniting healthcare workers in Kirinyaga County through unity, mutual support, advocacy, and social growth.",
    keywords: "KHCWW, Kirinyaga Healthcare Workers Welfare, healthcare workers Kenya, Kirinyaga County welfare, nurses welfare, medical workers association",
  }),
  component: HomePage,
});

const stats = site.stats;

const programs = [
  {
    icon: HeartHandshake,
    title: "Member Welfare & Solidarity",
    desc: "Compassionate response in moments of bereavement, illness, weddings, and milestones — because no member should walk alone.",
  },
  {
    icon: Stethoscope,
    title: "Professional Wellness",
    desc: "Promoting the mental health, safety and dignity of healthcare workers across all facilities in the county.",
  },
  {
    icon: GraduationCap,
    title: "Capacity Building",
    desc: "Workshops, mentorship sessions and peer learning that strengthen members personally and professionally.",
  },
  {
    icon: HandHeart,
    title: "Community Engagement",
    desc: "Outreach, social activities and partnerships that connect our members to the communities we serve.",
  },
];

const updates = site.events.slice(0, 3).map((e) => ({
  date: e.date ? new Date(e.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
  tag: "Event",
  title: e.title,
  excerpt: e.description ?? "",
}));

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="container mx-auto px-4 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                A non-profit welfare organisation · Est. Kirinyaga County
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-foreground">
                Caring for the people who{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">care for our community.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                Kirinyaga Healthcare Workers' Welfare (KHCWW) unites nurses, clinicians, doctors and
                support staff across the county in unity, mutual support, advocacy, and shared growth.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-elegant">
                  <Link to="/membership">Become a member <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/about">Our mission</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                {["Voluntary membership", "Non-political", "County-wide"].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {b}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
              <div className="absolute -inset-4 bg-gradient-hero rounded-3xl blur-2xl opacity-25" />
              <div className="relative grid grid-cols-6 grid-rows-6 gap-3 rounded-3xl">
                <img src={agmHall} alt="KHCWW AGM hall" className="col-span-4 row-span-4 h-full w-full rounded-2xl object-cover shadow-elegant" />
                <img src={busExterior} alt="Members at team building" className="col-span-2 row-span-3 h-full w-full rounded-2xl object-cover shadow-soft" />
                <img src={agmSpeaker} alt="Member addressing the AGM" className="col-span-2 row-span-3 h-full w-full rounded-2xl object-cover shadow-soft" />
                <img src={busInterior1} alt="Members travelling together" className="col-span-3 row-span-2 h-full w-full rounded-2xl object-cover shadow-soft" />
                <div className="col-span-3 row-span-2 rounded-2xl bg-gradient-hero shadow-elegant flex items-center justify-center p-4">
                  <img src={logo} alt="KHCWW logo" className="h-full w-auto object-contain rounded-full bg-white p-1" />
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-card border border-border rounded-2xl shadow-soft p-4 hidden sm:flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <Heart className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Open membership</div>
                  <div className="text-muted-foreground">All healthcare workers welcome</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-y border-border/60 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center lg:text-left"
              >
                <div className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">{s.value}</span>
                </div>
                <div className="mt-2 text-sm uppercase tracking-wider opacity-80">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: "Our Mission", body: "To unite healthcare workers in Kirinyaga County under one welfare family — supporting one another in service, in difficulty, and in celebration." },
            { title: "Our Vision", body: "An empowered, dignified and resilient healthcare workforce shaping healthier communities across Kirinyaga and beyond." },
            { title: "Our Values", body: "Unity. Compassion. Integrity. Solidarity. Service. These five values direct every gathering, decision and initiative we undertake." },
          ].map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gradient-card border border-border/60 rounded-3xl p-8 shadow-soft"
            >
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">{m.title.split(" ")[1]}</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-foreground">{m.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="bg-gradient-soft py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Our programs</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">What we do for our members</h2>
            <p className="mt-3 text-muted-foreground">Four areas of focus that guide every welfare initiative we run.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programs.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-smooth"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                  <p.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE — split */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <img src={agmSpeaker} alt="A KHCWW member addressing the assembly" className="rounded-3xl shadow-elegant w-full object-cover aspect-[4/5]" />
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-card border border-border rounded-2xl p-5 shadow-soft max-w-xs">
              <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider"><Globe className="h-4 w-4" /> Across the county</div>
              <p className="mt-2 text-sm text-muted-foreground">From KCRH to the smallest dispensary — every healthcare worker has a seat at our table.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Who we are</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">A welfare built by us, for us.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              KHCWW is a non-political, non-profit welfare organisation registered to serve healthcare
              workers in Kirinyaga County. We exist because the people who give care also need care —
              from one another, from their community, and from their colleagues.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Constitution-led governance with elected officials",
                "Open and voluntary membership — no political affiliation",
                "Programs structured around member needs, not external agendas",
                "Transparent leadership accountable to all members",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild><Link to="/about">Read our story</Link></Button>
              <Button asChild variant="outline"><Link to="/team">Meet the leadership</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="bg-accent text-accent-foreground py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-10 w-10 mx-auto text-primary-glow opacity-80" />
            <p className="mt-6 font-display text-2xl lg:text-3xl leading-relaxed text-primary-foreground">
              "Belonging to KHCWW reminded me that I'm not alone in this profession. When my mother passed,
              my colleagues were there before my own family arrived. That is what welfare means."
            </p>
            <div className="mt-6">
              <div className="font-semibold text-primary-foreground">A KHCWW member</div>
              <div className="text-sm opacity-75">Nurse, Kirinyaga County Referral Hospital</div>
            </div>
          </div>
        </div>
      </section>

      {/* MOMENTS */}
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Moments</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">From our recent gatherings</h2>
            <p className="mt-3 text-muted-foreground">AGM 2025 at Mimosa Park & Island Camp — bound by care, powered by togetherness.</p>
          </div>
          <Button asChild variant="outline">
            <Link to="/gallery">Open gallery <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[
            { src: agmHall, alt: "AGM hall", span: "col-span-2 lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto" },
            { src: agmSpeaker, alt: "Member at AGM", span: "aspect-square" },
            { src: busExterior, alt: "Team building bus", span: "aspect-square" },
            { src: busInterior1, alt: "Travelling together", span: "aspect-square" },
            { src: busInterior2, alt: "Colleagues on the road", span: "aspect-square" },
            { src: busInterior3, alt: "Sharing the journey", span: "col-span-2 aspect-[2/1]" },
          ].map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }} className={`group relative overflow-hidden rounded-2xl border border-border/60 shadow-soft ${img.span}`}>
              <img src={img.src} alt={img.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-smooth duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWS / UPDATES */}
      <section className="bg-gradient-soft py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Latest updates</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-foreground">News from the welfare</h2>
            </div>
            <Button asChild variant="outline"><Link to="/events">All events <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {updates.map((u, i) => (
              <motion.article
                key={u.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-smooth flex flex-col"
              >
                <img src={[agmHall, busExterior, agmSpeaker][i]} alt="" className="h-44 w-full object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{u.tag}</span>
                    <span className="text-muted-foreground">{u.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{u.excerpt}</p>
                  <Link to="/events" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">In collaboration with</span>
          <h2 className="mt-3 text-2xl lg:text-3xl font-bold text-foreground">Our partners & well-wishers</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            "Kirinyaga County Government",
            "KCRH",
            "Ministry of Health",
            "KMPDU",
            "KNUN",
            "Local Faith Networks",
          ].map((p) => (
            <div key={p} className="border border-border/60 rounded-xl p-5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-card hover:bg-secondary/40 transition-smooth">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER + CTA */}
      <section className="container mx-auto px-4 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 lg:p-16 shadow-elegant">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">Stand with the welfare.</h2>
              <p className="mt-4 text-primary-foreground/85 text-lg leading-relaxed">
                Join hundreds of healthcare workers shaping a stronger, more united profession in Kirinyaga.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary" className="shadow-soft">
                  <Link to="/register">Register as a member</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
            <div className="bg-card/95 backdrop-blur rounded-2xl p-6 shadow-soft">
              <div className="flex items-center gap-2 text-primary"><Mail className="h-5 w-5" /><span className="font-semibold">Stay in the loop</span></div>
              <p className="mt-2 text-sm text-muted-foreground">Get welfare announcements, event invites and updates straight to your inbox.</p>
              <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <Input type="email" placeholder="you@example.com" required />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="mt-3 text-[11px] text-muted-foreground">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
