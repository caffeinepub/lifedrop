import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Droplets,
  Menu,
  Trophy,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { type Language, useApp } from "../contexts/AppContext";
import { useNotifications } from "../hooks/useNotifications";
import { cn } from "../lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, language, setLanguage, userProfile } = useApp();
  const { unreadCount } = useNotifications();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/search", label: t("search_donors") },
    { href: "/blood-requests", label: t("blood_requests") },
    { href: "/camps", label: t("camps") },
    { href: "/request", label: t("emergency") },
    { href: "/blog", label: t("blog") },
    { href: "/leaderboard", label: "Leaderboard" },
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
    { code: "en", label: "English" },
    { code: "ta", label: "தமிழ்" },
    { code: "hi", label: "हिंदी" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "ml", label: "മലയാളം" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md"
      style={{ boxShadow: "0 1px 20px oklch(var(--neon-red) / 0.1)" }}
    >
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
                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
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
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {link.href === "/leaderboard" && (
                <Trophy className="h-3.5 w-3.5" />
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            data-ocid="nav.language.select"
            className="text-xs rounded-lg px-2 py-1.5 border transition-colors cursor-pointer outline-none"
            style={{
              backgroundColor: "oklch(var(--card))",
              color: "oklch(var(--foreground))",
              borderColor: "oklch(var(--border))",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(var(--neon-red))";
              e.currentTarget.style.boxShadow =
                "0 0 0 2px oklch(var(--neon-red) / 0.2)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "oklch(var(--border))";
              e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
            }}
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Notification bell */}
          <Link to="/notifications" data-ocid="nav.notifications.link">
            <button
              type="button"
              className="relative p-1.5 rounded-lg transition-colors hover:bg-secondary"
              aria-label="Notifications"
            >
              <Bell
                className="h-4.5 w-4.5"
                style={{
                  color:
                    unreadCount > 0
                      ? "oklch(var(--neon-red))"
                      : "oklch(var(--muted-foreground))",
                  width: "1.1rem",
                  height: "1.1rem",
                }}
              />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black animate-pulse"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </Link>

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
                className="font-semibold gap-1.5 btn-glow"
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
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {link.href === "/leaderboard" && (
                  <Trophy className="h-3.5 w-3.5" />
                )}
                {link.label}
              </Link>
            ))}
            {/* Mobile: notifications link */}
            <Link
              to="/notifications"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
              data-ocid="nav.mobile.notifications.link"
            >
              <Bell className="h-3.5 w-3.5" />
              Notifications
              {unreadCount > 0 && (
                <span
                  className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              {/* Language switcher mobile */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                data-ocid="nav.mobile.language.select"
                className="w-full text-sm rounded-lg px-3 py-2 border outline-none cursor-pointer"
                style={{
                  backgroundColor: "oklch(var(--card))",
                  color: "oklch(var(--foreground))",
                  borderColor: "oklch(var(--border))",
                }}
              >
                {langs.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
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
                    className="w-full gap-1.5 btn-glow"
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
