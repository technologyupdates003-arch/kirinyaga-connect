import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/khcww-logo.png";
import { site } from "@/content/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/membership", label: "Membership" },
  { to: "/events", label: "Events" },
  { to: "/team", label: "Team" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const org = site.organisation;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      {/* Utility bar */}
      <div className="hidden md:block bg-accent text-accent-foreground text-xs">
        <div className="container mx-auto px-4 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span>📞 {org.phone}</span>
            <span>✉ {org.email}</span>
            <span>📍 {org.location}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">{org.hours}</span>
            <Link to="/contact" className="font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full hover:opacity-90 transition-smooth">Contact us</Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="KHCWW logo"
            className="h-11 w-11 rounded-full object-contain bg-white ring-1 ring-border shadow-soft group-hover:shadow-glow transition-smooth"
          />
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-foreground">{org.shortName}</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{org.tagline}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-smooth",
                  active
                    ? "text-primary bg-secondary"
                    : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary transition-smooth"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
