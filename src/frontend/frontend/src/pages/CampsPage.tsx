import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarDays,
  Clock,
  Droplets,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useState } from "react";
import { BloodFactTicker } from "../components/BloodFactTicker";
import { CampPosterDialog } from "../components/CampPosterDialog";
import { HeartbeatDecor } from "../components/HeartbeatDecor";
import { type CampAnnouncement, useApp } from "../contexts/AppContext";

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

function getDeviceId(): string {
  let id =
    localStorage.getItem("lifedrop_device_keypair_id") ||
    localStorage.getItem("lifedrop_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("lifedrop_device_id", id);
  }
  return id;
}

export function CampsPage() {
  const { camps, markInterested } = useApp();
  const [posterCamp, setPosterCamp] = useState<CampAnnouncement | null>(null);
  const [posterOpen, setPosterOpen] = useState(false);

  const deviceId = getDeviceId();

  function openDetails(camp: CampAnnouncement) {
    setPosterCamp(camp);
    setPosterOpen(true);
  }

  return (
    <main
      className="container mx-auto px-4 py-6 overflow-x-hidden"
      data-ocid="camps.page"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.1)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.25)",
          }}
        >
          <CalendarDays className="h-4 w-4" />
          Blood Donation Camps
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black mb-3">
          Upcoming{" "}
          <span style={{ color: "oklch(var(--neon-red))" }}>
            Donation Camps
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find blood donation camps near you. Organized by NGOs and Blood Banks
          to save lives.
        </p>
      </div>

      {/* Camps Grid */}
      {camps.length === 0 ? (
        <div
          className="rounded-2xl card-dark p-10 text-center"
          data-ocid="camps.empty_state"
        >
          <div className="text-6xl mb-4">🏕️</div>
          <h3 className="font-display text-xl font-bold mb-2">
            No Camps Announced Yet
          </h3>
          <p className="text-muted-foreground">
            NGOs and Blood Banks will post donation camps here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {camps.map((camp, i) => {
            const sc = statusConfig[camp.status];
            const pc = postedByConfig[camp.postedBy];
            const isInterested = camp.interestedByDevice.includes(deviceId);

            return (
              <div
                key={camp.id}
                className="rounded-2xl card-dark overflow-hidden flex flex-col cursor-pointer"
                data-ocid={`camps.item.${i + 1}`}
                onClick={() => openDetails(camp)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") openDetails(camp);
                }}
                style={{
                  border: "1px solid oklch(var(--border))",
                  transition:
                    "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "oklch(var(--neon-red) / 0.45)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 0 24px oklch(var(--neon-red) / 0.15), 0 4px 20px oklch(0 0 0 / 0.4)";
                  (e.currentTarget as HTMLDivElement).style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                }}
              >
                {/* Poster image or gradient header */}
                {camp.posterImage ? (
                  <div
                    style={{
                      position: "relative",
                      height: "160px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={camp.posterImage}
                      alt={`Poster for ${camp.name}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, transparent 40%, oklch(0.08 0.005 20 / 0.8))",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "oklch(0 0 0 / 0.5)",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "99px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Click to view details
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "6px",
                      background: `linear-gradient(90deg, ${pc.color}, oklch(var(--neon-red)))`,
                    }}
                  />
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: pc.bg,
                        color: pc.color,
                        border: `1px solid ${pc.border}`,
                      }}
                    >
                      {pc.label}
                    </span>
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.border}`,
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>

                  {/* Camp name */}
                  <h3 className="font-display font-black text-lg mb-3">
                    {camp.name}
                  </h3>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "oklch(var(--neon-red))" }}
                      />
                      <span className="line-clamp-1">{camp.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.65 0.18 240)" }}
                      />
                      <span>{camp.date}</span>
                      {camp.time && (
                        <>
                          <Clock
                            className="h-3.5 w-3.5 flex-shrink-0 ml-1"
                            style={{ color: "oklch(0.72 0.18 60)" }}
                          />
                          <span>{formatTime(camp.time)}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.65 0.18 290)" }}
                      />
                      <span>{camp.expectedDonors} donors expected</span>
                    </div>
                    {camp.contact && (
                      <div className="flex items-center gap-2">
                        <Phone
                          className="h-3.5 w-3.5 flex-shrink-0"
                          style={{ color: "oklch(0.65 0.2 140)" }}
                        />
                        <a
                          href={`tel:${camp.contact}`}
                          className="hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {camp.contact}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Droplets
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{ color: "oklch(0.62 0.2 220)" }}
                      />
                      <span>By {camp.organizer}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(camp);
                      }}
                      data-ocid={`camps.poster.button.${i + 1}`}
                      className="w-full"
                    >
                      🔍 View Full Details
                    </Button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markInterested(camp.id, deviceId);
                      }}
                      data-ocid={`camps.interested.button.${i + 1}`}
                      disabled={isInterested}
                      className="w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={{
                        backgroundColor: isInterested
                          ? "oklch(0.45 0.18 140 / 0.15)"
                          : "oklch(0.72 0.18 60 / 0.1)",
                        border: isInterested
                          ? "1px solid oklch(0.45 0.18 140 / 0.4)"
                          : "1px solid oklch(0.72 0.18 60 / 0.4)",
                        color: isInterested
                          ? "oklch(0.55 0.18 140)"
                          : "oklch(0.72 0.18 60)",
                        boxShadow: isInterested
                          ? "0 0 12px oklch(0.45 0.18 140 / 0.2)"
                          : "0 0 12px oklch(0.72 0.18 60 / 0.15)",
                        cursor: isInterested ? "default" : "pointer",
                      }}
                    >
                      {isInterested
                        ? `✓ Interested (${camp.interestedCount})`
                        : `🙋 I am Interested${
                            camp.interestedCount > 0
                              ? ` (${camp.interestedCount})`
                              : ""
                          }`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CampPosterDialog
        camp={posterCamp}
        open={posterOpen}
        onOpenChange={(open) => {
          setPosterOpen(open);
          if (!open) setPosterCamp(null);
        }}
      />

      {/* ─── Decorative animations ─────────────────────── */}
      <div className="w-full px-4 py-10 max-w-5xl mx-auto overflow-x-hidden">
        {/* Responsive grid: single column on mobile, two columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {/* HeartbeatDecor: constrained width on mobile so it doesn't overflow */}
          <div className="w-full flex justify-center">
            <HeartbeatDecor width={280} height={180} />
          </div>

          {/* Camp Schedule list: full width on mobile, centered items */}
          <div className="flex flex-col items-center gap-3.5 w-full">
            <div
              style={{
                color: "oklch(0.65 0.26 22)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              CAMP SCHEDULE
            </div>
            {[
              { icon: "🩸", text: "Free health checkup" },
              { icon: "💉", text: "Safe donation process" },
              { icon: "🏥", text: "Certified staff present" },
              { icon: "🎖️", text: "Donor certificate" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2.5 w-full"
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  background: "oklch(0.14 0.02 22)",
                  border: "1px solid oklch(0.62 0.26 22 / 0.2)",
                  maxWidth: 280,
                }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span
                  style={{
                    color: "oklch(0.75 0.1 22)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <BloodFactTicker className="mt-8" />
      </div>
    </main>
  );
}
