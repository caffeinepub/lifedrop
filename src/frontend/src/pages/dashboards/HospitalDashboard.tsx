import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, CheckCircle, Clock, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../contexts/AppContext";

type BloodInventory = {
  group: string;
  quantity: number;
  status: "critical" | "low" | "normal" | "good";
};

const initialInventory: BloodInventory[] = [
  { group: "A+", quantity: 1200, status: "good" },
  { group: "A−", quantity: 300, status: "low" },
  { group: "B+", quantity: 800, status: "normal" },
  { group: "B−", quantity: 150, status: "critical" },
  { group: "AB+", quantity: 550, status: "normal" },
  { group: "AB−", quantity: 200, status: "low" },
  { group: "O+", quantity: 2000, status: "good" },
  { group: "O−", quantity: 400, status: "low" },
];

const statusConfig = {
  critical: {
    label: "Critical",
    color: "oklch(0.62 0.26 25)",
    bg: "oklch(0.62 0.26 25 / 0.12)",
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

export function HospitalDashboard() {
  const { userProfile } = useApp();
  const [inventory, setInventory] =
    useState<BloodInventory[]>(initialInventory);
  const [adjustAmount, setAdjustAmount] = useState<Record<string, string>>({});

  const handleAdjust = (group: string, delta: number) => {
    const amount = Number.parseInt(adjustAmount[group] ?? "100") || 100;
    setInventory((prev) =>
      prev.map((item) => {
        if (item.group === group) {
          const newQty = Math.max(0, item.quantity + delta * amount);
          const status: BloodInventory["status"] =
            newQty < 200
              ? "critical"
              : newQty < 500
                ? "low"
                : newQty < 1000
                  ? "normal"
                  : "good";
          return { ...item, quantity: newQty, status };
        }
        return item;
      }),
    );
    toast.success(`${group} inventory updated`);
  };

  const isApproved = true; // Would come from hospital profile

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2">
        Hospital{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Manage inventory and donation records
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl card-dark p-5">
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
                  {userProfile?.name ?? "Hospital Name"}
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
                <span className="text-muted-foreground">License No.</span>
                <span className="font-mono text-xs">LIC-2024-CH-4521</span>
              </div>
              <div
                className="flex justify-between py-2 border-b"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                <span className="text-muted-foreground">Total Donations</span>
                <span className="font-semibold">1,240</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-semibold">84</span>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Critical",
                value: inventory.filter((i) => i.status === "critical").length,
                color: "oklch(0.62 0.26 25)",
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
        </div>

        {/* Blood Inventory Table */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold mb-4">Blood Inventory Management</h2>
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
                            style={{ backgroundColor: sc.bg, color: sc.color }}
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
          </div>

          {/* Appointments placeholder */}
          <div className="mt-6 rounded-xl card-dark p-5">
            <h3 className="font-semibold mb-4">Upcoming Donor Appointments</h3>
            <div className="space-y-2" data-ocid="hospital.appointments.list">
              {[
                {
                  donor: "Ankit Sharma",
                  group: "O+",
                  date: "March 12, 2026",
                  time: "9:00 AM",
                },
                {
                  donor: "Kavitha Reddy",
                  group: "A+",
                  date: "March 14, 2026",
                  time: "11:30 AM",
                },
                {
                  donor: "Mohammed Rizwan",
                  group: "B+",
                  date: "March 16, 2026",
                  time: "3:00 PM",
                },
              ].map((appt, i) => (
                <div
                  key={appt.donor}
                  data-ocid={`hospital.appointment.item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: "oklch(var(--secondary))" }}
                >
                  <div>
                    <div className="text-sm font-medium">{appt.donor}</div>
                    <div className="text-xs text-muted-foreground">
                      {appt.date} · {appt.time}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: "oklch(var(--neon-red) / 0.4)",
                      color: "oklch(var(--neon-red))",
                    }}
                  >
                    {appt.group}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
