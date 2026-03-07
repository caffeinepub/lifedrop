import { ScrollArea } from "@/components/ui/scroll-area";
import { Droplets, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type RegisteredUserEntry,
  getRegisteredUsers,
} from "../contexts/AppContext";

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

function formatRelativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "";
  }
}

export function RegisteredUsersSidebar() {
  const [users, setUsers] = useState<RegisteredUserEntry[]>(() =>
    getRegisteredUsers(),
  );

  // Refresh when a new user registers (custom event)
  useEffect(() => {
    const handler = () => setUsers(getRegisteredUsers());
    window.addEventListener("lifedrop_user_registered", handler);
    return () =>
      window.removeEventListener("lifedrop_user_registered", handler);
  }, []);

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
              {users.length} {users.length === 1 ? "user" : "users"}
            </p>
          </div>
        </div>
        {users.length > 0 && (
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
        )}
      </div>

      {/* Scrollable list */}
      <ScrollArea className="flex-1 px-3 py-3" data-ocid="sidebar.list">
        {users.length === 0 ? (
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
              const rc = getRoleConfig(user.role);
              const ocidIndex = idx + 1;
              return (
                <div
                  key={`${user.name}-${user.registeredAt}`}
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
                      {user.bloodGroup && (
                        <div
                          className="mt-1 text-xs font-mono font-bold inline-block px-1.5 py-px rounded"
                          style={{
                            backgroundColor: "oklch(var(--neon-red) / 0.12)",
                            color: "oklch(var(--neon-red))",
                          }}
                        >
                          {user.bloodGroup}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground/50 mt-1">
                        {formatRelativeTime(user.registeredAt)}
                      </div>
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
        Session registrations
      </div>
    </aside>
  );
}
