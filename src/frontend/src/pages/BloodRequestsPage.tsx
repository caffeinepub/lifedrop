import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Loader2,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { BloodFactTicker } from "../components/BloodFactTicker";
import { SOSRippleDecor } from "../components/SOSRippleDecor";
import { addNotificationGlobal } from "../hooks/useNotifications";
import { useBloodRequests, useDeleteBloodRequest } from "../hooks/useQueries";
import { getOrCreateDeviceIdentity } from "../utils/deviceIdentity";

const bloodGroupLabel: Record<string, string> = {
  A_Positive: "A+",
  A_Negative: "A−",
  B_Positive: "B+",
  B_Negative: "B−",
  AB_Positive: "AB+",
  AB_Negative: "AB−",
  O_Positive: "O+",
  O_Negative: "O−",
};

const urgencyConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: string;
    glow: string;
  }
> = {
  low: {
    label: "Low",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.12)",
    border: "oklch(0.65 0.2 140 / 0.4)",
    icon: "🟢",
    glow: "0 0 12px oklch(0.65 0.2 140 / 0.35), 0 0 24px oklch(0.65 0.2 140 / 0.15)",
  },
  medium: {
    label: "Medium",
    color: "oklch(0.78 0.18 85)",
    bg: "oklch(0.78 0.18 85 / 0.12)",
    border: "oklch(0.78 0.18 85 / 0.4)",
    icon: "🟡",
    glow: "0 0 14px oklch(0.78 0.18 85 / 0.4), 0 0 28px oklch(0.78 0.18 85 / 0.18)",
  },
  high: {
    label: "High",
    color: "oklch(0.72 0.22 45)",
    bg: "oklch(0.72 0.22 45 / 0.12)",
    border: "oklch(0.72 0.22 45 / 0.4)",
    icon: "🟠",
    glow: "0 0 16px oklch(0.72 0.22 45 / 0.45), 0 0 32px oklch(0.72 0.22 45 / 0.2)",
  },
  critical: {
    label: "CRITICAL",
    color: "oklch(0.62 0.26 25)",
    bg: "oklch(0.62 0.26 25 / 0.15)",
    border: "oklch(0.62 0.26 25 / 0.5)",
    icon: "🔴",
    glow: "0 0 20px oklch(0.62 0.26 25 / 0.5), 0 0 40px oklch(0.62 0.26 25 / 0.25)",
  },
};

