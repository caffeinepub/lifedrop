import { Button } from "@/components/ui/button";
import { Bell, BellOff, CheckCheck, Globe, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { NeuralPulseDecor } from "../components/NeuralPulseDecor";
import { useNotifications } from "../hooks/useNotifications";
import { useGlobalNotifications } from "../hooks/useQueries";

function timeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

const TYPE_DOT: Record<string, string> = {
  success: "oklch(0.65 0.2 140)",
  alert: "oklch(0.62 0.26 25)",
  info: "oklch(0.65 0.15 240)",
};

export function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, clearAll } =
    useNotifications();
  const { data: backendNotifs = [] } = useGlobalNotifications();

  // Map backend notifications to local shape, mark as global
  const globalNotifs = useMemo(
    () =>
      backendNotifs.map((n) => ({
        id: `global-${n.id.toString()}`,
        message: n.message,
        timestamp: Number(n.timestamp) / 1_000_000,
        read: false,
        type: "alert" as const,
        isGlobal: true,
      })),
    [backendNotifs],
  );

  // Merge: global always at top, then local, deduplicated by id
  const merged = useMemo(() => {
    const localWithFlag = notifications.map((n) => ({ ...n, isGlobal: false }));
    const all = [...globalNotifs, ...localWithFlag];
    const seen = new Set<string>();
    return all.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }, [globalNotifs, notifications]);

  const totalUnread = unreadCount + globalNotifs.length;

  return (
    <>
      <main className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Bell
                className="h-6 w-6 animate-heartbeat"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              <h1 className="font-display text-3xl font-black">
                Notifications
              </h1>
              {totalUnread > 0 && (
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                  data-ocid="notifications.unread.toggle"
                >
                  {totalUnread}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              Your activity and global alerts from LIFEDROP
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllRead}
                className="gap-1.5 border-border"
                data-ocid="notifications.markallread.button"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark All Read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="gap-1.5"
                style={{
                  borderColor: "oklch(var(--neon-red) / 0.5)",
                  color: "oklch(var(--neon-red))",
                }}
                data-ocid="notifications.clearall.delete_button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Local
              </Button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {merged.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center"
            data-ocid="notifications.list.empty_state"
            style={{
              border: "1px dashed oklch(var(--border))",
              backgroundColor: "oklch(var(--card))",
            }}
          >
            <BellOff
              className="h-10 w-10 mx-auto mb-4"
              style={{ color: "oklch(var(--muted-foreground))" }}
            />
            <h3 className="font-semibold text-lg mb-1">No notifications yet</h3>
            <p className="text-muted-foreground text-sm">
              Blood request updates and activity alerts will appear here.
            </p>
          </div>
        )}

        {/* Notification list */}
        {merged.length > 0 && (
          <div className="space-y-2">
            {merged.map((n, i) => (
              <div
                key={n.id}
                data-ocid={`notifications.item.${i + 1}`}
                className="rounded-xl px-4 py-3 flex items-start gap-3 transition-all animate-live-item"
                style={{
                  border: n.read
                    ? "1px solid oklch(var(--border))"
                    : "1px solid oklch(var(--neon-red) / 0.3)",
                  backgroundColor: n.isGlobal
                    ? "oklch(var(--neon-red) / 0.07)"
                    : n.read
                      ? "oklch(var(--card))"
                      : "oklch(var(--neon-red) / 0.05)",
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                {/* Type dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: TYPE_DOT[n.type] ?? TYPE_DOT.info }}
                />
                {/* Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    {n.isGlobal && (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          backgroundColor: "oklch(var(--neon-red) / 0.15)",
                          color: "oklch(var(--neon-red))",
                          border: "1px solid oklch(var(--neon-red) / 0.3)",
                        }}
                      >
                        <Globe className="h-3 w-3" />📢 For Everyone
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm"
                    style={{
                      color: n.read
                        ? "oklch(var(--muted-foreground))"
                        : "oklch(var(--foreground))",
                      fontWeight: n.read ? 400 : 600,
                    }}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {timeAgo(n.timestamp)}
                  </p>
                </div>
                {/* Unread dot */}
                {!n.read && (
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: "oklch(var(--neon-red))" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <NeuralPulseDecor />
    </>
  );
}
