import { Link } from "@tanstack/react-router";
import { Droplets, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
                { label: "Blood Requests", href: "/blood-requests" },
                { label: "Donation Camps", href: "/camps" },
                { label: "Blog & Awareness", href: "/blog" },
                { label: "Leaderboard", href: "/leaderboard" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.quick.link"
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

          {/* Platform Info */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Register", href: "/register" },
                { label: "Login", href: "/login" },
                { label: "Donor Guidelines", href: "/blog" },
                { label: "Admin Portal", href: "/dashboard/admin" },
              ].map((link) => (
                <li key={link.label}>
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
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-muted-foreground">
              © {currentYear} LIFEDROP. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Website made by{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(var(--neon-red))" }}
              >
                Rishan
              </span>
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <a
                href="mailto:rishann743@gmail.com"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail
                  className="h-3 w-3"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                rishann743@gmail.com
              </a>
              <a
                href="tel:8072780171"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone
                  className="h-3 w-3"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                8072780171
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