function timeAgo(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const diffMs = Date.now() - ms;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function BloodRequestsPage() {
  const { data: requests, isLoading, refetch, isFetching } = useBloodRequests();
  const deleteRequest = useDeleteBloodRequest();
  const [filterGroup, setFilterGroup] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const myPrincipal = useMemo(() => {
    try {
      return getOrCreateDeviceIdentity().getPrincipal().toString();
    } catch {
      return "";
    }
  }, []);

  const filteredRequests = (requests ?? []).filter((r) => {
    const bg = bloodGroupLabel[r.bloodGroup] ?? r.bloodGroup;
    const groupMatch = filterGroup
      ? bg.toLowerCase().includes(filterGroup.toLowerCase())
      : true;
    const cityMatch = filterCity
      ? r.city.toLowerCase().includes(filterCity.toLowerCase())
      : true;
    return groupMatch && cityMatch;
  });

  const urgencyOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const sorted = [...filteredRequests].sort(
    (a, b) =>
      (urgencyOrder[a.urgencyLevel] ?? 4) - (urgencyOrder[b.urgencyLevel] ?? 4),
  );

  async function handleFulfill(id: bigint) {
    try {
      await deleteRequest.mutateAsync(id);
      toast.success(
        "Thank you, the blood has been received. A notification has been sent to all helpers.",
        { duration: 5000 },
      );
      addNotificationGlobal(
        "Thank you, the blood has been received.",
        "success",
      );
    } catch {
      toast.error("Could not update the request. Please try again.");
    }
  }

  async function handleDelete(id: bigint) {
    try {
      await deleteRequest.mutateAsync(id);
      toast("Your blood request has been removed.", { duration: 3000 });
      addNotificationGlobal("Blood request removed.", "info");
    } catch {
      toast.error("Could not delete the request. Please try again.");
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8 animate-cinema-enter">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5 animate-pulse-glow"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.12)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.4)",
          }}
        >
          <Droplets className="h-4 w-4" />
          LIVE BLOOD REQUESTS
        </div>
        <h1 className="font-display text-4xl font-black mb-2">
          Active Blood{" "}
          <span style={{ color: "oklch(var(--neon-red))" }}>Requests</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          All emergency blood requests visible to everyone. Help save a life
          today.
        </p>
      </div>

      {/* Filters + Refresh */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Filter by blood group (e.g. O+)"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="bg-secondary border-border flex-1"
          data-ocid="bloodreqs.bloodgroup.search_input"
        />
        <Input
          placeholder="Filter by city"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="bg-secondary border-border flex-1"
          data-ocid="bloodreqs.city.search_input"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="gap-2 border-border whitespace-nowrap"
          data-ocid="bloodreqs.refresh.button"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats bar */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between"
        style={{
          backgroundColor: "oklch(var(--neon-red) / 0.07)",
          border: "1px solid oklch(var(--neon-red) / 0.2)",
        }}
      >
        <span className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-bold text-foreground">{sorted.length}</span>{" "}
          request{sorted.length !== 1 ? "s" : ""}
          {(filterGroup || filterCity) && " (filtered)"}
        </span>
        <Link to="/request">
          <Button
            size="sm"
            className="font-bold btn-glow gap-1.5"
            style={{
              backgroundColor: "oklch(var(--neon-red))",
              color: "white",
            }}
            data-ocid="bloodreqs.submit.primary_button"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Submit Request
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center py-10 gap-4"
          data-ocid="bloodreqs.list.loading_state"
        >
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <p className="text-muted-foreground text-sm">
            Initializing secure connection...
          </p>
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          data-ocid="bloodreqs.list.empty_state"
          style={{
            border: "1px dashed oklch(var(--neon-red) / 0.25)",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <div className="text-5xl mb-4">🩸</div>
          <h3 className="font-semibold text-lg mb-1">No blood requests yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            {filterGroup || filterCity
              ? "No requests match your filters. Try clearing them."
              : "Be the first to submit an emergency blood request."}
          </p>
          <Link to="/request">
            <Button
              className="btn-glow"
              style={{
                backgroundColor: "oklch(var(--neon-red))",
                color: "white",
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Submit Emergency Request
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((req, i) => {
            const uc = urgencyConfig[req.urgencyLevel] ?? urgencyConfig.medium;
            const bg = bloodGroupLabel[req.bloodGroup] ?? req.bloodGroup;
            const isCritical = req.urgencyLevel === "critical";
            const isOwner =
              myPrincipal !== "" && req.requesterId.toString() === myPrincipal;
            const reqId = req.id as bigint;
            return (
              <div
                key={req.id.toString()}
                data-ocid={`bloodreqs.request.item.${i + 1}`}
                className={`rounded-2xl p-5 transition-all animate-card-emerge ${
                  isCritical ? "animate-glow-pulse-intense" : ""
                }`}
                style={{
                  border: `1px solid ${uc.border}`,
                  backgroundColor: uc.bg,
                  boxShadow: uc.glow,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: Patient & Hospital */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-base">
                        {req.patientName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs font-black px-2"
                        style={{
                          borderColor: "oklch(var(--neon-red) / 0.6)",
                          color: "oklch(var(--neon-red))",
                          backgroundColor: "oklch(var(--neon-red) / 0.1)",
                        }}
                      >
                        {bg}
                      </Badge>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: uc.color,
                          backgroundColor: `${uc.color.replace(")", " / 0.15)")}`,
                          border: `1.5px solid ${uc.border}`,
                          boxShadow: uc.glow,
                        }}
                      >
                        {uc.icon} {uc.label}
                      </span>
                      {isCritical && (
                        <span
                          className="text-xs font-bold animate-heartbeat"
                          style={{ color: uc.color }}
                        >
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {req.hospitalName} · {req.city}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Number(req.quantityMl)} ml needed
                    </div>
                  </div>

                  {/* Right: Contact + Time */}
                  <div className="flex flex-col items-end gap-2">
                    <a
                      href={`tel:${req.contactNumber}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                      style={{
                        backgroundColor: "oklch(var(--neon-red) / 0.15)",
                        color: "oklch(var(--neon-red))",
                        border: "1px solid oklch(var(--neon-red) / 0.4)",
                      }}
                      data-ocid={`bloodreqs.contact.button.${i + 1}`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {req.contactNumber}
                    </a>
                    <a
                      href={`https://wa.me/${req.contactNumber.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{
                        backgroundColor: "oklch(0.5 0.18 140 / 0.15)",
                        color: "oklch(0.65 0.2 140)",
                        border: "1px solid oklch(0.65 0.2 140 / 0.4)",
                      }}
                      data-ocid={`bloodreqs.whatsapp.button.${i + 1}`}
                    >
                      Chat on WhatsApp
                    </a>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(req.createdAt as bigint)}
                    </div>
                  </div>
                </div>

                {/* Owner Actions */}
                {isOwner && (
                  <div
                    className="mt-4 pt-4 flex items-center gap-3"
                    style={{
                      borderTop: "1px solid oklch(var(--border) / 0.5)",
                    }}
                  >
                    <Button
                      size="sm"
                      onClick={() => void handleFulfill(reqId)}
                      disabled={deleteRequest.isPending}
                      className="gap-1.5 flex-1 font-semibold"
                      style={{
                        backgroundColor: "oklch(0.55 0.18 145)",
                        color: "white",
                        boxShadow: "0 0 12px oklch(0.55 0.18 145 / 0.4)",
                      }}
                      data-ocid={`bloodreqs.fulfill.button.${i + 1}`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark as Received
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void handleDelete(reqId)}
                      disabled={deleteRequest.isPending}
                      className="gap-1.5 font-semibold"
                      style={{
                        borderColor: "oklch(var(--neon-red) / 0.6)",
                        color: "oklch(var(--neon-red))",
                        boxShadow: "0 0 8px oklch(var(--neon-red) / 0.2)",
                      }}
                      data-ocid={`bloodreqs.delete.button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete Request
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Decorative animations ─────────────────────── */}
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          <SOSRippleDecor size={240} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                color: "oklch(0.62 0.26 22)",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            >
              URGENCY LEVELS
            </div>
            {[
              { dot: "🟢", label: "Low", desc: "Needed within a week" },
              { dot: "🟡", label: "Medium", desc: "Needed within 48 hrs" },
              { dot: "🟠", label: "High", desc: "Needed within 24 hrs" },
              { dot: "🔴", label: "Critical", desc: "Needed immediately" },
            ].map((u) => (
              <div
                key={u.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "oklch(0.14 0.02 22)",
                  border: "1px solid oklch(0.62 0.26 22 / 0.2)",
                  width: "100%",
                  maxWidth: 220,
                }}
              >
                <span style={{ fontSize: 16 }}>{u.dot}</span>
                <div>
                  <div
                    style={{
                      color: "oklch(0.85 0.1 22)",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {u.label}
                  </div>
                  <div style={{ color: "oklch(0.55 0.08 22)", fontSize: 10 }}>
                    {u.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BloodFactTicker className="mt-8" />
      </div>
    </main>
  );
}
