import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup, UrgencyLevel } from "../../backend.d";
import { useApp } from "../../contexts/AppContext";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useBloodRequests,
  useCompleteBloodRequest,
  useCreateBloodRequest,
} from "../../hooks/useQueries";

const bloodGroupOptions = [
  { value: BloodGroup.A_Positive, label: "A+" },
  { value: BloodGroup.A_Negative, label: "A−" },
  { value: BloodGroup.B_Positive, label: "B+" },
  { value: BloodGroup.B_Negative, label: "B−" },
  { value: BloodGroup.AB_Positive, label: "AB+" },
  { value: BloodGroup.AB_Negative, label: "AB−" },
  { value: BloodGroup.O_Positive, label: "O+" },
  { value: BloodGroup.O_Negative, label: "O−" },
];

const bloodGroupLabel: Record<string, string> = {
  A_Positive: "A+",
  A_Negative: "A−",
  B_Positive: "B+",
  B_Negative: "B−",
  AB_Positive: "AB+",
  AB_Negative: "AB−",
  O_Positive: "O+",
  O_Negative: "O−",
};

const statusConfig = {
  pending: {
    label: "Pending",
    color: "oklch(0.75 0.18 70)",
    bg: "oklch(0.75 0.18 70 / 0.1)",
    icon: <Clock className="h-3 w-3" />,
  },
  accepted: {
    label: "Accepted",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.1)",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    color: "oklch(0.65 0.18 240)",
    bg: "oklch(0.65 0.18 240 / 0.1)",
    icon: <CheckCircle className="h-3 w-3" />,
  },
};

export function PatientDashboard() {
  const { userProfile } = useApp();
  const { identity } = useInternetIdentity();
  const { data: allRequests, isLoading } = useBloodRequests();
  const createRequest = useCreateBloodRequest();
  const completeRequest = useCompleteBloodRequest();

  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "" as BloodGroup | "",
    quantityMl: "450",
    hospitalName: "",
    city: "",
    urgency: "" as UrgencyLevel | "",
    contact: "",
  });

  // Filter requests for this user (only show requests by principal)
  const myRequests = (allRequests ?? []).filter(
    (r) =>
      identity &&
      r.requesterId.toString() === identity.getPrincipal().toString(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bloodGroup || !form.urgency) {
      toast.error("Fill all required fields");
      return;
    }
    try {
      await createRequest.mutateAsync({
        patientName: form.patientName,
        bloodGroup: form.bloodGroup as BloodGroup,
        quantityMl: BigInt(form.quantityMl),
        hospitalName: form.hospitalName,
        city: form.city,
        urgency: form.urgency as UrgencyLevel,
        contact: form.contact,
      });
      toast.success("Blood request submitted!");
      setForm({
        patientName: "",
        bloodGroup: "",
        quantityMl: "450",
        hospitalName: "",
        city: "",
        urgency: "",
        contact: "",
      });
    } catch {
      toast.error("Failed to submit request");
    }
  };

  const handleComplete = async (id: bigint) => {
    try {
      await completeRequest.mutateAsync(id);
      toast.success("Request marked as completed!");
    } catch {
      toast.error("Failed to update request");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2">
        Patient{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-8">
        Welcome, {userProfile?.name ?? "Patient"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            New Blood Request
          </h2>
          <form
            onSubmit={handleSubmit}
            className="rounded-xl card-dark p-5 space-y-4"
          >
            <div className="space-y-1.5">
              <Label>Patient Name *</Label>
              <Input
                placeholder="Suresh Patel"
                value={form.patientName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, patientName: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="patient.patient_name.input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Blood Group *</Label>
                <Select
                  value={form.bloodGroup}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, bloodGroup: v as BloodGroup }))
                  }
                >
                  <SelectTrigger
                    data-ocid="patient.bloodgroup.select"
                    className="bg-secondary border-border"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroupOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
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
                  value={form.quantityMl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantityMl: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="patient.quantity.input"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Urgency *</Label>
              <Select
                value={form.urgency}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, urgency: v as UrgencyLevel }))
                }
              >
                <SelectTrigger
                  data-ocid="patient.urgency.select"
                  className="bg-secondary border-border"
                >
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UrgencyLevel).map((u) => (
                    <SelectItem key={u} value={u}>
                      {u.charAt(0).toUpperCase() + u.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Hospital Name *</Label>
              <Input
                placeholder="AIIMS, New Delhi"
                value={form.hospitalName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, hospitalName: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="patient.hospital.input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City *</Label>
                <Input
                  placeholder="New Delhi"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="patient.city.input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Contact *</Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="patient.contact.input"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-bold"
              disabled={createRequest.isPending}
              data-ocid="patient.request.submit_button"
              style={{
                backgroundColor: "oklch(var(--neon-red))",
                color: "white",
              }}
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Submit Blood Request
                </>
              )}
            </Button>
          </form>
        </div>

        {/* My Requests */}
        <div>
          <h2 className="font-semibold mb-4">My Requests</h2>
          {isLoading ? (
            <div
              className="p-8 text-center"
              data-ocid="patient.requests.loading_state"
            >
              <Loader2
                className="h-6 w-6 animate-spin mx-auto"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
          ) : myRequests.length === 0 ? (
            <div
              className="rounded-xl card-dark p-8 text-center"
              data-ocid="patient.requests.empty_state"
            >
              <div className="text-3xl mb-2">📋</div>
              <p className="text-muted-foreground text-sm">
                No requests yet. Submit your first blood request.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req, i) => {
                // Determine status - simplified logic
                const status = "pending";
                const sc = statusConfig[status as keyof typeof statusConfig];
                return (
                  <div
                    key={req.id.toString()}
                    className="rounded-xl card-dark p-4"
                    data-ocid={`patient.request.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold text-sm">
                          {req.patientName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {req.hospitalName} · {req.city}
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.color.replace(")", " / 0.3)")}`,
                        }}
                      >
                        {sc.icon}
                        {sc.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: "oklch(var(--neon-red) / 0.4)",
                          color: "oklch(var(--neon-red))",
                        }}
                      >
                        {bloodGroupLabel[req.bloodGroup] ?? req.bloodGroup}
                      </Badge>
                      <span className="text-muted-foreground">
                        {Number(req.quantityMl)}ml
                      </span>
                      <span className="text-muted-foreground capitalize">
                        {req.urgencyLevel}
                      </span>
                    </div>
                    {(status as string) === "accepted" && (
                      <Button
                        size="sm"
                        className="mt-3 text-xs"
                        onClick={() => handleComplete(req.id)}
                        disabled={completeRequest.isPending}
                        data-ocid={`patient.complete.button.${i + 1}`}
                        style={{
                          backgroundColor: "oklch(0.65 0.2 140)",
                          color: "white",
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
