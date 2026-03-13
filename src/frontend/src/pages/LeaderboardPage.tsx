import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useAllDonors } from "../hooks/useQueries";

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

const MEDAL_GLOWS = [
  // #1 gold
  {
    border: "oklch(0.85 0.18 85 / 0.7)",
    bg: "oklch(0.85 0.18 85 / 0.08)",
    glow: "0 0 20px oklch(0.85 0.18 85 / 0.4), 0 0 40px oklch(0.85 0.18 85 / 0.15)",
    text: "oklch(0.85 0.18 85)",
    label: "🥇",
    rankStyle: {
      color: "oklch(0.85 0.18 85)",
      fontWeight: 900,
      fontSize: "1.4rem",
    },
  },
  // #2 silver
  {
    border: "oklch(0.75 0.01 20 / 0.7)",
    bg: "oklch(0.75 0.01 20 / 0.07)",
    glow: "0 0 16px oklch(0.75 0.01 20 / 0.35), 0 0 32px oklch(0.75 0.01 20 / 0.12)",
    text: "oklch(0.75 0.01 20)",
    label: "🥈",
    rankStyle: {
      color: "oklch(0.75 0.01 20)",
      fontWeight: 900,
      fontSize: "1.3rem",
    },
  },
  // #3 bronze
  {
    border: "oklch(0.72 0.18 45 / 0.7)",
    bg: "oklch(0.72 0.18 45 / 0.08)",
    glow: "0 0 14px oklch(0.72 0.18 45 / 0.4), 0 0 28px oklch(0.72 0.18 45 / 0.15)",
    text: "oklch(0.72 0.18 45)",
    label: "🥉",
    rankStyle: {
      color: "oklch(0.72 0.18 45)",
      fontWeight: 900,
      fontSize: "1.2rem",
    },
  },
];

export function LeaderboardPage() {
  const { data: donors, isLoading } = useAllDonors();

  const sorted = useMemo(() => {
    if (!donors) return [];
    return [...donors].sort(
      (a, b) => Number(b.totalDonations) - Number(a.totalDonations),
    );
  }, [donors]);

  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
          style={{
            backgroundColor: "oklch(0.85 0.18 85 / 0.12)",
            color: "oklch(0.85 0.18 85)",
            border: "1px solid oklch(0.85 0.18 85 / 0.4)",
          }}
        >
          <Trophy className="h-4 w-4" />
          LIVE RANKINGS
        </div>
        <h1 className="font-display text-4xl font-black mb-2">
          Donor{" "}
          <span style={{ color: "oklch(var(--neon-red))" }}>Leaderboard</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Top blood donors ranked by total verified donations
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex flex-col items-center justify-center py-10 gap-4"
          data-ocid="leaderboard.list.loading_state"
        >
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <p className="text-muted-foreground text-sm">Loading rankings...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sorted.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          data-ocid="leaderboard.list.empty_state"
          style={{
            border: "1px dashed oklch(var(--neon-red) / 0.25)",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="font-semibold text-lg mb-1">
            No donors registered yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Register as a Donor and make your first donation to appear here.
          </p>
        </div>
      )}

      {/* Leaderboard list */}
      {!isLoading && sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((donor, i) => {
            const rank = i + 1;
            const medal = MEDAL_GLOWS[i];
            const bg =
              bloodGroupLabel[donor.bloodGroup as string] ??
              String(donor.bloodGroup);
            const isTop3 = rank <= 3;

            return (
              <div
                key={`${donor.name}-${i}`}
                data-ocid={`leaderboard.donor.item.${rank}`}
                className={`rounded-2xl px-5 py-4 flex items-center gap-4 transition-all ${isTop3 ? "animate-spring-in" : "animate-stagger-wave"}`}
                style={{
                  border: isTop3
                    ? `1px solid ${medal.border}`
                    : "1px solid oklch(var(--border))",
                  backgroundColor: isTop3 ? medal.bg : "oklch(var(--card))",
                  boxShadow: isTop3 ? medal.glow : "none",
                  animationDelay: isTop3
                    ? `${[0.3, 0.6, 0.1][i] ?? 0}s`
                    : `${i * 0.05}s`,
                }}
              >
                {/* Rank / Medal */}
                <div className="w-10 text-center flex-shrink-0">
                  {isTop3 ? (
                    <span style={medal.rankStyle}>{medal.label}</span>
                  ) : (
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      #{rank}
                    </span>
                  )}
                </div>

                {/* Avatar initials */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{
                    backgroundColor: isTop3
                      ? `${medal.text.replace(")", " / 0.18)")}`
                      : "oklch(var(--neon-red) / 0.12)",
                    color: isTop3 ? medal.text : "oklch(var(--neon-red))",
                    border: `1.5px solid ${isTop3 ? medal.border : "oklch(var(--neon-red) / 0.3)"}`,
                  }}
                >
                  {donor.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + City */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{donor.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {donor.city}
                  </div>
                </div>

                {/* Blood group badge */}
                <Badge
                  variant="outline"
                  className="text-xs font-black px-2 flex-shrink-0"
                  style={{
                    borderColor: "oklch(var(--neon-red) / 0.6)",
                    color: "oklch(var(--neon-red))",
                    backgroundColor: "oklch(var(--neon-red) / 0.1)",
                  }}
                >
                  {bg}
                </Badge>

                {/* Donation count */}
                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  <span
                    className="text-xl font-black tabular-nums"
                    style={{
                      color: isTop3 ? medal.text : "oklch(var(--foreground))",
                    }}
                  >
                    {Number(donor.totalDonations)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    donations
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
