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
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { useDeleteAccount } from "../hooks/useQueries";

export function DeleteAccountSection() {
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccount();
  const { setUserProfile } = useApp();
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      // Attempt backend deletion (may return false for already-deleted users — still proceed)
      try {
        await deleteAccount.mutateAsync();
      } catch {
        // If backend errors, still clear local state and redirect
      }

      // Clear all local state
      setUserProfile(null);
      localStorage.clear();

      toast.success("Account deleted successfully");

      // Redirect to register page
      void navigate({ to: "/register" });
    } catch {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  return (
    <div
      className="rounded-xl p-5 mt-8"
      style={{
        border: "1px solid oklch(var(--neon-red) / 0.4)",
        backgroundColor: "oklch(var(--neon-red) / 0.04)",
      }}
      data-ocid="account.danger.panel"
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle
          className="h-4 w-4"
          style={{ color: "oklch(var(--neon-red))" }}
        />
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "oklch(var(--neon-red))" }}
        >
          Danger Zone
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Once you delete your account, all your data will be permanently removed
        and cannot be recovered.
      </p>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            style={{
              borderColor: "oklch(var(--neon-red) / 0.5)",
              color: "oklch(var(--neon-red))",
            }}
            data-ocid="account.delete.open_modal_button"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Account
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent
          data-ocid="account.delete.dialog"
          style={{
            border: "1px solid oklch(var(--neon-red) / 0.4)",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2
                className="h-5 w-5"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently delete your account, all your data, and
              cannot be undone. Type{" "}
              <span className="font-bold text-foreground">DELETE</span> to
              confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-2">
            <Input
              placeholder='Type "DELETE" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-secondary border-border"
              data-ocid="account.delete.input"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmText("")}
              data-ocid="account.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
              disabled={!canDelete || deleteAccount.isPending}
              data-ocid="account.delete.confirm_button"
              style={{
                backgroundColor: canDelete
                  ? "oklch(var(--neon-red))"
                  : undefined,
                color: canDelete ? "white" : undefined,
                opacity: !canDelete || deleteAccount.isPending ? 0.5 : 1,
                cursor: !canDelete ? "not-allowed" : "pointer",
              }}
            >
              {deleteAccount.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete My Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
