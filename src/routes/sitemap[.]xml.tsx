import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/membership", priority: "0.9", changefreq: "monthly" },
  { path: "/events", priority: "0.9", changefreq: "weekly" },
  { path: "/team", priority: "0.7", changefreq: "monthly" },
  { path: "/gallery", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "yearly" },
  { path: "/register", priority: "0.8", changefreq: "yearly" },
  { path: "/login", priority: "0.4", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const today = new Date().toISOString().split("T")[0];
        const urls = ROUTES.map(
          (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
