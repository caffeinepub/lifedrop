import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, Droplets, Menu, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { type Language, useApp } from "../contexts/AppContext";
import { cn } from "../lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage, userProfile } = useApp();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/search", label: t("search_donors") },
    { href: "/request", label: t("emergency") },
    { href: "/blog", label: t("blog") },
  ];

  const getDashboardPath = () => {
    if (!userProfile) return "/register";
    const roleMap: Record<string, string> = {
      donor: "/dashboard/donor",
      patient: "/dashboard/patient",
      hospital: "/dashboard/hospital",
      bloodBank: "/dashboard/bloodbank",
      ngo: "/dashboard/ngo",
      volunteer: "/dashboard/volunteer",
      admin: "/dashboard/admin",
    };
    return roleMap[userProfile.role] ?? "/dashboard";
  };

  const langs: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ta", label: "தமிழ்" },
    { code: "hi", label: "हिंदी" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.home.link"
          className="flex items-center gap-2 group"
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative">
            <Droplets
              className="h-7 w-7 text-primary group-hover:scale-110 transition-transform"
              style={{ color: "oklch(var(--neon-red))" }}
            />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            LIFE<span style={{ color: "oklch(var(--neon-red))" }}>DROP</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              data-ocid={`nav.${link.href.replace("/", "") || "home"}.link`}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
                link.href === "/request" &&
                  "font-semibold animate-pulse-glow rounded-lg",
              )}
              style={
                link.href === "/request"
                  ? { color: "oklch(var(--neon-red))" }
                  : {}
              }
            >
              {link.href === "/request" && (
                <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1 border border-border rounded-full px-2 py-0.5">
            {langs.map((l, i) => (
              <button
                type="button"
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full transition-colors",
                  language === l.code
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                  i < langs.length - 1 && "border-r border-border/50 pr-1.5",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          {userProfile ? (
            <Link to={getDashboardPath()}>
              <Button
                variant="outline"
                size="sm"
                data-ocid="nav.dashboard.button"
                className="border-border text-foreground hover:bg-secondary gap-2"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "oklch(var(--neon-red))" }}
                />
                {userProfile.name.split(" ")[0]}
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button
                size="sm"
                data-ocid="nav.register.button"
                className="font-semibold gap-1.5"
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                {t("register")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {/* Language switcher mobile */}
              <div className="flex items-center gap-2 px-3">
                {langs.map((l) => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={cn(
                      "text-sm px-2 py-1 rounded transition-colors",
                      language === l.code
                        ? "font-semibold text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              {userProfile ? (
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full">
                    {t("dashboard")}
                  </Button>
                </Link>
              ) : (
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full gap-1.5"
                    style={{
                      backgroundColor: "oklch(var(--neon-red))",
                      color: "white",
                    }}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {t("register")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
