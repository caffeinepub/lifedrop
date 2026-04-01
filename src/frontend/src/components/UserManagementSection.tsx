import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDeviceActor } from "../hooks/useDeviceActor";

function normalizeRoleLabel(role: unknown): string {
  if (typeof role === "string") return role;
  if (role && typeof role === "object") {
    const key = Object.keys(role as object)[0] ?? "unknown";
    const labels: Record<string, string> = {
      donor: "Donor",
      patient: "Patient",
      hospital: "Hospital",
      bloodBank: "Blood Bank",
      ngo: "NGO",
      volunteer: "Volunteer",
      admin: "Admin",
      guest: "Guest",
    };
    return labels[key] ?? key;
  }
  return "Unknown";
}

function roleColor(role: unknown): string {
  const key =
    typeof role === "string"
      ? role
      : role && typeof role === "object"
        ? (Object.keys(role as object)[0] ?? "")
        : "";
  const map: Record<string, string> = {
    donor: "bg-red-900/40 text-red-300 border-red-700/40",
    patient: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    hospital: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    bloodBank: "bg-purple-900/40 text-purple-300 border-purple-700/40",
    ngo: "bg-yellow-900/40 text-yellow-300 border-yellow-700/40",
    volunteer: "bg-cyan-900/40 text-cyan-300 border-cyan-700/40",
    admin: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  };
  return map[key] ?? "bg-gray-900/40 text-gray-300 border-gray-700/40";
}

function getPrincipalText(id: unknown): string {
  if (id == null) return "";
  if (typeof id === "object" && id !== null) {
    if ("toText" in id && typeof (id as any).toText === "function") {
      try {
        return (id as any).toText();
      } catch {
        /* fall through */
      }
    }
  }
  const s = String(id);
  return s === "null" || s === "undefined" ? "" : s;
}

export function UserManagementSection() {
  const { actor } = useDeviceActor();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await (actor as any).getAllUsersForManagement();
      setUsers(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor) {
      fetchUsers();
    }
  }, [actor, fetchUsers]);

  const handleDelete = async (principalText: string, name: string) => {
    if (!actor || !principalText) {
      toast.error("Cannot delete: user ID not available");
      return;
    }
    setDeleting(principalText);
    try {
      const { Principal } = await import("@dfinity/principal");
      const result = await (actor as any).adminDeleteUser(
        Principal.fromText(principalText),
      );
      if (result) {
        toast.success(`${name}'s account has been deleted.`);
        setUsers((prev) =>
          prev.filter((u) => getPrincipalText(u.id) !== principalText),
        );
      } else {
        toast.error(
          "Delete failed — you may not have permission for this action.",
        );
      }
    } catch (err: any) {
      toast.error(
        err?.message || "Failed to delete account. Please try again.",
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 mb-6"
      style={{
        background: "oklch(0.12 0.008 20 / 0.9)",
        border: "1px solid oklch(var(--neon-red) / 0.25)",
        boxShadow: "0 0 24px oklch(var(--neon-red) / 0.06)",
      }}
      data-ocid="user_management.section"
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "oklch(var(--neon-red) / 0.15)" }}
        >
          <Users
            className="w-5 h-5"
            style={{ color: "oklch(var(--neon-red))" }}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">User Management</h3>
          <p className="text-xs text-muted-foreground">
            View and delete registered user accounts
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!loading && users.length > 0 && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: "oklch(var(--neon-red) / 0.15)",
                color: "oklch(var(--neon-red))",
                border: "1px solid oklch(var(--neon-red) / 0.3)",
              }}
            >
              {users.length} users
            </span>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchUsers}
            disabled={loading || !actor}
            className="gap-1.5 text-xs"
            data-ocid="user_management.refresh_button"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div
          className="flex items-center justify-center py-10 gap-3"
          data-ocid="user_management.loading_state"
        >
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          <span className="text-sm text-muted-foreground">Loading users…</span>
        </div>
      ) : !actor ? (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="user_management.no_actor_state"
        >
          Connecting to backend…
        </div>
      ) : users.length === 0 ? (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="user_management.empty_state"
        >
          No registered users found.{" "}
          <button
            type="button"
            onClick={fetchUsers}
            className="underline"
            style={{ color: "oklch(var(--neon-red))" }}
          >
            Click here to reload
          </button>
        </div>
      ) : (
        <div className="space-y-2" data-ocid="user_management.list">
          {users.map((user: any, idx: number) => {
            const principalText = getPrincipalText(user.id);
            const isDeleting = deleting === principalText;
            return (
              <div
                key={principalText || `user-${idx}`}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "oklch(0.15 0.005 20 / 0.6)",
                  border: "1px solid oklch(var(--border) / 0.4)",
                  opacity: isDeleting ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
                data-ocid={`user_management.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name || "Unnamed User"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor(user.role)}`}
                    >
                      {normalizeRoleLabel(user.role)}
                    </span>
                    {user.city && (
                      <span className="text-xs text-muted-foreground">
                        {user.city}
                      </span>
                    )}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5 text-xs"
                      disabled={isDeleting || !principalText}
                      data-ocid={`user_management.delete_button.${idx + 1}`}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    style={{
                      background: "oklch(0.12 0.008 20)",
                      border: "1px solid oklch(var(--neon-red) / 0.3)",
                    }}
                    data-ocid="user_management.dialog"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        Delete {user.name}&apos;s Account
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete{" "}
                        <strong>{user.name}</strong>&apos;s account? This cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="user_management.cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(principalText, user.name)}
                        className="bg-red-600 hover:bg-red-700"
                        data-ocid="user_management.confirm_button"
                      >
                        Yes, Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
