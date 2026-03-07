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
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { BloodGroup } from "../backend.d";
import { useSearchDonors } from "../hooks/useQueries";

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

export function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("all");
  const [city, setCity] = useState("");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [searched, setSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    bg: BloodGroup | null;
    city: string | null;
    avail: boolean;
  } | null>(null);

  const { data: donors, isLoading } = useSearchDonors(
    searchParams?.bg ?? null,
    searchParams?.city ?? null,
    searchParams?.avail ?? true,
    !!searchParams,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSearchParams({
      bg: bloodGroup === "all" ? null : (bloodGroup as BloodGroup),
      city: city.trim() || null,
      avail: availableOnly,
    });
  };

  return (
    <main className="container mx-auto px-4 py-12">
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
          Search by blood group, city, and availability
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="max-w-2xl mx-auto mb-12 rounded-2xl p-6 card-dark"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

          <div className="space-y-2">
            <Label className="block">Available Only</Label>
            <div className="flex items-center gap-3 h-10">
              <Switch
                checked={availableOnly}
                onCheckedChange={setAvailableOnly}
                data-ocid="search.available.switch"
              />
              <span className="text-sm text-muted-foreground">
                {availableOnly ? "Yes" : "All donors"}
              </span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full font-bold"
          data-ocid="search.submit.button"
          style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Donors
        </Button>
      </form>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12" data-ocid="search.loading_state">
          <Loader2
            className="h-8 w-8 animate-spin mx-auto mb-3"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <p className="text-muted-foreground">Searching for donors...</p>
        </div>
      )}

      {searched && !isLoading && donors && donors.length === 0 && (
        <div
          className="text-center py-16 rounded-2xl"
          data-ocid="search.empty_state"
          style={{
            border: "1px dashed oklch(var(--border))",
            backgroundColor: "oklch(var(--card) / 0.5)",
          }}
        >
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-semibold text-lg mb-2">No donors found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your filters — remove the city or blood group
            restriction.
          </p>
        </div>
      )}

      {donors && donors.length > 0 && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Found{" "}
            <span className="font-semibold text-foreground">
              {donors.length}
            </span>{" "}
            donor
            {donors.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.map((donor, i) => (
              <div
                key={donor.userId.toString()}
                data-ocid={`search.donor.item.${i + 1}`}
                className="p-5 rounded-xl card-dark hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-lg font-black"
                    style={{
                      backgroundColor: "oklch(var(--neon-red) / 0.12)",
                      color: "oklch(var(--neon-red))",
                    }}
                  >
                    {bloodGroupLabel[donor.bloodGroup] ?? donor.bloodGroup}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {donor.availability ? (
                      <CheckCircle
                        className="h-4 w-4"
                        style={{ color: "oklch(0.65 0.2 140)" }}
                      />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: donor.availability
                          ? "oklch(0.65 0.2 140)"
                          : undefined,
                      }}
                    >
                      {donor.availability ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Droplets
                      className="h-3.5 w-3.5"
                      style={{ color: "oklch(var(--neon-red))" }}
                    />
                    <span>
                      Blood Group:{" "}
                      <Badge
                        variant="outline"
                        className="text-xs ml-1"
                        style={{
                          borderColor: "oklch(var(--neon-red) / 0.4)",
                          color: "oklch(var(--neon-red))",
                        }}
                      >
                        {bloodGroupLabel[donor.bloodGroup] ?? donor.bloodGroup}
                      </Badge>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono text-xs">
                      ID: {donor.userId.toString().slice(0, 12)}...
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>🩸</span>
                    <span>
                      {Number(donor.totalDonations)} donation
                      {Number(donor.totalDonations) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-4 pt-3 border-t text-xs font-mono text-muted-foreground"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  {donor.lastDonationDate
                    ? `Last donated: ${new Date(Number(donor.lastDonationDate) / 1_000_000).toLocaleDateString()}`
                    : "No previous donations recorded"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Use the search form above to find blood donors near you.</p>
        </div>
      )}
    </main>
  );
}
