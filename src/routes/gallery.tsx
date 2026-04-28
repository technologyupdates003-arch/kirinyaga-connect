import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Camera, Info } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => pageSeo({
    path: "/gallery",
    title: "Photo Gallery — KHCWW Events & Team Building",
    description: "Photo gallery from KHCWW events including AGM and team building activities across Kirinyaga County.",
    keywords: "KHCWW gallery, healthcare workers photos, AGM photos, team building gallery",
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [galleryUrl, setGalleryUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("gallery_url")
        .eq("id", 1)
        .maybeSingle();
      setGalleryUrl(data?.gallery_url ?? null);
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Gallery</span>
            <h1 className="mt-3 text-4xl lg:text-5xl font-bold text-foreground">Moments captured.</h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Photos from our AGM, team building events, and welfare gatherings — hosted on our official
              photography portal.
            </p>
          </div>
          {galleryUrl && (
            <Button asChild variant="outline">
              <a href={galleryUrl} target="_blank" rel="noopener noreferrer">
                Open in new tab <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        <div className="mt-10 flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-secondary/40 text-sm">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-muted-foreground">
            Our gallery is hosted on Pixieset, our photographer's portal. Use the embedded view below or
            open it in a new tab for the full experience including downloads.
          </p>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="aspect-video w-full rounded-3xl bg-muted animate-pulse" />
          ) : !galleryUrl ? (
            <EmptyGallery />
          ) : iframeFailed ? (
            <FallbackGallery url={galleryUrl} />
          ) : (
            <div className="rounded-3xl overflow-hidden border border-border/60 shadow-soft bg-card">
              <iframe
                src={galleryUrl}
                title="KHCWW Photo Gallery"
                className="w-full h-[80vh] min-h-[600px] block"
                loading="lazy"
                onError={() => setIframeFailed(true)}
                allow="fullscreen"
              />
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function EmptyGallery() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-16 text-center">
      <Camera className="h-10 w-10 mx-auto text-muted-foreground" />
      <p className="mt-4 text-foreground font-medium">Gallery unavailable</p>
      <p className="mt-1 text-sm text-muted-foreground">Photos will appear here once published.</p>
    </div>
  );
}

function FallbackGallery({ url }: { url: string }) {
  return (
    <div className="rounded-3xl border border-border bg-gradient-card p-12 text-center shadow-soft">
      <Camera className="h-10 w-10 mx-auto text-primary" />
      <p className="mt-4 text-foreground font-medium">View our gallery on Pixieset</p>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Our photo gallery couldn't be embedded. Click below to view all images on the official portal.
      </p>
      <Button asChild className="mt-6 bg-gradient-hero text-primary-foreground">
        <a href={url} target="_blank" rel="noopener noreferrer">
          Open Gallery <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
