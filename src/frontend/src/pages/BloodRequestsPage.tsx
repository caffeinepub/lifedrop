import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Droplets,
  Heart,
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
import {
  useBloodRequests,
  useDeleteBloodRequest,
  useFulfillBloodRequest,
} from "../hooks/useQueries";
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

const MIN_THANK_YOU_LENGTH = 10;

export function BloodRequestsPage() {
  const { data: requests, isLoading, refetch, isFetching } = useBloodRequests();
  const deleteRequest = useDeleteBloodRequest();
  const fulfillRequest = useFulfillBloodRequest();
  const [filterGroup, setFilterGroup] = useState("");
  const [filterCity, setFilterCity] = useState("");

  // Thank-you dialog state
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{
    id: bigint;
    patientName: string;
    bloodGroup: string;
    city: string;
  } | null>(null);
  const [thankYouMsg, setThankYouMsg] = useState(
    "Thank you to all the heroes who helped save a life today! Your kindness means everything.",
  );

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

  function openThankYouDialog(req: {
    id: bigint;
    patientName: string;
    bloodGroup: string;
    city: string;
  }) {
    setActiveRequest(req);
    setThankYouMsg(
      "Thank you to all the heroes who helped save a life today! Your kindness means everything.",
    );
    setThankYouOpen(true);
  }

  async function handleSendThankYou() {
    if (!activeRequest || thankYouMsg.trim().length < MIN_THANK_YOU_LENGTH)
      return;
    try {
      await fulfillRequest.mutateAsync({
        requestId: activeRequest.id,
        thankYouMessage: thankYouMsg.trim(),
      });
      const bg =
        bloodGroupLabel[activeRequest.bloodGroup] ?? activeRequest.bloodGroup;
      const broadcastMsg = `🩸 Blood has been received! ${activeRequest.patientName} (${bg}, ${activeRequest.city}) sends heartfelt thanks to all helpers. “${thankYouMsg.trim()}”`;
      addNotificationGlobal(broadcastMsg, "success");
      toast.success("Thank you message sent to all users!", { duration: 5000 });
      setThankYouOpen(false);
      setActiveRequest(null);
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

  const charsLeft = Math.max(
    0,
    MIN_THANK_YOU_LENGTH - thankYouMsg.trim().length,
  );
  const isThankYouValid = thankYouMsg.trim().length >= MIN_THANK_YOU_LENGTH;

  return (
    <>
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
              Loading blood requests...
            </p>
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            data-ocid="bloodreqs.list.empty_state"
            style={{
              border: "1px dashed oklch(var(--neon-red) / 0.3)",
              backgroundColor: "oklch(var(--card))",
            }}
          >
            <div className="text-5xl mb-4">🩸</div>
            <h3 className="font-display font-black text-xl mb-2">
              No Active Blood Requests
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              There are currently no blood requests matching your filters.
            </p>
            <Link to="/request">
              <Button
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
                className="btn-glow font-bold"
                data-ocid="bloodreqs.empty.submit.primary_button"
              >
                Submit Emergency Request
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sorted.map((req, i) => {
              const uc = urgencyConfig[req.urgencyLevel] ?? urgencyConfig.low;
              const bg =
                bloodGroupLabel[req.bloodGroup as string] ?? req.bloodGroup;
              const isOwner =
                myPrincipal && req.requesterId.toString() === myPrincipal;

              return (
                <div
                  key={req.id.toString()}
                  data-ocid={`bloodreqs.item.${i + 1}`}
                  className="rounded-2xl p-5 transition-all hover:scale-[1.01] animate-live-item"
                  style={{
                    border: `1px solid ${uc.border}`,
                    backgroundColor: uc.bg,
                    boxShadow: uc.glow,
                    animationDelay: `${i * 0.07}s`,
                  }}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    {/* Blood Group Badge */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-black text-lg flex-shrink-0"
                      style={{
                        backgroundColor: uc.bg,
                        border: `2px solid ${uc.border}`,
                        color: uc.color,
                      }}
                    >
                      {bg}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-base">
                          {req.patientName}
                        </h3>
                        <Badge
                          variant="outline"
                          className="text-xs font-bold"
                          style={{
                            borderColor: uc.border,
                            color: uc.color,
                            backgroundColor: uc.bg,
                          }}
                        >
                          {uc.icon} {uc.label}
                        </Badge>
                        {isOwner && (
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: "oklch(0.65 0.15 240 / 0.5)",
                              color: "oklch(0.65 0.15 240)",
                            }}
                          >
                            Your Request
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <div>
                          🏥 {req.hospitalName} · 📍 {req.city}
                        </div>
                        <div>🩸 {Number(req.quantityMl)} ml needed</div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(req.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {/* Contact button (always visible) */}
                      <a href={`tel:${req.contactNumber}`}>
                        <Button
                          size="sm"
                          className="gap-1.5 w-full"
                          style={{
                            backgroundColor: uc.color,
                            color: "white",
                          }}
                          data-ocid={`bloodreqs.contact.button.${i + 1}`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {req.contactNumber}
                        </Button>
                      </a>

                      {/* Owner-only actions */}
                      {isOwner && (
                        <div className="flex gap-2">
                          {/* Blood Received - green */}
                          <Button
                            size="sm"
                            className="gap-1.5 flex-1 font-semibold"
                            onClick={() =>
                              openThankYouDialog({
                                id: req.id,
                                patientName: req.patientName,
                                bloodGroup: req.bloodGroup as string,
                                city: req.city,
                              })
                            }
                            disabled={fulfillRequest.isPending}
                            data-ocid={`bloodreqs.received.button.${i + 1}`}
                            style={{
                              backgroundColor: "oklch(0.55 0.2 140)",
                              color: "white",
                              boxShadow: "0 0 12px oklch(0.55 0.2 140 / 0.4)",
                            }}
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Received
                          </Button>

                          {/* Delete - red outline */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 flex-shrink-0"
                            onClick={() => void handleDelete(req.id)}
                            disabled={deleteRequest.isPending}
                            data-ocid={`bloodreqs.delete.delete_button.${i + 1}`}
                            style={{
                              borderColor: "oklch(var(--neon-red) / 0.5)",
                              color: "oklch(var(--neon-red))",
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <BloodFactTicker />
      </main>

      {/* Thank You Dialog */}
      <AlertDialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <AlertDialogContent
          data-ocid="bloodreqs.thankyou.dialog"
          style={{
            border: "1px solid oklch(0.55 0.2 140 / 0.5)",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Heart
                className="h-5 w-5"
                style={{ color: "oklch(0.55 0.2 140)" }}
              />
              🩸 Blood Has Been Received!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Share a thank you message for all helpers who responded. This
              notification will be sent to{" "}
              <span className="font-bold text-foreground">all users</span> of
              LIFEDROP.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-2 space-y-2">
            <Textarea
              value={thankYouMsg}
              onChange={(e) => setThankYouMsg(e.target.value)}
              placeholder="Thank you to all the heroes who helped save a life today! Your kindness means everything."
              rows={4}
              className="bg-secondary border-border resize-none"
              data-ocid="bloodreqs.thankyou.textarea"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {thankYouMsg.trim().length} characters
              </p>
              {charsLeft > 0 && (
                <p
                  className="text-xs"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  {charsLeft} more character{charsLeft !== 1 ? "s" : ""} needed
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="bloodreqs.thankyou.cancel_button"
              onClick={() => setActiveRequest(null)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={() => void handleSendThankYou()}
              disabled={!isThankYouValid || fulfillRequest.isPending}
              data-ocid="bloodreqs.thankyou.confirm_button"
              style={{
                backgroundColor: isThankYouValid
                  ? "oklch(0.55 0.2 140)"
                  : undefined,
                color: isThankYouValid ? "white" : undefined,
                boxShadow: isThankYouValid
                  ? "0 0 14px oklch(0.55 0.2 140 / 0.4)"
                  : undefined,
                opacity: !isThankYouValid || fulfillRequest.isPending ? 0.5 : 1,
              }}
            >
              {fulfillRequest.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Send Thank You to All
                </span>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SOSRippleDecor />
    </>
  );
}
