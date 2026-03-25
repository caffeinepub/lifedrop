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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  useAdminDeleteUser,
  useAllUsersForManagement,
} from "../hooks/useQueries";

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

export function UserManagementSection() {
  const { data: users = [], isLoading } = useAllUsersForManagement();
  const deleteUser = useAdminDeleteUser();

  const handleDelete = async (principalText: string, name: string) => {
    try {
      await deleteUser.mutateAsync(principalText);
      toast.success(`${name}'s account has been deleted.`);
    } catch {
      toast.error("Failed to delete account. Please try again.");
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
            Delete any user account from the platform
          </p>
        </div>
      </div>

      {isLoading ? (
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
      ) : users.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground text-sm"
          data-ocid="user_management.empty_state"
        >
          No users found.
        </div>
      ) : (
        <div className="space-y-2" data-ocid="user_management.list">
          {users.map((user: any, idx: number) => {
            const principalText =
              typeof user.id === "object" && "toText" in user.id
                ? user.id.toText()
                : String(user.id);
            return (
              <div
                key={principalText}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "oklch(0.15 0.005 20 / 0.6)",
                  border: "1px solid oklch(var(--border) / 0.4)",
                }}
                data-ocid={`user_management.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user.name}
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
                      data-ocid={`user_management.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
                        Are you sure you want to delete{" "}
                        <strong>{user.name}</strong>&apos;s account? This action
                        cannot be undone and will permanently remove all their
                        data.
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
                        {deleteUser.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : null}
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
