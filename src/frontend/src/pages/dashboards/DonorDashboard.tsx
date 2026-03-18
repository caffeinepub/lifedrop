import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Droplets,
  Heart,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BloodGroup, UrgencyLevel } from "../../backend.d";
import { DeleteAccountSection } from "../../components/DeleteAccountSection";
import { useApp } from "../../contexts/AppContext";

import {
  useAcceptBloodRequest,
  useAllDonors,
  useBloodRequests,
  useCallerDonorProfile,
  useUpdateDonorAvailability,
} from "../../hooks/useQueries";

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

function getBadge(donations: number) {
  if (donations >= 25)
    return { label: "Life Saver", icon: "🏆", color: "oklch(0.78 0.19 50)" };
  if (donations >= 10)
    return { label: "Gold Donor", icon: "🥇", color: "oklch(0.78 0.18 70)" };
  if (donations >= 5)
    return { label: "Silver Donor", icon: "🥈", color: "oklch(0.72 0.1 240)" };
  return { label: "New Donor", icon: "🩸", color: "oklch(var(--neon-red))" };
}

const urgencyColors: Record<string, string> = {
  [UrgencyLevel.low]: "oklch(0.65 0.2 140)",
  [UrgencyLevel.medium]: "oklch(0.75 0.18 70)",
  [UrgencyLevel.high]: "oklch(0.68 0.2 40)",
  [UrgencyLevel.critical]: "oklch(0.62 0.26 25)",
};

