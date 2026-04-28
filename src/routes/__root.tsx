import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KHCWW — Kirinyaga Healthcare Workers' Welfare" },
      { name: "description", content: "Kirinyaga Healthcare Workers' Welfare (KHCWW) — a community of healthcare workers in Kirinyaga County united through mutual support, social engagement and professional growth." },
      { name: "keywords", content: "KHCWW, Kirinyaga Healthcare Workers Welfare, healthcare workers Kenya, Kirinyaga County, nurses welfare, medical welfare association" },
      { name: "author", content: "Kirinyaga Healthcare Workers' Welfare" },
      { property: "og:title", content: "Kirinyaga Healthcare Workers' Welfare (KHCWW)" },
      { property: "og:description", content: "Supporting healthcare workers across Kirinyaga County through unity, mutual support and social growth." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "KHCWW" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kirinyaga Healthcare Workers' Welfare (KHCWW)" },
      { name: "twitter:description", content: "Supporting healthcare workers across Kirinyaga County." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </AuthProvider>
  );
}
