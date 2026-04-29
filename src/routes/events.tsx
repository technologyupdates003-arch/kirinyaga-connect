import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { site } from "@/content/site";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/events")({
  head: () => pageSeo({
    path: "/events",
    title: "Events — KHCWW Meetings, AGM & Team Building",
    description: "Upcoming and past events from Kirinyaga Healthcare Workers' Welfare — AGMs, team building, and welfare meetings.",
    keywords: "KHCWW events, healthcare AGM Kirinyaga, team building, welfare meetings",
  }),
  component: EventsPage,
});

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function EventsPage() {
  const events = [...site.events].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const galleryUrl = site.galleryUrl;

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Events</span>
          <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">Where we gather.</h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            From the AGM to team building retreats and welfare meetings — moments that bring our community closer.
          </p>
        </div>

        {events.length === 0 ? (
          <p className="mt-12 text-muted-foreground">No events yet. Please check back soon.</p>
        ) : (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group bg-gradient-card border border-border/60 rounded-2xl overflow-hidden shadow-soft hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <div className="h-full w-full bg-gradient-hero flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-primary-foreground/70" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground leading-snug">{e.title}</h3>
                  {(e.date || e.location) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {e.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" /> {formatDate(e.date)}
                        </span>
                      )}
                      {e.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" /> {e.location}
                        </span>
                      )}
                    </div>
                  )}
                  {e.description && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">{e.description}</p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {galleryUrl && (
          <div className="mt-16 p-6 lg:p-8 rounded-2xl bg-gradient-soft border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-foreground">Looking for event photos?</h3>
              <p className="text-sm text-muted-foreground mt-1">Browse our gallery for highlights from past events.</p>
            </div>
            <a
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:shadow-elegant transition-smooth"
            >
              View gallery
            </a>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
