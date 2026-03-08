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
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup, UrgencyLevel } from "../backend.d";

import { useCreateBloodRequest } from "../hooks/useQueries";

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

const urgencyConfig = {
  [UrgencyLevel.low]: {
    label: "Low",
    color: "oklch(0.65 0.2 140)",
    bg: "oklch(0.65 0.2 140 / 0.1)",
    border: "oklch(0.65 0.2 140 / 0.3)",
    desc: "Non-urgent, within 48 hours",
  },
  [UrgencyLevel.medium]: {
    label: "Medium",
    color: "oklch(0.75 0.18 70)",
    bg: "oklch(0.75 0.18 70 / 0.1)",
    border: "oklch(0.75 0.18 70 / 0.3)",
    desc: "Needed within 24 hours",
  },
  [UrgencyLevel.high]: {
    label: "High",
    color: "oklch(0.68 0.2 40)",
    bg: "oklch(0.68 0.2 40 / 0.1)",
    border: "oklch(0.68 0.2 40 / 0.3)",
    desc: "Needed within 6 hours",
  },
  [UrgencyLevel.critical]: {
    label: "CRITICAL",
    color: "oklch(0.62 0.26 25)",
    bg: "oklch(0.62 0.26 25 / 0.15)",
    border: "oklch(0.62 0.26 25 / 0.5)",
    desc: "Immediate — life threatening",
  },
};

