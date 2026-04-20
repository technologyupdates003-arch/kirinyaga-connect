import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-soft group-hover:shadow-glow transition-smooth">
            <HeartPulse className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base font-bold text-foreground">KHCWW</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Healthcare Welfare</div>
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

        <div className="hidden lg:flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90 shadow-soft">
                <Link to="/register">Join welfare</Link>
              </Button>
            </>
          )}
        </div>

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
            <div className="h-px bg-border my-2" />
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary">Dashboard</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary">Admin</Link>}
                <Button variant="outline" size="sm" onClick={() => { signOut(); setOpen(false); }}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-secondary">Sign in</Link>
                <Button asChild size="sm" className="bg-gradient-hero text-primary-foreground">
                  <Link to="/register" onClick={() => setOpen(false)}>Join welfare</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
