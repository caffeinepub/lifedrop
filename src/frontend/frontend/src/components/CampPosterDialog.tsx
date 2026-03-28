import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Phone, Users } from "lucide-react";
import type { CampAnnouncement } from "../contexts/AppContext";

interface CampPosterDialogProps {
  camp: CampAnnouncement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = Number.parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function CampPosterDialog({
  camp,
  open,
  onOpenChange,
}: CampPosterDialogProps) {
  if (!camp) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md p-0 overflow-hidden"
        style={{
          background: "oklch(0.07 0.005 20)",
          border: "1px solid oklch(var(--neon-red) / 0.35)",
          boxShadow:
            "0 0 60px oklch(var(--neon-red) / 0.2), 0 24px 64px oklch(0 0 0 / 0.6)",
        }}
        data-ocid="camp.poster.dialog"
      >
        <DialogTitle className="sr-only">Camp Event Poster</DialogTitle>

        {/* Top glow bar */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, oklch(var(--neon-red)), transparent)",
          }}
        />

        {/* Hero poster image if provided */}
        {camp.posterImage && (
          <div
            style={{
              width: "100%",
              maxHeight: "300px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={camp.posterImage}
              alt={`Event poster for ${camp.name}`}
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                display: "block",
                borderRadius: "0 0 8px 8px",
              }}
            />
            {/* Gradient overlay at bottom for readability */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to top, oklch(0.07 0.005 20), transparent)",
              }}
            />
          </div>
        )}

        {/* Poster content */}
        <div className="px-8 py-8 relative overflow-hidden">
          {/* Background decorative blood drop SVG */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 240"
            className="absolute right-[-30px] top-[-20px] opacity-5"
            style={{ width: "180px", height: "180px" }}
          >
            <path
              d="M100 10 C100 10 20 100 20 150 A80 80 0 0 0 180 150 C180 100 100 10 100 10Z"
              fill="oklch(0.55 0.28 25)"
            />
          </svg>

          {/* Header badge */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase"
              style={{
                backgroundColor: "oklch(var(--neon-red) / 0.15)",
                color: "oklch(var(--neon-red))",
                border: "1px solid oklch(var(--neon-red) / 0.3)",
              }}
            >
              {camp.postedBy}
            </span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase"
              style={{
                backgroundColor: "oklch(0.65 0.2 140 / 0.12)",
                color: "oklch(0.65 0.2 140)",
                border: "1px solid oklch(0.65 0.2 140 / 0.3)",
              }}
            >
              Free Event
            </span>
          </div>

          {/* Blood drop icon + title */}
          <div className="flex items-center gap-4 mb-5">
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "oklch(var(--neon-red) / 0.1)",
                border: "2px solid oklch(var(--neon-red) / 0.4)",
                boxShadow: "0 0 20px oklch(var(--neon-red) / 0.25)",
                flexShrink: 0,
              }}
            >
              <svg
                viewBox="0 0 24 28"
                width="22"
                height="22"
                fill="none"
                aria-hidden="true"
              >
                <title>Blood drop</title>
                <path
                  d="M12 2 C12 2 3 11 3 17 A9 9 0 0 0 21 17 C21 11 12 2 12 2Z"
                  fill="oklch(0.62 0.26 25)"
                />
              </svg>
            </div>
            <div>
              <h2
                className="font-display font-black text-xl"
                style={{ lineHeight: 1.15 }}
              >
                {camp.name}
              </h2>
              <p
                className="text-sm mt-0.5"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Hosted by {camp.organizer}
              </p>
            </div>
          </div>

          {/* Info grid */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <MapPin
                className="h-4 w-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  Venue
                </div>
                <div className="text-sm font-semibold">{camp.venue}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar
                className="h-4 w-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.65 0.18 240)" }}
              />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  Date
                </div>
                <div className="text-sm font-semibold">{camp.date}</div>
              </div>
            </div>

            {camp.time && (
              <div className="flex items-start gap-3">
                <Clock
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(0.72 0.18 60)" }}
                />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                    Time
                  </div>
                  <div className="text-sm font-semibold">
                    {formatTime(camp.time)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Users
                className="h-4 w-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.65 0.18 290)" }}
              />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                  Expected Donors
                </div>
                <div className="text-sm font-semibold">
                  {camp.expectedDonors}
                </div>
              </div>
            </div>

            {camp.contact && (
              <div className="flex items-start gap-3">
                <Phone
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: "oklch(0.65 0.2 140)" }}
                />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
                    Contact
                  </div>
                  <a
                    href={`tel:${camp.contact}`}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: "oklch(0.65 0.2 140)" }}
                  >
                    {camp.contact}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Interested count */}
          {camp.interestedCount > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
              style={{
                backgroundColor: "oklch(0.72 0.18 60 / 0.1)",
                border: "1px solid oklch(0.72 0.18 60 / 0.25)",
              }}
            >
              <span style={{ color: "oklch(0.72 0.18 60)" }}>🙋</span>
              <span
                className="text-sm font-semibold"
                style={{ color: "oklch(0.72 0.18 60)" }}
              >
                {camp.interestedCount}{" "}
                {camp.interestedCount === 1 ? "person" : "people"} interested
              </span>
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, oklch(var(--neon-red) / 0.3), transparent)",
              marginBottom: "20px",
            }}
          />

          {/* CTA */}
          <div className="text-center">
            <div
              className="text-xs uppercase tracking-widest font-bold mb-1"
              style={{ color: "oklch(var(--neon-red))" }}
            >
              Your donation saves lives
            </div>
            <div className="text-xs text-muted-foreground">
              One donation can save up to 3 lives
            </div>
          </div>
        </div>

        {/* Bottom glow bar */}
        <div
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, oklch(var(--neon-red)), transparent)",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