export function EmergencyRequestPage() {
  const navigate = useNavigate();
  const createRequest = useCreateBloodRequest();

  const [successId, setSuccessId] = useState<bigint | null>(null);
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "" as BloodGroup | "",
    quantityMl: "450",
    hospitalName: "",
    city: "",
    urgency: "" as UrgencyLevel | "",
    contact: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bloodGroup || !form.urgency) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const id = await createRequest.mutateAsync({
        patientName: form.patientName,
        bloodGroup: form.bloodGroup as BloodGroup,
        quantityMl: BigInt(form.quantityMl),
        hospitalName: form.hospitalName,
        city: form.city,
        urgency: form.urgency as UrgencyLevel,
        contact: form.contact,
      });
      setSuccessId(id);
      toast.success("Emergency blood request submitted!");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  if (successId !== null) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div
          className="max-w-md w-full p-8 rounded-2xl text-center"
          data-ocid="request.success_state"
          style={{
            border: "1px solid oklch(0.65 0.2 140 / 0.3)",
            backgroundColor: "oklch(0.65 0.2 140 / 0.05)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.65 0.2 140 / 0.15)" }}
          >
            <CheckCircle2
              className="h-8 w-8"
              style={{ color: "oklch(0.65 0.2 140)" }}
            />
          </div>
          <h2 className="font-display text-2xl font-black mb-2">
            Request Submitted!
          </h2>
          <p className="text-muted-foreground mb-4">
            Your emergency blood request has been submitted. Nearby donors and
            hospitals have been notified.
          </p>
          <div
            className="p-4 rounded-xl mb-6 font-mono text-sm"
            style={{
              backgroundColor: "oklch(var(--secondary))",
              border: "1px solid oklch(var(--border))",
            }}
          >
            Request ID: #{successId.toString()}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSuccessId(null);
                setForm({
                  patientName: "",
                  bloodGroup: "",
                  quantityMl: "450",
                  hospitalName: "",
                  city: "",
                  urgency: "",
                  contact: "",
                });
              }}
            >
              New Request
            </Button>
            <Button
              className="flex-1"
              onClick={() => void navigate({ to: "/search" })}
              style={{
                backgroundColor: "oklch(var(--neon-red))",
                color: "white",
              }}
            >
              Find Donors
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse-glow"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.15)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.4)",
          }}
        >
          <AlertTriangle className="h-4 w-4 animate-heartbeat" />
          EMERGENCY BLOOD REQUEST
        </div>
        <h1 className="font-display text-4xl font-black mb-3">
          Request Blood Now
        </h1>
        <p className="text-muted-foreground">
          Fill the form below. Nearby donors will be alerted instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            border: "1px solid oklch(var(--neon-red) / 0.2)",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Patient Information
          </h3>

          <div className="space-y-2">
            <Label htmlFor="patientName">Patient Name *</Label>
            <Input
              id="patientName"
              placeholder="Arjun Mehta"
              value={form.patientName}
              onChange={(e) =>
                setForm((p) => ({ ...p, patientName: e.target.value }))
              }
              className="bg-secondary border-border"
              data-ocid="request.patient_name.input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Group *</Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, bloodGroup: v as BloodGroup }))
                }
              >
                <SelectTrigger
                  data-ocid="request.bloodgroup.select"
                  className="bg-secondary border-border"
                >
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroupOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (ml) *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="450"
                min="100"
                max="5000"
                value={form.quantityMl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, quantityMl: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="request.quantity.input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level *</Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(urgencyConfig).map(([level, config]) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, urgency: level as UrgencyLevel }))
                  }
                  className={`p-3 rounded-xl text-left transition-all ${form.urgency === level ? "ring-2" : ""} ${level === UrgencyLevel.critical && form.urgency === level ? "animate-critical" : ""}`}
                  style={{
                    backgroundColor:
                      form.urgency === level
                        ? config.bg
                        : "oklch(var(--secondary))",
                    border: `1px solid ${form.urgency === level ? config.border : "oklch(var(--border))"}`,
                    outline: `2px solid ${config.color}`,
                  }}
                  data-ocid={`request.urgency.${level}.toggle`}
                >
                  <div
                    className="font-bold text-sm"
                    style={{ color: config.color }}
                  >
                    {level === UrgencyLevel.critical && (
                      <AlertTriangle className="inline h-3 w-3 mr-1" />
                    )}
                    {config.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {config.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            border: "1px solid oklch(var(--border))",
            backgroundColor: "oklch(var(--card))",
          }}
        >
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Hospital & Contact
          </h3>

          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital Name *</Label>
            <Input
              id="hospital"
              placeholder="Apollo Hospital"
              value={form.hospitalName}
              onChange={(e) =>
                setForm((p) => ({ ...p, hospitalName: e.target.value }))
              }
              className="bg-secondary border-border"
              data-ocid="request.hospital_name.input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Mumbai"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="request.city.input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number *</Label>
              <Input
                id="contact"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.contact}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contact: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="request.contact.input"
                required
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        {form.bloodGroup && form.urgency && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor:
                urgencyConfig[form.urgency as UrgencyLevel]?.bg ||
                "oklch(var(--secondary))",
              border: `1px solid ${urgencyConfig[form.urgency as UrgencyLevel]?.border || "oklch(var(--border))"}`,
            }}
          >
            <Clock
              className="h-5 w-5 flex-shrink-0"
              style={{
                color: urgencyConfig[form.urgency as UrgencyLevel]?.color,
              }}
            />
            <div className="text-sm">
              <span className="font-semibold">
                {form.patientName || "Patient"} needs{" "}
              </span>
              <Badge
                variant="outline"
                style={{
                  borderColor:
                    urgencyConfig[form.urgency as UrgencyLevel]?.color,
                  color: urgencyConfig[form.urgency as UrgencyLevel]?.color,
                }}
              >
                {
                  bloodGroupOptions.find((b) => b.value === form.bloodGroup)
                    ?.label
                }
              </Badge>{" "}
              <span>{form.quantityMl}ml</span>
              <span className="text-muted-foreground">
                {" "}
                at {form.hospitalName || "hospital"}, {form.city || "city"}
              </span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-6 text-base font-bold animate-pulse-glow btn-glow"
          disabled={createRequest.isPending}
          data-ocid="request.submit.submit_button"
          style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
        >
          {createRequest.isPending ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Submitting Request...
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Submit Emergency Request
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
