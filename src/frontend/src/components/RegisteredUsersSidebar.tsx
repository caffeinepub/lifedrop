import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { Droplets, Loader2, Users } from "lucide-react";
import { useEffect } from "react";
import { usePublicUserList } from "../hooks/useQueries";

const roleConfig: Record<
  string,
  { label: string; color: string; bg: string; emoji: string }
> = {
  donor: {
    label: "Donor",
    color: "oklch(0.65 0.24 25)",
    bg: "oklch(0.65 0.24 25 / 0.12)",
    emoji: "🩸",
  },
  patient: {
    label: "Patient",
    color: "oklch(0.60 0.18 260)",
    bg: "oklch(0.60 0.18 260 / 0.12)",
    emoji: "🏥",
  },
  hospital: {
    label: "Hospital",
    color: "oklch(0.65 0.20 140)",
    bg: "oklch(0.65 0.20 140 / 0.12)",
    emoji: "🏨",
  },
  bloodBank: {
    label: "Blood Bank",
    color: "oklch(0.65 0.18 300)",
    bg: "oklch(0.65 0.18 300 / 0.12)",
    emoji: "🧪",
  },
  ngo: {
    label: "NGO",
    color: "oklch(0.68 0.18 60)",
    bg: "oklch(0.68 0.18 60 / 0.12)",
    emoji: "🤝",
  },
  volunteer: {
    label: "Volunteer",
    color: "oklch(0.65 0.18 180)",
    bg: "oklch(0.65 0.18 180 / 0.12)",
    emoji: "🙌",
  },
  admin: {
    label: "Admin",
    color: "oklch(0.55 0.01 20)",
    bg: "oklch(0.55 0.01 20 / 0.12)",
    emoji: "⚙️",
  },
};

function getRoleConfig(role: string) {
  return (
    roleConfig[role] ?? {
      label: role,
      color: "oklch(0.55 0.01 20)",
      bg: "oklch(0.55 0.01 20 / 0.1)",
      emoji: "👤",
    }
  );
}

// Map backend blood group enum values to display labels
const bloodGroupLabels: Record<string, string> = {
  A_Positive: "A+",
  A_Negative: "A−",
  B_Positive: "B+",
  B_Negative: "B−",
  AB_Positive: "AB+",
  AB_Negative: "AB−",
  O_Positive: "O+",
  O_Negative: "O−",
};

function normalizeBloodGroup(bg: unknown): string | undefined {
  if (!bg) return undefined;
  const key =
    typeof bg === "string"
      ? bg
      : bg && typeof bg === "object"
        ? (Object.keys(bg)[0] ?? "")
        : "";
  return bloodGroupLabels[key] ?? (key || undefined);
}

function normalizeRole(role: unknown): string {
  if (typeof role === "string") return role;
  if (role && typeof role === "object")
    return Object.keys(role)[0] ?? "unknown";
  return "unknown";
}

export function RegisteredUsersSidebar() {
  const { data: users = [], isLoading } = usePublicUserList();
  const queryClient = useQueryClient();

  // Refresh when a new user registers (custom event)
  useEffect(() => {
    const handler = () => {
      void queryClient.invalidateQueries({ queryKey: ["publicUserList"] });
      void queryClient.invalidateQueries({ queryKey: ["totalUsers"] });
    };
    window.addEventListener("lifedrop_user_registered", handler);
    return () =>
      window.removeEventListener("lifedrop_user_registered", handler);
  }, [queryClient]);

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.10 0.005 20) 0%, oklch(0.085 0 0) 100%)",
        borderLeft: "1px solid oklch(var(--neon-red) / 0.15)",
      }}
      data-ocid="sidebar.panel"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: "oklch(var(--neon-red) / 0.12)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
          >
            <Users
              className="h-3.5 w-3.5"
              style={{ color: "oklch(var(--neon-red))" }}
            />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Registered
            </h3>
            <p className="text-xs" style={{ color: "oklch(var(--neon-red))" }}>
              {isLoading
                ? "..."
                : `${users.length} ${users.length === 1 ? "user" : "users"}`}
            </p>
          </div>
        </div>
        {isLoading ? (
          <Loader2
            className="h-3.5 w-3.5 animate-spin"
            style={{ color: "oklch(var(--neon-red) / 0.6)" }}
          />
        ) : users.length > 0 ? (
          <div
            className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: "oklch(var(--neon-red) / 0.1)",
              color: "oklch(var(--neon-red))",
              border: "1px solid oklch(var(--neon-red) / 0.2)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "oklch(var(--neon-red))" }}
            />
            Live
          </div>
        ) : null}
      </div>

      {/* Scrollable list */}
      <ScrollArea className="flex-1 px-3 py-3" data-ocid="sidebar.list">
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-10 gap-3"
            data-ocid="sidebar.loading_state"
          >
            <Loader2
              className="h-6 w-6 animate-spin"
              style={{ color: "oklch(var(--neon-red) / 0.5)" }}
            />
            <p className="text-xs text-muted-foreground/60 text-center">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 gap-3"
            data-ocid="sidebar.empty_state"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(var(--neon-red) / 0.08)" }}
            >
              <Droplets
                className="h-5 w-5 opacity-40"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">
                No users yet
              </p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">
                Register to appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user, idx) => {
              const roleStr = normalizeRole(user.role);
              const rc = getRoleConfig(roleStr);
              const displayBloodGroup = normalizeBloodGroup(user.bloodGroup);
              const ocidIndex = idx + 1;
              return (
                <div
                  key={`${user.name}-${roleStr}-${idx}`}
                  className="group rounded-lg p-3 transition-all hover:scale-[1.01]"
                  style={{
                    background: "oklch(0.13 0.005 20 / 0.8)",
                    border: "1px solid oklch(var(--border) / 0.5)",
                  }}
                  data-ocid={`sidebar.item.${ocidIndex}`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Avatar circle */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold"
                      style={{
                        background: rc.bg,
                        color: rc.color,
                        border: `1px solid ${rc.color}30`,
                      }}
                    >
                      {rc.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {user.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs px-1.5 py-px rounded font-medium"
                          style={{
                            backgroundColor: rc.bg,
                            color: rc.color,
                          }}
                        >
                          {rc.label}
                        </span>
                        {user.city && (
                          <span className="text-xs text-muted-foreground truncate">
                            {user.city}
                          </span>
                        )}
                      </div>
                      {displayBloodGroup && (
                        <div
                          className="mt-1 text-xs font-mono font-bold inline-block px-1.5 py-px rounded"
                          style={{
                            backgroundColor: "oklch(var(--neon-red) / 0.12)",
                            color: "oklch(var(--neon-red))",
                          }}
                        >
                          {displayBloodGroup}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer note */}
      <div
        className="px-4 py-3 border-t text-xs text-muted-foreground/50 text-center"
        style={{ borderColor: "oklch(var(--neon-red) / 0.08)" }}
      >
        Live from blockchain
      </div>
    </aside>
  );
}
