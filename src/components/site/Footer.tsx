import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/khcww-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-soft mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="KHCWW logo"
                className="h-11 w-11 rounded-full object-contain bg-white ring-1 ring-border shadow-soft"
              />
              <div className="leading-tight">
                <div className="font-display font-bold text-foreground">KHCWW</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Kirinyaga Healthcare Workers' Welfare</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
              A community of healthcare professionals in Kirinyaga County, united in unity, mutual support, and social growth.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-smooth">About</Link></li>
              <li><Link to="/membership" className="hover:text-primary transition-smooth">Membership</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-smooth">Events</Link></li>
              <li><Link to="/team" className="hover:text-primary transition-smooth">Leadership</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-smooth">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Reach us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <a href="mailto:Khcww2020@gmail.com" className="hover:text-primary transition-smooth break-all">Khcww2020@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>KCRH, Kirinyaga</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Kirinyaga Healthcare Workers' Welfare. All rights reserved.</p>
          <p>
            Developed by <span className="font-semibold text-primary">Dennis Murimi</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
