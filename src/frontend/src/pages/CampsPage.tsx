import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarDays,
  Clock,
  Droplets,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

const statusConfig = {
  upcoming: {
    label: "Upcoming",
    color: "oklch(0.65 0.18 240)",
    bg: "oklch(0.65 0.18 240 / 0.12)",
    border: "oklch(0.65 0.18 240 / 0.35)",
  },
  active: {
    label: "Active Now",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.12)",
    border: "oklch(0.65 0.2 140 / 0.35)",
  },
  completed: {
    label: "Completed",
    color: "oklch(0.55 0.05 20)",
    bg: "oklch(0.55 0.05 20 / 0.12)",
    border: "oklch(0.55 0.05 20 / 0.3)",
  },
};

const postedByConfig = {
  NGO: {
    label: "NGO",
    color: "oklch(0.72 0.18 60)",
    bg: "oklch(0.72 0.18 60 / 0.1)",
    border: "oklch(0.72 0.18 60 / 0.3)",
  },
  "Blood Bank": {
    label: "Blood Bank",
    color: "oklch(0.65 0.18 290)",
    bg: "oklch(0.65 0.18 290 / 0.1)",
    border: "oklch(0.65 0.18 290 / 0.3)",
  },
};

function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number.parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function CampsPage() {
  const { camps } = useApp();

  return (
    <main className="container mx-auto px-4 py-12" data-ocid="camps.page">
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.1)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.25)",
          }}
        >
          <CalendarDays className="h-4 w-4" />
          Blood Donation Camps
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-4">
          Upcoming{" "}
          <span style={{ color: "oklch(var(--neon-red))" }}>
            Donation Camps
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Blood donation camps organized by NGOs and blood banks near you. Join
          a camp and save lives today.
        </p>

        {/* Live count */}
        {camps.length > 0 && (
          <div
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: "oklch(0.65 0.2 140 / 0.1)",
              color: "oklch(0.65 0.2 140)",
              border: "1px solid oklch(0.65 0.2 140 / 0.25)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {camps.length} active announcement{camps.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Empty State */}
      {camps.length === 0 && (
        <div
          className="rounded-2xl card-dark p-16 text-center max-w-md mx-auto"
          data-ocid="camps.empty_state"
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: "oklch(var(--neon-red) / 0.1)",
              border: "1px solid oklch(var(--neon-red) / 0.2)",
            }}
          >
            <Droplets
              className="h-10 w-10"
              style={{ color: "oklch(var(--neon-red))" }}
            />
          </div>
          <h2 className="font-display text-2xl font-bold mb-3">
            No camps posted yet
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            NGOs and blood banks can post camp announcements from their
            dashboards. Check back soon!
          </p>
        </div>
      )}

      {/* Camps Grid */}
      {camps.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="camps.list"
        >
          {camps.map((camp, i) => {
            const sc = statusConfig[camp.status];
            const pc = postedByConfig[camp.postedBy];

            return (
              <article
                key={camp.id}
                data-ocid={`camps.item.${i + 1}`}
                className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 group"
                style={{
                  background: "oklch(var(--card))",
                  border: "1px solid oklch(var(--neon-red) / 0.2)",
                  boxShadow:
                    "0 0 12px oklch(var(--neon-red) / 0.08), 0 4px 16px oklch(0 0 0 / 0.3)",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(var(--neon-red) / 0.45)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 24px oklch(var(--neon-red) / 0.18), 0 8px 24px oklch(0 0 0 / 0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(var(--neon-red) / 0.2)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 12px oklch(var(--neon-red) / 0.08), 0 4px 16px oklch(0 0 0 / 0.3)";
                }}
              >
                {/* Header row: badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: sc.bg,
                      color: sc.color,
                      border: `1px solid ${sc.border}`,
                    }}
                  >
                    {sc.label}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: pc.bg,
                      color: pc.color,
                      border: `1px solid ${pc.border}`,
                    }}
                  >
                    {pc.label}
                  </span>
                </div>

                {/* Camp name */}
                <div>
                  <h2 className="font-display text-lg font-bold leading-snug group-hover:text-foreground transition-colors">
                    {camp.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Organized by {camp.organizer}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2.5">
                    <MapPin
                      className="h-4 w-4 flex-shrink-0 mt-0.5"
                      style={{ color: "oklch(var(--neon-red))" }}
                    />
                    <span className="leading-relaxed">{camp.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "oklch(var(--neon-red))" }}
                    />
                    <span>{camp.date}</span>
                    {camp.time && (
                      <>
                        <Clock
                          className="h-4 w-4 flex-shrink-0 ml-0.5"
                          style={{ color: "oklch(0.65 0.18 240)" }}
                        />
                        <span style={{ color: "oklch(0.65 0.18 240)" }}>
                          {formatTime(camp.time)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users
                      className="h-4 w-4 flex-shrink-0"
                      style={{ color: "oklch(0.65 0.2 140)" }}
                    />
                    <span>
                      <span
                        className="font-semibold"
                        style={{ color: "oklch(0.65 0.2 140)" }}
                      >
                        {camp.expectedDonors}
                      </span>{" "}
                      donors expected
                    </span>
                  </div>
                  {camp.contact && (
                    <div className="flex items-center gap-2.5">
                      <Phone
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: "oklch(0.65 0.18 160)" }}
                      />
                      <a
                        href={`tel:${camp.contact}`}
                        className="font-semibold hover:underline transition-colors"
                        style={{ color: "oklch(0.65 0.18 160)" }}
                      >
                        {camp.contact}
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer: camp ID + posted time */}
                <div
                  className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground font-mono"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  <span>{camp.id}</span>
                  <span>
                    {new Date(camp.postedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Info banner */}
      <div
        className="mt-16 rounded-2xl p-8 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--neon-red) / 0.06) 0%, transparent 100%)",
          border: "1px solid oklch(var(--neon-red) / 0.12)",
        }}
      >
        <div className="text-3xl mb-3">🏕️</div>
        <h3 className="font-display text-xl font-bold mb-2">
          Organizing a Camp?
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          If you're an NGO or Blood Bank, log in to your dashboard to post camp
          announcements that will be visible to all users of LIFEDROP.
        </p>
      </div>
    </main>
  );
}
