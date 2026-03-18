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
import { Building2, CheckCircle, Clock, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DeleteAccountSection } from "../../components/DeleteAccountSection";
import { useApp } from "../../contexts/AppContext";

type BloodInventory = {
  group: string;
  quantity: number;
  status: "critical" | "low" | "normal" | "good";
};

const ALL_BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

const statusConfig = {
  critical: {
    label: "Critical",
    color: "oklch(0.65 0.28 22)",
    bg: "oklch(0.65 0.28 22 / 0.12)",
  },
  low: {
    label: "Low",
    color: "oklch(0.68 0.2 40)",
    bg: "oklch(0.68 0.2 40 / 0.1)",
  },
  normal: {
    label: "Normal",
    color: "oklch(0.75 0.18 70)",
    bg: "oklch(0.75 0.18 70 / 0.1)",
  },
  good: {
    label: "Good",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.1)",
  },
};

function getStatus(qty: number): BloodInventory["status"] {
  if (qty < 200) return "critical";
  if (qty < 500) return "low";
  if (qty < 1000) return "normal";
  return "good";
}

type StoredHospital = {
  hospitalName?: string;
  licenseNumber?: string;
  contactPerson?: string;
  address?: string;
  email?: string;
  phone?: string;
};

export function HospitalDashboard() {
  const { userProfile } = useApp();

  // Read hospital-specific fields saved during registration
  const storedHospital = useMemo((): StoredHospital | null => {
    try {
      const raw = localStorage.getItem("lifedrop_profile_hospital");
      return raw ? (JSON.parse(raw) as StoredHospital) : null;
    } catch {
      return null;
    }
  }, []);

  const [inventory, setInventory] = useState<BloodInventory[]>([]);
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({});

  // Add stock form
  const [addGroup, setAddGroup] = useState("");
  const [addQty, setAddQty] = useState("");

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addGroup || !addQty || Number(addQty) <= 0) {
      toast.error("Please select a blood group and enter a valid quantity");
      return;
    }
    const qty = Number(addQty);
    setInventory((prev) => {
      const existing = prev.find((i) => i.group === addGroup);
      if (existing) {
        return prev.map((item) =>
          item.group === addGroup
            ? {
                ...item,
                quantity: item.quantity + qty,
                status: getStatus(item.quantity + qty),
              }
            : item,
        );
      }
      return [
        ...prev,
        { group: addGroup, quantity: qty, status: getStatus(qty) },
      ];
    });
    toast.success(`Added ${qty} ml of ${addGroup} blood`);
    setAddGroup("");
    setAddQty("");
  };

  const handleAdjust = (group: string, delta: number) => {
    const amount = Number.parseInt(adjustAmount[group] ?? "100") || 100;
    setInventory((prev) =>
      prev.map((item) => {
        if (item.group === group) {
          const newQty = Math.max(0, item.quantity + delta * amount);
          return { ...item, quantity: newQty, status: getStatus(newQty) };
        }
        return item;
      }),
    );
    toast.success(`${group} inventory updated`);
  };

  const isApproved = true;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2 animate-cinema-enter">
        Hospital{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Manage inventory and donation records
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl card-glow p-5">
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
              >
                <Building2
                  className="h-6 w-6"
                  style={{ color: "oklch(var(--neon-red))" }}
                />
              </div>
              <div>
                <h2 className="font-semibold">
                  {storedHospital?.hospitalName ||
                    userProfile?.name ||
                    "Hospital Name"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.city ?? "City"}
                </p>
                <div className="mt-1.5">
                  {isApproved ? (
                    <div
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "oklch(0.65 0.2 140 / 0.12)",
                        color: "oklch(0.65 0.2 140)",
                        border: "1px solid oklch(0.65 0.2 140 / 0.3)",
                      }}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Verified Hospital
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "oklch(0.75 0.18 70 / 0.1)",
                        color: "oklch(0.75 0.18 70)",
                        border: "1px solid oklch(0.75 0.18 70 / 0.3)",
                      }}
                    >
                      <Clock className="h-3 w-3" />
                      Pending Approval
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div
                className="flex justify-between py-2 border-b"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                <span className="text-muted-foreground">City</span>
                <span className="font-mono text-xs">
                  {userProfile?.city ?? "—"}
                </span>
              </div>
              {storedHospital?.licenseNumber && (
                <div
                  className="flex justify-between py-2 border-b"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  <span className="text-muted-foreground">License</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {storedHospital.licenseNumber}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between py-2 border-b"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                <span className="text-muted-foreground">Phone</span>
                <span className="font-semibold text-xs truncate max-w-[120px]">
                  {storedHospital?.phone || userProfile?.phone || "—"}
                </span>
              </div>
              <div
                className="flex justify-between py-2 border-b"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                <span className="text-muted-foreground">Email</span>
                <span className="text-xs truncate max-w-[120px]">
                  {storedHospital?.email || userProfile?.email || "—"}
                </span>
              </div>
              {storedHospital?.address && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-xs text-right max-w-[140px] leading-tight">
                    {storedHospital.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Critical",
                value: inventory.filter((i) => i.status === "critical").length,
                color: "oklch(0.65 0.28 22)",
              },
              {
                label: "Low Stock",
                value: inventory.filter((i) => i.status === "low").length,
                color: "oklch(0.68 0.2 40)",
              },
              {
                label: "Normal",
                value: inventory.filter((i) => i.status === "normal").length,
                color: "oklch(0.75 0.18 70)",
              },
              {
                label: "Good",
                value: inventory.filter((i) => i.status === "good").length,
                color: "oklch(0.65 0.2 140)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg p-3 text-center"
                style={{
                  backgroundColor: s.color.replace(")", " / 0.08)"),
                  border: `1px solid ${s.color.replace(")", " / 0.2)")}`,
                }}
              >
                <div
                  className="font-display text-2xl font-black"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Add Blood Stock Form */}
          <div className="rounded-xl card-glow p-5">
            <h3 className="font-semibold mb-3 text-sm">Add Blood Stock</h3>
            <form onSubmit={handleAddStock} className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Blood Group
                </Label>
                <Select value={addGroup} onValueChange={setAddGroup}>
                  <SelectTrigger
                    className="bg-secondary border-border h-8 text-sm"
                    data-ocid="hospital.add_stock.select"
                  >
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_BLOOD_GROUPS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Quantity (ml)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 450"
                  min="1"
                  value={addQty}
                  onChange={(e) => setAddQty(e.target.value)}
                  className="bg-secondary border-border h-8 text-sm"
                  data-ocid="hospital.add_stock.input"
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="w-full font-semibold"
                data-ocid="hospital.add_stock.submit_button"
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Stock
              </Button>
            </form>
          </div>
        </div>

        {/* Blood Inventory Table */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Blood Inventory Management</h2>
          <div className="rounded-xl card-glow overflow-hidden">
            {inventory.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="hospital.inventory.empty_state"
              >
                <div className="text-4xl mb-3">🩸</div>
                <h3 className="font-semibold text-base mb-1">
                  No blood stock added yet
                </h3>
                <p className="text-sm">
                  Use the "Add Blood Stock" form to record your blood inventory.
                  <br />
                  All quantities start at 0 — only real data is shown here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid oklch(var(--border))",
                        backgroundColor: "oklch(var(--secondary))",
                      }}
                    >
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Group
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Quantity (ml)
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        Adjust
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: "oklch(var(--border))" }}
                  >
                    {inventory.map((item, i) => {
                      const sc = statusConfig[item.status];
                      return (
                        <tr
                          key={item.group}
                          data-ocid={`hospital.inventory.row.${i + 1}`}
                          className="hover:bg-secondary/50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span
                              className="font-display font-black text-base"
                              style={{ color: "oklch(var(--neon-red))" }}
                            >
                              {item.group}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold">
                            {item.quantity.toLocaleString()}
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
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="ml"
                                value={adjustAmount[item.group] ?? ""}
                                onChange={(e) =>
                                  setAdjustAmount((p) => ({
                                    ...p,
                                    [item.group]: e.target.value,
                                  }))
                                }
                                className="w-20 h-7 text-xs bg-secondary border-border"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => handleAdjust(item.group, 1)}
                                data-ocid={`hospital.inventory.add.button.${i + 1}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0"
                                onClick={() => handleAdjust(item.group, -1)}
                                data-ocid={`hospital.inventory.subtract.button.${i + 1}`}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="mt-6 rounded-xl card-glow p-5">
            <h3 className="font-semibold mb-4">Upcoming Donor Appointments</h3>
            <div
              className="text-center py-6 text-muted-foreground"
              data-ocid="hospital.appointments.empty_state"
            >
              <div className="text-3xl mb-2">🗓️</div>
              <p className="text-sm">No donor appointments scheduled yet.</p>
            </div>
          </div>
        </div>
      </div>
      <DeleteAccountSection />
    </main>
  );
}
