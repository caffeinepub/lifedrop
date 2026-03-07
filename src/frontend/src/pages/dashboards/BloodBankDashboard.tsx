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
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../contexts/AppContext";

type BloodUnit = {
  id: string;
  group: string;
  quantity: number;
  expiryDate: string;
  status: "fresh" | "expiring" | "expired";
};

function getStatus(expiryDate: string): BloodUnit["status"] {
  const days =
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (days < 0) return "expired";
  if (days < 7) return "expiring";
  return "fresh";
}

const statusColors = {
  fresh: {
    label: "Fresh",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.1)",
  },
  expiring: {
    label: "Expiring Soon",
    color: "oklch(0.68 0.2 40)",
    bg: "oklch(0.68 0.2 40 / 0.1)",
  },
  expired: {
    label: "Expired",
    color: "oklch(0.62 0.26 25)",
    bg: "oklch(0.62 0.26 25 / 0.1)",
  },
};

const initialUnits: BloodUnit[] = [];

const bloodGroupOptions = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

export function BloodBankDashboard() {
  const { userProfile } = useApp();
  const [units, setUnits] = useState<BloodUnit[]>(
    initialUnits.map((u) => ({ ...u, status: getStatus(u.expiryDate) })),
  );
  const [addForm, setAddForm] = useState({
    group: "",
    quantity: "",
    expiryDate: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const expiringUnits = units.filter(
    (u) => u.status === "expiring" || u.status === "expired",
  );
  const totalFreshMl = units
    .filter((u) => u.status === "fresh")
    .reduce((sum, u) => sum + u.quantity, 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.group || !addForm.quantity || !addForm.expiryDate) {
      toast.error("Fill all fields");
      return;
    }
    setIsAdding(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUnit: BloodUnit = {
      id: `BB-${String(units.length + 1).padStart(3, "0")}`,
      group: addForm.group,
      quantity: Number.parseInt(addForm.quantity),
      expiryDate: addForm.expiryDate,
      status: getStatus(addForm.expiryDate),
    };
    setUnits((p) => [newUnit, ...p]);
    setAddForm({ group: "", quantity: "", expiryDate: "" });
    setIsAdding(false);
    toast.success("Blood unit added to inventory");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2">
        Blood Bank{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {userProfile?.name ?? "Blood Bank"}
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Units",
            value: units.length,
            color: "oklch(var(--neon-red))",
          },
          {
            label: "Fresh Stock (ml)",
            value: totalFreshMl.toLocaleString(),
            color: "oklch(0.65 0.2 140)",
          },
          {
            label: "Expiring Soon",
            value: units.filter((u) => u.status === "expiring").length,
            color: "oklch(0.68 0.2 40)",
          },
          {
            label: "Expired",
            value: units.filter((u) => u.status === "expired").length,
            color: "oklch(0.62 0.26 25)",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl card-dark p-4 text-center">
            <div
              className="font-display text-2xl font-black"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Expiry Alerts */}
      {expiringUnits.length > 0 && (
        <div
          className="rounded-xl p-4 mb-6 flex items-start gap-3"
          style={{
            backgroundColor: "oklch(0.68 0.2 40 / 0.08)",
            border: "1px solid oklch(0.68 0.2 40 / 0.25)",
          }}
          data-ocid="bloodbank.expiry.error_state"
        >
          <AlertTriangle
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.68 0.2 40)" }}
          />
          <div>
            <div
              className="font-semibold text-sm"
              style={{ color: "oklch(0.68 0.2 40)" }}
            >
              {expiringUnits.length} unit{expiringUnits.length > 1 ? "s" : ""}{" "}
              require attention
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {expiringUnits.map((u) => `${u.group} (${u.id})`).join(", ")}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Stock Form */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Plus
              className="h-4 w-4"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            Add Blood Stock
          </h2>
          <form
            onSubmit={handleAdd}
            className="rounded-xl card-dark p-5 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Blood Group *</Label>
              <Select
                value={addForm.group}
                onValueChange={(v) => setAddForm((p) => ({ ...p, group: v }))}
              >
                <SelectTrigger
                  data-ocid="bloodbank.add.bloodgroup.select"
                  className="bg-secondary border-border"
                >
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroupOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Quantity (ml) *</Label>
              <Input
                type="number"
                placeholder="450"
                value={addForm.quantity}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, quantity: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="bloodbank.add.quantity.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date *</Label>
              <Input
                type="date"
                value={addForm.expiryDate}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, expiryDate: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="bloodbank.add.expiry.input"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isAdding}
              data-ocid="bloodbank.add.submit_button"
              style={{
                backgroundColor: "oklch(var(--neon-red))",
                color: "white",
              }}
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to Inventory"
              )}
            </Button>
          </form>
        </div>

        {/* Inventory Table */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Blood Stock Inventory</h2>
          <div className="rounded-xl card-dark overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid oklch(var(--border))",
                      backgroundColor: "oklch(var(--secondary))",
                    }}
                  >
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Group
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Quantity (ml)
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Expiry
                    </th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  {units.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-muted-foreground text-sm"
                        data-ocid="bloodbank.inventory.empty_state"
                      >
                        No blood units added yet. Use the form on the left to
                        add stock.
                      </td>
                    </tr>
                  ) : (
                    units.map((unit, i) => {
                      const sc = statusColors[unit.status];
                      const daysLeft = Math.ceil(
                        (new Date(unit.expiryDate).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24),
                      );
                      return (
                        <tr
                          key={unit.id}
                          data-ocid={`bloodbank.inventory.row.${i + 1}`}
                          className="hover:bg-secondary/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {unit.id}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="font-display font-black"
                              style={{ color: "oklch(var(--neon-red))" }}
                            >
                              {unit.group}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono">
                            {unit.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <div>{unit.expiryDate}</div>
                            <div
                              style={{
                                color:
                                  daysLeft < 7
                                    ? sc.color
                                    : "oklch(var(--muted-foreground))",
                              }}
                            >
                              {daysLeft < 0
                                ? "Expired"
                                : `${daysLeft}d remaining`}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs px-2 py-1 rounded-full font-medium"
                              style={{
                                backgroundColor: sc.bg,
                                color: sc.color,
                              }}
                            >
                              {sc.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
