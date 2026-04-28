export const SITE_URL = "https://project--961c7152-e75d-47e8-9be9-cfdf7d8ac3b2.lovable.app";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicon.png`;

export function pageSeo(opts: {
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: string;
  keywords?: string;
}) {
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image ?? DEFAULT_OG_IMAGE;
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      ...(opts.keywords ? [{ name: "keywords", content: opts.keywords }] : []),
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: url },
      { property: "og:type", content: opts.type ?? "website" },
      { property: "og:image", content: image },
      { property: "og:site_name", content: "KHCWW" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