// Health eligibility checker
function EligibilityChecker() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    lastDonation: "",
    hasCondition: false,
  });
  const [result, setResult] = useState<"eligible" | "ineligible" | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);

  const check = () => {
    const ageN = Number.parseInt(form.age);
    const weightN = Number.parseFloat(form.weight);
    const issues: string[] = [];
    if (!ageN || ageN < 18 || ageN > 65)
      issues.push("Age must be between 18 and 65");
    if (!weightN || weightN < 50) issues.push("Weight must be at least 50 kg");
    if (form.hasCondition) issues.push("Active medical condition detected");
    if (form.lastDonation) {
      const last = new Date(form.lastDonation);
      const daysSince = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 56)
        issues.push(
          `Must wait ${Math.ceil(56 - daysSince)} more days since last donation`,
        );
    }
    setReasons(issues);
    setResult(issues.length === 0 ? "eligible" : "ineligible");
  };

  return (
    <div className="rounded-xl p-5 card-dark">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Heart
          className="h-4 w-4"
          style={{ color: "oklch(var(--neon-red))" }}
        />
        Health Eligibility Check
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1.5">
          <Label htmlFor="elig-age" className="text-xs">
            Age (years)
          </Label>
          <Input
            id="elig-age"
            type="number"
            placeholder="25"
            value={form.age}
            onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
            className="bg-secondary border-border text-sm h-9"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="elig-weight" className="text-xs">
            Weight (kg)
          </Label>
          <Input
            id="elig-weight"
            type="number"
            placeholder="65"
            value={form.weight}
            onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
            className="bg-secondary border-border text-sm h-9"
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="elig-date" className="text-xs">
            Last Donation Date
          </Label>
          <Input
            id="elig-date"
            type="date"
            value={form.lastDonation}
            onChange={(e) =>
              setForm((p) => ({ ...p, lastDonation: e.target.value }))
            }
            className="bg-secondary border-border text-sm h-9"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <Checkbox
            id="elig-cond"
            checked={form.hasCondition}
            onCheckedChange={(v) =>
              setForm((p) => ({ ...p, hasCondition: !!v }))
            }
            data-ocid="donor.eligibility.checkbox"
          />
          <Label htmlFor="elig-cond" className="text-sm">
            I have an active medical condition
          </Label>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full mb-3"
        onClick={check}
        data-ocid="donor.eligibility.submit_button"
        style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
      >
        Check Eligibility
      </Button>
      {result && (
        <div
          className="p-3 rounded-lg text-sm"
          style={{
            backgroundColor:
              result === "eligible"
                ? "oklch(0.65 0.2 140 / 0.1)"
                : "oklch(var(--neon-red) / 0.1)",
            border: `1px solid ${result === "eligible" ? "oklch(0.65 0.2 140 / 0.3)" : "oklch(var(--neon-red) / 0.3)"}`,
            color:
              result === "eligible"
                ? "oklch(0.65 0.2 140)"
                : "oklch(var(--neon-red))",
          }}
          data-ocid={
            result === "eligible"
              ? "donor.eligibility.success_state"
              : "donor.eligibility.error_state"
          }
        >
          {result === "eligible" ? (
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle className="h-4 w-4" />
              You are eligible to donate blood!
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 font-semibold mb-2">
                <XCircle className="h-4 w-4" /> Not eligible currently
              </div>
              <ul className="list-disc list-inside text-xs space-y-0.5 opacity-90">
                {reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DonorDashboard() {
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const [availability, setAvailability] = useState(true);

  const { data: requests, isLoading: loadingRequests } = useBloodRequests();
  const { data: allDonorsData } = useAllDonors();
  const { data: callerDonorProfile } = useCallerDonorProfile();

  // Leaderboard: all donors sorted by totalDonations descending
  const topDonors = useMemo(() => {
    if (!allDonorsData) return [];
    return [...allDonorsData]
      .sort((a, b) => Number(b.totalDonations) - Number(a.totalDonations))
      .slice(0, 5);
  }, [allDonorsData]);
  const acceptRequest = useAcceptBloodRequest();
  const updateAvailability = useUpdateDonorAvailability();

  const totalDonations = callerDonorProfile
    ? Number(callerDonorProfile.totalDonations)
    : 0;
  const badge = getBadge(totalDonations);

  // Generate stable donor ID — keyed per person's name so different people get different IDs
  const donorId = useMemo(() => {
    if (!userProfile) return "LD-XXXXXX-0000";
    // Use name-specific storage key so each person on this device gets their own ID
    const nameKey = `lifedrop_donor_id_${userProfile.name.replace(/\s+/g, "_").toLowerCase()}`;
    const stored = localStorage.getItem(nameKey);
    if (stored) return stored;
    const prefix = userProfile.name
      .replace(/\s+/g, "")
      .slice(0, 6)
      .toUpperCase()
      .padEnd(6, "X");
    const suffix = Date.now().toString(16).slice(-4).toUpperCase();
    const id = `LD-${prefix}-${suffix}`;
    localStorage.setItem(nameKey, id);
    // Also save current user's ID for backward compat (DonorIdPage uses this)
    localStorage.setItem("lifedrop_donor_id", id);
    // Save donor card data so the ID page can decode it without auth
    const cardData = {
      name: userProfile.name,
      bloodGroup: userProfile.bloodGroup ?? "",
      city: userProfile.city ?? "",
      totalDonations: totalDonations,
      phone: (userProfile as any).phone ?? "",
    };
    localStorage.setItem(`lifedrop_donor_card_${id}`, JSON.stringify(cardData));
    return id;
  }, [userProfile, totalDonations]);

  // Cache donor profile for DonorIdPage and update card data
  useEffect(() => {
    if (callerDonorProfile) {
      localStorage.setItem(
        "lifedrop_donor_profile_cache",
        JSON.stringify({
          totalDonations: Number(callerDonorProfile.totalDonations),
        }),
      );
      // Update card data for this donor's ID card
      if (userProfile) {
        const nameKey = `lifedrop_donor_id_${userProfile.name.replace(/\s+/g, "_").toLowerCase()}`;
        const id =
          localStorage.getItem(nameKey) ||
          localStorage.getItem("lifedrop_donor_id");
        if (id) {
          const cardData = {
            name: userProfile.name,
            bloodGroup: userProfile.bloodGroup ?? "",
            city: userProfile.city ?? "",
            totalDonations: Number(callerDonorProfile.totalDonations),
            phone: (userProfile as any).phone ?? "",
          };
          localStorage.setItem(
            `lifedrop_donor_card_${id}`,
            JSON.stringify(cardData),
          );
        }
      }
    }
  }, [callerDonorProfile, userProfile]);

  const handleToggleAvailability = async (val: boolean) => {
    setAvailability(val);
    try {
      await updateAvailability.mutateAsync(val);
      toast.success(
        val ? "You are now available for donation" : "Availability paused",
      );
    } catch {
      setAvailability(!val);
      toast.error("Failed to update availability");
    }
  };

  const handleAccept = async (id: bigint, _idx: number) => {
    try {
      await acceptRequest.mutateAsync(id);
      toast.success("Blood request accepted! Please contact the hospital.");
    } catch {
      toast.error("Failed to accept request");
    }
  };

  if (!userProfile) {
    return (
      <main className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">
          Please register to access your donor dashboard.
        </p>
        <Button
          className="mt-4"
          onClick={() => void navigate({ to: "/register" })}
          style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
        >
          Register
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-8 animate-cinema-enter">
        Donor <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Profile Card */}
          <div className="rounded-xl p-5 card-dark">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center font-display text-xl font-black flex-shrink-0"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.12)",
                  color: "oklch(var(--neon-red))",
                }}
              >
                {userProfile?.bloodGroup
                  ? (bloodGroupLabel[userProfile.bloodGroup] ?? "?")
                  : "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">
                  {userProfile?.name ?? "Donor"}
                </h2>
                <p className="text-sm text-muted-foreground truncate">
                  {userProfile?.city ?? "Location not set"}
                </p>
                <div className="mt-1.5">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: badge.color.replace(")", " / 0.4)"),
                      color: badge.color,
                    }}
                  >
                    {badge.icon} {badge.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Donations", value: totalDonations },
                {
                  label: "Lives Saved",
                  value:
                    totalDonations > 0 ? Math.ceil(totalDonations * 2.7) : 0,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-2 rounded-lg"
                  style={{ backgroundColor: "oklch(var(--secondary))" }}
                >
                  <div
                    className="font-display font-black text-lg"
                    style={{ color: "oklch(var(--neon-red))" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="avail-toggle" className="text-sm font-medium">
                Available for donation
              </Label>
              <Switch
                id="avail-toggle"
                checked={availability}
                onCheckedChange={handleToggleAvailability}
                data-ocid="donor.availability.toggle"
              />
            </div>
          </div>

          {/* Digital ID Card mini */}
          <button
            type="button"
            className="w-full text-left rounded-xl p-5 cursor-pointer hover:border-primary/40 transition-all card-dark"
            onClick={() =>
              void navigate({
                to: "/donor-id/$id",
                params: { id: donorId },
              })
            }
          >
            <h3 className="font-semibold text-sm mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Droplets
                  className="h-4 w-4"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                Digital Donor ID
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </h3>
            <div
              className="rounded-lg p-3 font-mono text-xs space-y-1"
              style={{
                backgroundColor: "oklch(var(--secondary))",
                border: "1px solid oklch(var(--neon-red) / 0.2)",
              }}
            >
              <div>
                Name:{" "}
                <span className="text-foreground">
                  {userProfile?.name ?? "—"}
                </span>
              </div>
              <div>
                Group:{" "}
                <span style={{ color: "oklch(var(--neon-red))" }}>
                  {userProfile?.bloodGroup
                    ? bloodGroupLabel[userProfile.bloodGroup]
                    : "—"}
                </span>
              </div>
              <div>
                ID: <span className="text-muted-foreground">{donorId}</span>
              </div>
              <div>
                Donations:{" "}
                <span className="text-foreground">{totalDonations}</span>
              </div>
              {(userProfile as any).phone && (
                <div>
                  Phone:{" "}
                  <span className="text-foreground">
                    {(userProfile as any).phone}
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Eligibility Reminder */}
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: "oklch(0.65 0.2 140 / 0.08)",
              border: "1px solid oklch(0.65 0.2 140 / 0.25)",
            }}
          >
            <Clock
              className="h-5 w-5 flex-shrink-0"
              style={{ color: "oklch(0.65 0.2 140)" }}
            />
            <div className="text-sm">
              <div
                className="font-semibold"
                style={{ color: "oklch(0.65 0.2 140)" }}
              >
                Check your eligibility below
              </div>
              <div className="text-xs text-muted-foreground">
                Use the eligibility checker to see if you can donate today
              </div>
            </div>
          </div>

          {/* Eligibility Checker */}
          <EligibilityChecker />
        </div>

        {/* Middle column - Blood Requests */}
        <div className="lg:col-span-2 space-y-5">
          {/* Badge Progress */}
          <div className="rounded-xl p-5 card-dark">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award
                className="h-4 w-4"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              Badge Progress
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "New Donor",
                  min: 1,
                  icon: "🩸",
                  color: "oklch(0.62 0.22 25)",
                },
                {
                  label: "Silver Donor",
                  min: 5,
                  icon: "🥈",
                  color: "oklch(0.72 0.1 240)",
                },
                {
                  label: "Gold Donor",
                  min: 10,
                  icon: "🥇",
                  color: "oklch(0.78 0.18 70)",
                },
                {
                  label: "Life Saver",
                  min: 25,
                  icon: "🏆",
                  color: "oklch(0.78 0.19 50)",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="text-center p-3 rounded-xl transition-all"
                  style={{
                    backgroundColor:
                      totalDonations >= b.min
                        ? b.color.replace(")", " / 0.12)")
                        : "oklch(var(--secondary))",
                    border: `1px solid ${
                      totalDonations >= b.min
                        ? b.color.replace(")", " / 0.4)")
                        : "oklch(var(--border))"
                    }`,
                  }}
                >
                  <div
                    className="text-2xl mb-1"
                    style={{ opacity: totalDonations >= b.min ? 1 : 0.3 }}
                  >
                    {b.icon}
                  </div>
                  <div
                    className="text-xs font-medium"
                    style={{
                      color: totalDonations >= b.min ? b.color : undefined,
                    }}
                  >
                    {b.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {b.min}+ donations
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Blood Requests */}
          <div className="rounded-xl card-dark overflow-hidden">
            <div
              className="p-5 border-b"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle
                  className="h-4 w-4"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
                Emergency Blood Requests
              </h3>
            </div>
            {loadingRequests ? (
              <div
                className="p-8 text-center"
                data-ocid="donor.requests.loading_state"
              >
                <Loader2
                  className="h-6 w-6 animate-spin mx-auto"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
              </div>
            ) : requests && requests.length > 0 ? (
              <div
                className="divide-y"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                {requests.slice(0, 6).map((req, i) => (
                  <div
                    key={req.id.toString()}
                    className="p-4 flex items-center gap-4"
                    data-ocid={`donor.request.item.${i + 1}`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm flex-shrink-0"
                      style={{
                        backgroundColor: "oklch(var(--neon-red) / 0.12)",
                        color: "oklch(var(--neon-red))",
                      }}
                    >
                      {bloodGroupLabel[req.bloodGroup] ?? req.bloodGroup}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {req.patientName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {req.hospitalName} · {req.city} ·{" "}
                        {Number(req.quantityMl)}ml
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${urgencyColors[req.urgencyLevel] ?? "oklch(var(--neon-red))"} / 0.1)`,
                          color:
                            urgencyColors[req.urgencyLevel] ??
                            "oklch(var(--neon-red))",
                          border: `1px solid ${urgencyColors[req.urgencyLevel] ?? "oklch(var(--neon-red))"} / 0.3)`,
                        }}
                      >
                        {req.urgencyLevel}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(req.id, i)}
                        disabled={acceptRequest.isPending}
                        data-ocid={`donor.accept_request.button.${i + 1}`}
                        style={{
                          backgroundColor: "oklch(var(--neon-red))",
                          color: "white",
                        }}
                        className="text-xs h-7"
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="donor.requests.empty_state"
              >
                <div className="text-3xl mb-2">✅</div>
                <p className="text-sm">No pending blood requests right now.</p>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="rounded-xl card-dark overflow-hidden">
            <div
              className="p-5 border-b"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              <h3 className="font-semibold flex items-center gap-2">
                🏆 Top Donors Leaderboard
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Rankings based on verified donations
              </p>
            </div>
            <div
              className="divide-y"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              {topDonors.map((donor, i) => {
                const medalGlow =
                  i === 0
                    ? { boxShadow: "0 0 15px oklch(0.78 0.19 50 / 0.3)" }
                    : i === 1
                      ? { boxShadow: "0 0 12px oklch(0.72 0.1 240 / 0.3)" }
                      : i === 2
                        ? { boxShadow: "0 0 10px oklch(0.65 0.18 55 / 0.3)" }
                        : {};
                const rankColors = [
                  "oklch(0.78 0.19 50)",
                  "oklch(0.72 0.1 240)",
                  "oklch(0.65 0.18 55)",
                ];
                return (
                  <div
                    key={donor.userId.toString()}
                    className="p-4 flex items-center gap-3"
                    data-ocid={`donor.leaderboard.item.${i + 1}`}
                    style={medalGlow}
                  >
                    <div
                      className="w-6 text-center font-mono text-sm font-bold"
                      style={{
                        color: i < 3 ? rankColors[i] : undefined,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: "oklch(var(--neon-red) / 0.12)",
                        color: "oklch(var(--neon-red))",
                      }}
                    >
                      {bloodGroupLabel[donor.bloodGroup] ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        Donor #{i + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {bloodGroupLabel[donor.bloodGroup] ?? "?"} blood group
                      </div>
                    </div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: "oklch(var(--neon-red))" }}
                    >
                      {Number(donor.totalDonations)} 🩸
                    </div>
                  </div>
                );
              })}
              {topDonors.length === 0 && (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  Be the first on the leaderboard!
                </div>
              )}
            </div>
          </div>

          {/* Appointments */}
          <div className="rounded-xl card-dark p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock
                className="h-4 w-4"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              Upcoming Appointments
            </h3>
            <div
              className="text-center py-6 text-muted-foreground"
              data-ocid="donor.appointments.empty_state"
            >
              <div className="text-3xl mb-2">🗓️</div>
              <p className="text-sm">No appointments scheduled yet.</p>
              <p className="text-xs mt-1 opacity-70">
                Book a donation appointment to see it here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <DeleteAccountSection />
    </main>
  );
}
