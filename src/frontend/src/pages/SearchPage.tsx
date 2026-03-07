import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  Droplets,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { DonorPublicInfo } from "../backend.d";
import { BloodGroup } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useSearchDonorsPublic } from "../hooks/useQueries";

const bloodGroupOptions = [
  { value: "all", label: "All Blood Groups" },
  { value: BloodGroup.A_Positive, label: "A+" },
  { value: BloodGroup.A_Negative, label: "A−" },
  { value: BloodGroup.B_Positive, label: "B+" },
  { value: BloodGroup.B_Negative, label: "B−" },
  { value: BloodGroup.AB_Positive, label: "AB+" },
  { value: BloodGroup.AB_Negative, label: "AB−" },
  { value: BloodGroup.O_Positive, label: "O+" },
  { value: BloodGroup.O_Negative, label: "O−" },
];

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

function getBadgeForDonations(count: number): { label: string; emoji: string } {
  if (count >= 25) return { label: "Life Saver", emoji: "🏆" };
  if (count >= 10) return { label: "Gold Donor", emoji: "🥇" };
  if (count >= 5) return { label: "Silver Donor", emoji: "🥈" };
  return { label: "New Donor", emoji: "🩸" };
}

function stripToDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function DonorCard({
  donor,
  index,
}: {
  donor: DonorPublicInfo;
  index: number;
}) {
  const bg = bloodGroupLabel[donor.bloodGroup] ?? String(donor.bloodGroup);
  const donations = Number(donor.totalDonations);
  const badge = getBadgeForDonations(donations);
  const phoneDigits = stripToDigits(donor.phone);
  const hasPhone = phoneDigits.length >= 7;

  return (
    <div
      data-ocid={`search.donor.item.${index}`}
      className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.14 0.01 0) 0%, oklch(0.12 0.02 25 / 0.6) 100%)",
        border: "1px solid oklch(var(--neon-red) / 0.18)",
        boxShadow:
          "0 4px 24px oklch(var(--neon-red) / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.04)",
      }}
    >
      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--neon-red) / 0.6), transparent)",
        }}
      />

      <div className="p-5">
        {/* Header: Name + Blood Group */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "oklch(var(--neon-red) / 0.12)",
                border: "1px solid oklch(var(--neon-red) / 0.2)",
              }}
            >
              <User
                className="h-5 w-5"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground truncate leading-tight">
                {donor.name || "Anonymous Donor"}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs">{badge.emoji}</span>
                <span className="text-xs text-muted-foreground">
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Blood Group Badge */}
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-black"
            style={{
              backgroundColor: "oklch(var(--neon-red) / 0.15)",
              color: "oklch(var(--neon-red))",
              border: "1px solid oklch(var(--neon-red) / 0.3)",
              boxShadow: "0 0 10px oklch(var(--neon-red) / 0.12)",
            }}
          >
            {bg}
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2 mb-4">
          {/* City */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: "oklch(var(--neon-red) / 0.7)" }}
            />
            <span className="text-foreground/80 truncate">
              {donor.city || "City not specified"}
            </span>
          </div>

          {/* Blood Group info */}
          <div className="flex items-center gap-2 text-sm">
            <Droplets
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            <span className="text-muted-foreground">Blood Group:</span>
            <Badge
              variant="outline"
              className="text-xs ml-0.5 h-5 px-1.5"
              style={{
                borderColor: "oklch(var(--neon-red) / 0.4)",
                color: "oklch(var(--neon-red))",
                backgroundColor: "oklch(var(--neon-red) / 0.08)",
              }}
            >
              {bg}
            </Badge>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-sm">
            {donor.availability ? (
              <CheckCircle
                className="h-3.5 w-3.5 flex-shrink-0"
                style={{ color: "oklch(0.65 0.2 140)" }}
              />
            ) : (
              <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            )}
            <span
              className="font-medium"
              style={{
                color: donor.availability
                  ? "oklch(0.65 0.2 140)"
                  : "oklch(0.5 0 0)",
              }}
            >
              {donor.availability ? "Available to donate" : "Not available"}
            </span>
          </div>

          {/* Donations count */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-base leading-none">🩸</span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{donations}</span>{" "}
              donation{donations !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Last donation date */}
          {donor.lastDonationDate && Number(donor.lastDonationDate) > 0 && (
            <div className="text-xs text-muted-foreground pl-5">
              Last donated:{" "}
              {new Date(
                Number(donor.lastDonationDate) / 1_000_000,
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Phone number */}
        {hasPhone && (
          <div
            className="mb-3 p-3 rounded-xl"
            style={{
              backgroundColor: "oklch(0.16 0.01 0)",
              border: "1px solid oklch(var(--border) / 0.5)",
            }}
          >
            <div className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 flex-shrink-0"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              <a
                href={`tel:${donor.phone}`}
                className="text-sm font-semibold text-foreground hover:underline transition-all"
                data-ocid={`search.donor.primary_button.${index}`}
              >
                {donor.phone}
              </a>
            </div>
          </div>
        )}

        {/* WhatsApp button */}
        {hasPhone && (
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid={`search.donor.secondary_button.${index}`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "oklch(0.48 0.18 140)",
                color: "white",
                boxShadow: "0 2px 12px oklch(0.48 0.18 140 / 0.3)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </button>
          </a>
        )}

        {!hasPhone && (
          <div className="text-xs text-center text-muted-foreground py-2 italic">
            Phone not provided
          </div>
        )}
      </div>
    </div>
  );
}

export function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("all");
  const [city, setCity] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchKey, setSearchKey] = useState(0);
  const [searchParams, setSearchParams] = useState<{
    bg: BloodGroup | null;
    city: string | null;
    avail: boolean;
  } | null>(null);
  const { actor } = useActor();
  const [actorReady, setActorReady] = useState(false);

  // Wait until actor is ready before enabling search
  useEffect(() => {
    if (actor) setActorReady(true);
  }, [actor]);

  const {
    data: donors,
    isLoading,
    isFetching,
  } = useSearchDonorsPublic(
    searchParams?.bg ?? null,
    searchParams?.city ?? null,
    null,
    searchParams?.avail ?? false,
    searched && actorReady,
    searchKey,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      return;
    }
    setSearched(true);
    setSearchKey((k) => k + 1);
    setSearchParams({
      bg: bloodGroup === "all" ? null : (bloodGroup as BloodGroup),
      city: city.trim() || null,
      avail: availableOnly,
    });
  };

  const handleSearchAll = () => {
    if (!actor) return;
    setSearched(true);
    setSearchKey((k) => k + 1);
    setSearchParams({
      bg: null,
      city: null,
      avail: false,
    });
    setBloodGroup("all");
    setCity("");
    setAvailableOnly(false);
  };

  const showLoading = (isLoading || isFetching) && searched;
  const displayDonors: DonorPublicInfo[] = donors ?? [];

  return (
    <main className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.1)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.25)",
          }}
        >
          <Search className="h-4 w-4" />
          Donor Search
        </div>
        <h1 className="font-display text-4xl font-black mb-3">
          Find Blood Donors
        </h1>
        <p className="text-muted-foreground">
          Search by blood group, city, or availability
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="max-w-3xl mx-auto mb-4 rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(145deg, oklch(0.14 0.01 0) 0%, oklch(0.12 0.02 25 / 0.4) 100%)",
          border: "1px solid oklch(var(--neon-red) / 0.2)",
          boxShadow:
            "0 8px 32px oklch(var(--neon-red) / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.04)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Blood Group */}
          <div className="space-y-2">
            <Label>Blood Group</Label>
            <Select value={bloodGroup} onValueChange={setBloodGroup}>
              <SelectTrigger
                data-ocid="search.bloodgroup.select"
                className="bg-secondary border-border"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="search-city">City</Label>
            <Input
              id="search-city"
              placeholder="Chennai, Mumbai..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-secondary border-border"
              data-ocid="search.city.input"
            />
          </div>

          {/* Available Only */}
          <div className="space-y-2">
            <Label className="block">Available Only</Label>
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={availableOnly}
                onCheckedChange={setAvailableOnly}
                data-ocid="search.available.switch"
              />
              <span className="text-sm text-muted-foreground">
                {availableOnly ? "Available only" : "All donors"}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="flex-1 font-bold"
            data-ocid="search.submit.button"
            disabled={!actorReady}
            style={{
              backgroundColor: "oklch(var(--neon-red))",
              color: "white",
              boxShadow: actorReady
                ? "0 0 16px oklch(var(--neon-red) / 0.3)"
                : "none",
              opacity: actorReady ? 1 : 0.6,
            }}
          >
            {actorReady ? (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Donors
              </>
            ) : (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="font-semibold border-primary/40 hover:bg-primary/10"
            data-ocid="search.all.button"
            onClick={handleSearchAll}
            disabled={!actorReady}
          >
            Search All Donors
          </Button>
        </div>
      </form>

      {/* Blockchain note */}
      <p className="text-center text-xs text-muted-foreground mb-8 opacity-60">
        Results are fetched directly from the blockchain.
      </p>

      {/* Loading state */}
      {showLoading && (
        <div className="text-center py-12" data-ocid="search.loading_state">
          <Loader2
            className="h-8 w-8 animate-spin mx-auto mb-3"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <p className="text-muted-foreground">Searching blockchain...</p>
        </div>
      )}

      {/* Results */}
      {!showLoading && searched && (
        <>
          {/* Result summary */}
          {displayDonors.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Found{" "}
                <span
                  className="font-bold text-lg"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  {displayDonors.length}
                </span>{" "}
                donor{displayDonors.length !== 1 ? "s" : ""}
              </p>
              <div
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.1)",
                  color: "oklch(var(--neon-red))",
                  border: "1px solid oklch(var(--neon-red) / 0.2)",
                }}
              >
                Live data
              </div>
            </div>
          )}

          {/* Donor grid */}
          {displayDonors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayDonors.map((donor, i) => (
                <DonorCard
                  key={donor.userId.toString()}
                  donor={donor}
                  index={i + 1}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div
              className="text-center py-16 rounded-2xl"
              data-ocid="search.empty_state"
              style={{
                border: "1px dashed oklch(var(--neon-red) / 0.2)",
                backgroundColor: "oklch(var(--card) / 0.3)",
              }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-semibold text-lg mb-2">No donors found</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                Try adjusting your search — remove the blood group or city
                filter, or click "Search All Donors" to see everyone.
              </p>
            </div>
          )}
        </>
      )}

      {/* Initial state — before first search */}
      {!searched && !showLoading && (
        <div
          className="text-center py-16 text-muted-foreground rounded-2xl"
          style={{
            border: "1px dashed oklch(var(--border) / 0.4)",
            backgroundColor: "oklch(var(--card) / 0.2)",
          }}
        >
          <MapPin
            className="h-12 w-12 mx-auto mb-4 opacity-25"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <p className="text-base font-medium mb-1">
            Search for blood donors near you
          </p>
          <p className="text-sm opacity-60">
            Select a blood group or enter a city above — or click "Search All
            Donors" to browse everyone.
          </p>
        </div>
      )}
    </main>
  );
}
