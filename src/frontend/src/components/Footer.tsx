import { Link } from "@tanstack/react-router";
import { Droplets, Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Droplets
                className="h-6 w-6"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              <span className="font-display text-lg font-bold">
                LIFE
                <span style={{ color: "oklch(var(--neon-red))" }}>DROP</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting blood donors, hospitals, and patients to save lives.
              Every drop counts.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "oklch(0.65 0.2 140)" }}
              />
              <span>Platform Online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Find Donors", href: "/search" },
                { label: "Emergency Request", href: "/request" },
                { label: "Register as Donor", href: "/login" },
                { label: "Hospital Registration", href: "/login" },
                { label: "Blog & Awareness", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Blood Groups
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"].map((bg) => (
                <div
                  key={bg}
                  className="text-xs font-mono font-bold px-2 py-1 rounded text-center"
                  style={{
                    backgroundColor: "oklch(var(--neon-red) / 0.1)",
                    color: "oklch(var(--neon-red))",
                    border: "1px solid oklch(var(--neon-red) / 0.2)",
                  }}
                >
                  {bg}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              All blood types needed — join today!
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Emergency Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                <span>emergency@lifedrop.health</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                <span>Pan India Coverage</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} LIFEDROP. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with{" "}
            <Heart
              className="h-3 w-3 inline fill-current"
              style={{ color: "oklch(var(--neon-red))" }}
            />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
