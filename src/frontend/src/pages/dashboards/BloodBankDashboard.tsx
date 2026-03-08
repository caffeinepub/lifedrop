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
import {
  AlertTriangle,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { type CampAnnouncement, useApp } from "../../contexts/AppContext";

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

type StoredBloodBank = {
  bankName?: string;
  licenseNumber?: string;
  contactPerson?: string;
  address?: string;
  storageCapacity?: string;
  email?: string;
  phone?: string;
};

const campStatusColors = {
  upcoming: {
    label: "Upcoming",
    color: "oklch(0.65 0.18 240)",
    bg: "oklch(0.65 0.18 240 / 0.1)",
  },
  active: {
    label: "Active",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.1)",
  },
  completed: {
    label: "Completed",
    color: "oklch(0.6 0.1 20)",
    bg: "oklch(0.6 0.1 20 / 0.1)",
  },
};

export function BloodBankDashboard() {
  const { userProfile, camps, addCamp } = useApp();

  // Read blood bank-specific fields saved during registration
  const storedBloodBank = useMemo((): StoredBloodBank | null => {
    try {
      const raw = localStorage.getItem("lifedrop_profile_bloodBank");
      return raw ? (JSON.parse(raw) as StoredBloodBank) : null;
    } catch {
      return null;
    }
  }, []);

  const [units, setUnits] = useState<BloodUnit[]>(
    initialUnits.map((u) => ({ ...u, status: getStatus(u.expiryDate) })),
  );
  const [addForm, setAddForm] = useState({
    group: "",
    quantity: "",
    expiryDate: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Camp announcement form
  const [campForm, setCampForm] = useState({
    name: "",
    venue: "",
    date: "",
    time: "",
    expectedDonors: "",
    contact: "",
  });
  const [isPostingCamp, setIsPostingCamp] = useState(false);
  const [showCampForm, setShowCampForm] = useState(false);

  const bloodBankCamps = camps.filter((c) => c.postedBy === "Blood Bank");

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

  const handlePostCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingCamp(true);
    await new Promise((r) => setTimeout(r, 500));
    const today = new Date().toISOString().split("T")[0];
    const camp: CampAnnouncement = {
      id: `CAMP-BB-${String(Date.now()).slice(-6)}`,
      name: campForm.name,
      venue: campForm.venue,
      date: campForm.date,
      time: campForm.time,
      expectedDonors: Number.parseInt(campForm.expectedDonors) || 0,
      organizer: storedBloodBank?.bankName || userProfile?.name || "Blood Bank",
      contact: campForm.contact,
      postedBy: "Blood Bank",
      postedAt: new Date().toISOString(),
      status: campForm.date >= today ? "upcoming" : "completed",
    };
    addCamp(camp);
    setCampForm({
      name: "",
      venue: "",
      date: "",
      time: "",
      expectedDonors: "",
      contact: "",
    });
    setShowCampForm(false);
    setIsPostingCamp(false);
    toast.success("Camp announcement posted! Visible to all users.");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2">
        Blood Bank{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-2">
        Welcome,{" "}
        {storedBloodBank?.bankName || userProfile?.name || "Blood Bank"}
      </p>
      {/* Profile info strip */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm text-muted-foreground">
        {(storedBloodBank?.phone || userProfile?.phone) && (
          <span className="flex items-center gap-1.5">
            📞{" "}
            <span className="font-semibold text-foreground">
              {storedBloodBank?.phone || userProfile?.phone}
            </span>
          </span>
        )}
        {(storedBloodBank?.email || userProfile?.email) && (
          <span className="flex items-center gap-1.5">
            ✉️{" "}
            <span className="text-foreground">
              {storedBloodBank?.email || userProfile?.email}
            </span>
          </span>
        )}
        {storedBloodBank?.licenseNumber && (
          <span className="flex items-center gap-1.5">
            🪪{" "}
            <span className="font-mono text-foreground">
              {storedBloodBank.licenseNumber}
            </span>
          </span>
        )}
        {storedBloodBank?.storageCapacity && (
          <span className="flex items-center gap-1.5">
            🗄️ Capacity:{" "}
            <span className="font-semibold text-foreground">
              {Number(storedBloodBank.storageCapacity).toLocaleString()} ml
            </span>
          </span>
        )}
      </div>

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

      {/* Camp Announcements Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Megaphone
              className="h-4 w-4"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            Post Camp Announcement
          </h2>
          <Button
            size="sm"
            onClick={() => setShowCampForm(!showCampForm)}
            data-ocid="bloodbank.camp.open_modal_button"
            className="btn-glow"
            style={{
              backgroundColor: "oklch(var(--neon-red))",
              color: "white",
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Announcement
          </Button>
        </div>

        {showCampForm && (
          <form
            onSubmit={handlePostCamp}
            className="rounded-xl card-dark p-5 mb-6 space-y-4 animate-slide-in-up"
          >
            <h3 className="font-semibold text-sm">Donation Camp Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Camp Name *</Label>
                <Input
                  placeholder="Community Blood Drive"
                  value={campForm.name}
                  onChange={(e) =>
                    setCampForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_name.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Venue *</Label>
                <Input
                  placeholder="Town Hall, MG Road"
                  value={campForm.venue}
                  onChange={(e) =>
                    setCampForm((p) => ({ ...p, venue: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_venue.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={campForm.date}
                  onChange={(e) =>
                    setCampForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_date.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time *</Label>
                <Input
                  type="time"
                  value={campForm.time}
                  onChange={(e) =>
                    setCampForm((p) => ({ ...p, time: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_time.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Expected Donors *</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={campForm.expectedDonors}
                  onChange={(e) =>
                    setCampForm((p) => ({
                      ...p,
                      expectedDonors: e.target.value,
                    }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_donors.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contact *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={campForm.contact}
                  onChange={(e) =>
                    setCampForm((p) => ({ ...p, contact: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="bloodbank.camp_contact.input"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 btn-glow"
                disabled={isPostingCamp}
                data-ocid="bloodbank.camp.submit_button"
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
              >
                {isPostingCamp ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Announcement"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCampForm(false)}
                data-ocid="bloodbank.camp.cancel_button"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {bloodBankCamps.length === 0 ? (
          <div
            className="rounded-xl card-dark p-8 text-center"
            data-ocid="bloodbank.camps.empty_state"
          >
            <div className="text-3xl mb-2">📢</div>
            <p className="text-muted-foreground text-sm">
              No camp announcements yet. Post a camp to notify donors in your
              area.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloodBankCamps.map((camp, i) => {
              const sc = campStatusColors[camp.status];
              return (
                <div
                  key={camp.id}
                  className="rounded-xl card-dark p-5"
                  data-ocid={`bloodbank.camp.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-sm">{camp.name}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{
                        backgroundColor: sc.bg,
                        color: sc.color,
                        border: `1px solid ${sc.color.replace(")", " / 0.3)")}`,
                      }}
                    >
                      {sc.label}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{camp.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{camp.date}</span>
                      {camp.time && (
                        <>
                          <Clock className="h-3.5 w-3.5 flex-shrink-0 ml-1" />
                          <span>{camp.time}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{camp.expectedDonors} expected donors</span>
                    </div>
                    {camp.contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{camp.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
