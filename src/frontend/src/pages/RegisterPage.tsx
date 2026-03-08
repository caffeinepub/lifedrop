import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Droplets,
  FlaskConical,
  HandHeart,
  Heart,
  Loader2,
  UserRound,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup, Role } from "../backend.d";
import { addRegisteredUser, useApp } from "../contexts/AppContext";
import { useDeviceActor } from "../hooks/useDeviceActor";

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

const roleDashboardMap: Record<string, string> = {
  donor: "/dashboard/donor",
  patient: "/dashboard/patient",
  hospital: "/dashboard/hospital",
  bloodBank: "/dashboard/bloodbank",
  ngo: "/dashboard/ngo",
  volunteer: "/dashboard/volunteer",
  admin: "/dashboard/admin",
};

const bloodGroupLabels: Record<string, string> = {
  A_Positive: "A+",
  A_Negative: "A−",
  B_Positive: "B+",
  B_Negative: "B−",
  AB_Positive: "AB+",
  AB_Negative: "AB−",
  O_Positive: "O+",
  O_Negative: "O−",
};

type SubmitStatus = "idle" | "registering" | "success" | "error";

interface BaseRegisterResult {
  name: string;
  role: Role;
  city: string;
  bloodGroup?: BloodGroup;
  email?: string;
  phone?: string;
}

interface ExtraRegisterData {
  hospitalName?: string;
  licenseNumber?: string;
  address?: string;
}

// ─── Shared status feedback component ────────────────────────

function StatusFeedback({
  status,
  errorMsg,
}: {
  status: SubmitStatus;
  errorMsg: string;
}) {
  return (
    <AnimatePresence>
      {status !== "idle" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{
              background:
                status === "error"
                  ? "oklch(0.58 0.24 25 / 0.1)"
                  : status === "success"
                    ? "oklch(0.65 0.2 140 / 0.1)"
                    : "oklch(var(--neon-red) / 0.08)",
              border: `1px solid ${
                status === "error"
                  ? "oklch(0.58 0.24 25 / 0.3)"
                  : status === "success"
                    ? "oklch(0.65 0.2 140 / 0.3)"
                    : "oklch(var(--neon-red) / 0.2)"
              }`,
              color:
                status === "error"
                  ? "oklch(0.7 0.2 25)"
                  : status === "success"
                    ? "oklch(0.7 0.2 140)"
                    : "oklch(var(--neon-red))",
            }}
            data-ocid={
              status === "error"
                ? "register.error_state"
                : status === "success"
                  ? "register.success_state"
                  : "register.loading_state"
            }
          >
            {status === "error" ? (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            ) : status === "success" ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : (
              <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
            )}
            <span>
              {status === "error"
                ? errorMsg || "Registration failed"
                : status === "success"
                  ? "Registered! Taking you to your dashboard..."
                  : "Creating your profile on the blockchain..."}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Shared submit button ─────────────────────────────────────

function SubmitButton({
  isBusy,
  status,
  label,
  color,
}: {
  isBusy: boolean;
  status: SubmitStatus;
  label: string;
  color: string;
}) {
  return (
    <Button
      type="submit"
      className="w-full py-5 font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-2"
      disabled={isBusy || status === "success"}
      data-ocid="register.submit_button"
      style={{
        backgroundColor: isBusy ? undefined : color,
        color: "white",
        boxShadow: isBusy ? "none" : `0 4px 20px ${color}40`,
      }}
    >
      {isBusy ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Registering...
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Registered!
        </>
      ) : (
        `Register as ${label} →`
      )}
    </Button>
  );
}

// ─── Shared role header ───────────────────────────────────────

function RoleHeader({
  emoji,
  label,
  description,
  color,
  bg,
}: {
  emoji: string;
  label: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl mb-2"
      style={{
        background: bg,
        border: `1px solid ${color}30`,
      }}
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <div className="text-sm font-bold" style={{ color }}>
          {label} Registration
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

// ─── Shared register logic hook ───────────────────────────────

function useRegisterLogic(role: Role) {
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useDeviceActor();
  const { setUserProfile } = useApp();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isBusy = status === "registering" || isActorFetching;

  const submit = async (
    data: BaseRegisterResult,
    extra?: ExtraRegisterData,
  ) => {
    if (!actor) {
      toast.error(
        "Connecting to backend... Please wait a moment and try again.",
      );
      return;
    }

    setStatus("registering");
    setErrorMsg("");

    try {
      // Register user — pass actual email and phone to backend
      // Using device actor (unique Ed25519 keypair per browser) so each person
      // gets a unique principal — fixing the "all anonymous = same principal" bug
      await actor.registerUser(
        data.name,
        data.email ?? "",
        data.phone ?? "",
        role,
        data.city,
        data.bloodGroup ?? null,
      );

      // Always call saveCallerUserProfile after registerUser to ensure phone/name/city
      // are updated even if the caller was already registered (idempotent update)
      try {
        await actor.saveCallerUserProfile({
          name: data.name,
          email: data.email ?? "",
          phone: data.phone ?? "",
          role,
          city: data.city,
          bloodGroup: data.bloodGroup ?? undefined,
        });
      } catch {
        // Non-fatal — profile may not exist yet for new users, that's fine
      }

      // If hospital, also update hospital profile with license/name/address
      if (
        role === Role.hospital &&
        extra?.licenseNumber &&
        extra?.hospitalName
      ) {
        try {
          await actor.updateHospitalProfile(
            extra.licenseNumber,
            extra.hospitalName,
            extra.address ?? data.city,
          );
        } catch {
          // Non-fatal: profile registered, hospital details update failed silently
        }
      }

      const profile = {
        name: data.name,
        email: data.email ?? "",
        phone: data.phone ?? "",
        role,
        city: data.city,
        bloodGroup: data.bloodGroup,
      };

      setUserProfile(profile);

      const bloodGroupLabel = data.bloodGroup
        ? (bloodGroupLabels[data.bloodGroup] ?? data.bloodGroup)
        : undefined;

      // Only call addRegisteredUser on true first-time registration
      addRegisteredUser({
        name: data.name,
        role,
        city: data.city,
        bloodGroup: bloodGroupLabel,
        registeredAt: new Date().toISOString(),
      });

      // If donor, generate a unique donor ID and save card data immediately
      if (role === Role.donor && data.bloodGroup) {
        const nameKey = `lifedrop_donor_id_${data.name.replace(/\s+/g, "_").toLowerCase()}`;
        let donorId = localStorage.getItem(nameKey);
        if (!donorId) {
          const prefix = data.name
            .replace(/\s+/g, "")
            .slice(0, 6)
            .toUpperCase()
            .padEnd(6, "X");
          const suffix = Date.now().toString(16).slice(-4).toUpperCase();
          donorId = `LD-${prefix}-${suffix}`;
          localStorage.setItem(nameKey, donorId);
          localStorage.setItem("lifedrop_donor_id", donorId);
        }
        const cardData = {
          name: data.name,
          bloodGroup: data.bloodGroup,
          city: data.city,
          totalDonations: 0,
        };
        localStorage.setItem(
          `lifedrop_donor_card_${donorId}`,
          JSON.stringify(cardData),
        );
      }

      setStatus("success");
      toast.success(`Welcome to LIFEDROP, ${data.name}!`);

      // Notify sidebar and stats to refresh
      window.dispatchEvent(new CustomEvent("lifedrop_user_registered"));

      setTimeout(() => {
        void navigate({
          to: roleDashboardMap[role] ?? "/dashboard",
        });
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const lowerMsg = message.toLowerCase();

      // Already registered — idempotent, treat as success (do NOT call addRegisteredUser again)
      if (
        lowerMsg.includes("already") ||
        lowerMsg.includes("registered") ||
        lowerMsg.includes("exists")
      ) {
        const profile = {
          name: data.name,
          email: data.email ?? "",
          phone: data.phone ?? "",
          role,
          city: data.city,
          bloodGroup: data.bloodGroup,
        };
        setUserProfile(profile);
        toast.success("Welcome back! You're already registered.");
        setStatus("success");
        setTimeout(() => {
          void navigate({ to: roleDashboardMap[role] ?? "/dashboard" });
        }, 1200);
      } else {
        // Real error — canister stopped, network issue, etc.
        setStatus("error");
        const friendlyMsg =
          lowerMsg.includes("canister") || lowerMsg.includes("stopped")
            ? "Backend is temporarily unavailable. Please try again in a moment."
            : lowerMsg.includes("network") || lowerMsg.includes("fetch")
              ? "Network error. Please check your connection and try again."
              : "Registration failed. Please try again.";
        setErrorMsg(friendlyMsg);
        toast.error(friendlyMsg);
        setTimeout(() => setStatus("idle"), 6000);
      }
    }
  };

  return { status, errorMsg, isBusy, submit };
}

// ─────────────────────────────────────────────────────────────
// DONOR FORM 🩸
// ─────────────────────────────────────────────────────────────

function DonorForm() {
  const color = "oklch(0.65 0.24 25)";
  const bg = "oklch(0.65 0.24 25 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.donor);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [age, setAge] = useState("");
  const [available, setAvailable] = useState(true);
  const [lastDonation, setLastDonation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!bloodGroup) {
      toast.error("Please select your blood group");
      return;
    }

    // Save extra donor data locally
    localStorage.setItem(
      "lifedrop_profile_donor",
      JSON.stringify({ age, available, lastDonation, email, phone }),
    );

    await submit({
      name,
      role: Role.donor,
      city,
      bloodGroup: bloodGroup as BloodGroup,
      email: email || undefined,
      phone,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="donor-form"
    >
      <RoleHeader
        emoji="🩸"
        label="Donor"
        description="Register to donate blood and save lives"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="donor-name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="donor-name"
            placeholder="Rajesh Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="donor-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="donor-email"
            type="email"
            placeholder="rajesh@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="donor-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="donor-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="donor-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="donor-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Blood Group *</Label>
          <Select
            value={bloodGroup}
            onValueChange={(v) => setBloodGroup(v as BloodGroup)}
            disabled={isBusy}
          >
            <SelectTrigger
              data-ocid="register.bloodgroup.select"
              className="bg-secondary border-border"
            >
              <SelectValue placeholder="Select blood group" />
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
        <div className="space-y-1.5">
          <Label htmlFor="donor-age" className="text-sm font-medium">
            Age (years)
          </Label>
          <Input
            id="donor-age"
            type="number"
            placeholder="25"
            min="18"
            max="65"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.age.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="donor-last-donation" className="text-sm font-medium">
            Last Donation Date
          </Label>
          <Input
            id="donor-last-donation"
            type="date"
            value={lastDonation}
            onChange={(e) => setLastDonation(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.last_donation.input"
            disabled={isBusy}
          />
        </div>
        <div className="sm:col-span-2">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: bg, border: `1px solid ${color}30` }}
          >
            <Checkbox
              id="donor-available"
              checked={available}
              onCheckedChange={(v) => setAvailable(!!v)}
              disabled={isBusy}
              data-ocid="register.available.checkbox"
            />
            <Label
              htmlFor="donor-available"
              className="text-sm font-medium cursor-pointer"
            >
              ✅ Available to donate blood now
            </Label>
          </div>
        </div>
      </div>

      <SubmitButton
        isBusy={isBusy}
        status={status}
        label="Donor"
        color={color}
      />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// PATIENT FORM 🏥
// ─────────────────────────────────────────────────────────────

function PatientForm() {
  const color = "oklch(0.60 0.18 260)";
  const bg = "oklch(0.60 0.18 260 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.patient);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bloodGroupNeeded, setBloodGroupNeeded] = useState<BloodGroup | "">("");
  const [hospitalName, setHospitalName] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!bloodGroupNeeded) {
      toast.error("Please select the required blood group");
      return;
    }

    localStorage.setItem(
      "lifedrop_profile_patient",
      JSON.stringify({ bloodGroupNeeded, hospitalName, urgency, email, phone }),
    );

    await submit({
      name,
      role: Role.patient,
      city,
      bloodGroup: undefined,
      email: email || undefined,
      phone,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="patient-form"
    >
      <RoleHeader
        emoji="🏥"
        label="Patient"
        description="Request blood for medical treatment"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="patient-name" className="text-sm font-medium">
            Patient / Attender Name *
          </Label>
          <Input
            id="patient-name"
            placeholder="Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="patient-email"
            type="email"
            placeholder="priya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="patient-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="patient-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="patient-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Blood Group Needed *</Label>
          <Select
            value={bloodGroupNeeded}
            onValueChange={(v) => setBloodGroupNeeded(v as BloodGroup)}
            disabled={isBusy}
          >
            <SelectTrigger
              data-ocid="register.bloodgroup.select"
              className="bg-secondary border-border"
            >
              <SelectValue placeholder="Select required blood group" />
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
        <div className="space-y-1.5">
          <Label htmlFor="patient-hospital" className="text-sm font-medium">
            Hospital Name
          </Label>
          <Input
            id="patient-hospital"
            placeholder="Apollo Hospital"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.hospital_name.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-sm font-medium">Urgency Level</Label>
          <Select value={urgency} onValueChange={setUrgency} disabled={isBusy}>
            <SelectTrigger
              data-ocid="register.urgency.select"
              className="bg-secondary border-border"
            >
              <SelectValue placeholder="Select urgency level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">🟢 Low — Within a week</SelectItem>
              <SelectItem value="medium">
                🟡 Medium — Within 2-3 days
              </SelectItem>
              <SelectItem value="high">🟠 High — Within 24 hours</SelectItem>
              <SelectItem value="critical">🔴 Critical — Immediate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SubmitButton
        isBusy={isBusy}
        status={status}
        label="Patient"
        color={color}
      />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// HOSPITAL FORM 🏨
// ─────────────────────────────────────────────────────────────

function HospitalForm() {
  const color = "oklch(0.65 0.20 140)";
  const bg = "oklch(0.65 0.20 140 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.hospital);

  const [hospitalName, setHospitalName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hospitalName || !licenseNumber || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "lifedrop_profile_hospital",
      JSON.stringify({
        hospitalName,
        licenseNumber,
        contactPerson,
        address,
        email,
        phone,
      }),
    );

    const displayName = contactPerson || hospitalName;
    await submit(
      {
        name: displayName,
        role: Role.hospital,
        city,
        bloodGroup: undefined,
        email: email || undefined,
        phone,
      },
      {
        hospitalName,
        licenseNumber,
        address,
      },
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="hospital-form"
    >
      <RoleHeader
        emoji="🏨"
        label="Hospital"
        description="Manage blood inventory and coordinate donations"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hospital-name" className="text-sm font-medium">
            Hospital Name *
          </Label>
          <Input
            id="hospital-name"
            placeholder="Apollo Hospitals Chennai"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospital-license" className="text-sm font-medium">
            License Number *
          </Label>
          <Input
            id="hospital-license"
            placeholder="MH-HOSP-2024-001"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.license.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospital-contact" className="text-sm font-medium">
            Contact Person Name
          </Label>
          <Input
            id="hospital-contact"
            placeholder="Dr. Ramesh Kumar"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.contact_person.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospital-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="hospital-email"
            type="email"
            placeholder="contact@apollo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospital-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="hospital-phone"
            type="tel"
            placeholder="+91 44 2829 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hospital-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="hospital-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hospital-address" className="text-sm font-medium">
            Address
          </Label>
          <Textarea
            id="hospital-address"
            placeholder="21 Greams Lane, Off Greams Road, Chennai 600006"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-secondary border-border resize-none"
            rows={2}
            data-ocid="register.address.textarea"
            disabled={isBusy}
          />
        </div>
      </div>

      <SubmitButton
        isBusy={isBusy}
        status={status}
        label="Hospital"
        color={color}
      />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// BLOOD BANK FORM 🧪
// ─────────────────────────────────────────────────────────────

function BloodBankForm() {
  const color = "oklch(0.65 0.18 300)";
  const bg = "oklch(0.65 0.18 300 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.bloodBank);

  const [bankName, setBankName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [storageCapacity, setStorageCapacity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !licenseNumber || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "lifedrop_profile_bloodBank",
      JSON.stringify({
        bankName,
        licenseNumber,
        contactPerson,
        address,
        storageCapacity,
        email,
        phone,
      }),
    );

    const displayName = contactPerson || bankName;
    await submit({
      name: displayName,
      role: Role.bloodBank,
      city,
      bloodGroup: undefined,
      email: email || undefined,
      phone,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="bloodbank-form"
    >
      <RoleHeader
        emoji="🧪"
        label="Blood Bank"
        description="Manage blood storage, inventory and distribution"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bb-name" className="text-sm font-medium">
            Blood Bank Name *
          </Label>
          <Input
            id="bb-name"
            placeholder="Chennai City Blood Bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-license" className="text-sm font-medium">
            License Number *
          </Label>
          <Input
            id="bb-license"
            placeholder="TN-BB-2024-012"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.license.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-contact" className="text-sm font-medium">
            Contact Person
          </Label>
          <Input
            id="bb-contact"
            placeholder="Dr. Lakshmi Iyer"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.contact_person.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="bb-email"
            type="email"
            placeholder="info@bloodbank.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="bb-phone"
            type="tel"
            placeholder="+91 44 2345 6789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="bb-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bb-capacity" className="text-sm font-medium">
            Storage Capacity (ml)
          </Label>
          <Input
            id="bb-capacity"
            type="number"
            placeholder="50000"
            min="0"
            value={storageCapacity}
            onChange={(e) => setStorageCapacity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.capacity.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bb-address" className="text-sm font-medium">
            Address
          </Label>
          <Textarea
            id="bb-address"
            placeholder="12 Anna Salai, Teynampet, Chennai 600018"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="bg-secondary border-border resize-none"
            rows={2}
            data-ocid="register.address.textarea"
            disabled={isBusy}
          />
        </div>
      </div>

      <SubmitButton
        isBusy={isBusy}
        status={status}
        label="Blood Bank"
        color={color}
      />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// NGO FORM 🤝
// ─────────────────────────────────────────────────────────────

function NGOForm() {
  const color = "oklch(0.68 0.18 60)";
  const bg = "oklch(0.68 0.18 60 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.ngo);

  const [orgName, setOrgName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [focusArea, setFocusArea] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "lifedrop_profile_ngo",
      JSON.stringify({
        orgName,
        regNumber,
        contactPerson,
        focusArea,
        email,
        phone,
      }),
    );

    const displayName = contactPerson || orgName;
    await submit({
      name: displayName,
      role: Role.ngo,
      city,
      bloodGroup: undefined,
      email: email || undefined,
      phone,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="ngo-form"
    >
      <RoleHeader
        emoji="🤝"
        label="NGO"
        description="Organize blood donation camps and awareness events"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="ngo-org" className="text-sm font-medium">
            Organization Name *
          </Label>
          <Input
            id="ngo-org"
            placeholder="Tamil Nadu Blood Donors Association"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ngo-reg" className="text-sm font-medium">
            NGO Registration Number
          </Label>
          <Input
            id="ngo-reg"
            placeholder="TN-NGO-2024-1234"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.reg_number.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ngo-contact" className="text-sm font-medium">
            Contact Person Name
          </Label>
          <Input
            id="ngo-contact"
            placeholder="Ananya Krishnan"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.contact_person.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ngo-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="ngo-email"
            type="email"
            placeholder="contact@ngo.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ngo-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="ngo-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ngo-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="ngo-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="ngo-focus" className="text-sm font-medium">
            Focus Area
          </Label>
          <Input
            id="ngo-focus"
            placeholder="Blood donation drives, thalassemia awareness, emergency response"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.focus_area.input"
            disabled={isBusy}
          />
        </div>
      </div>

      <SubmitButton isBusy={isBusy} status={status} label="NGO" color={color} />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// VOLUNTEER FORM 🙌
// ─────────────────────────────────────────────────────────────

function VolunteerForm() {
  const color = "oklch(0.65 0.18 180)";
  const bg = "oklch(0.65 0.18 180 / 0.1)";
  const { status, errorMsg, isBusy, submit } = useRegisterLogic(Role.volunteer);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [skills, setSkills] = useState("");
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) {
      toast.error("Please fill all required fields");
      return;
    }

    localStorage.setItem(
      "lifedrop_profile_volunteer",
      JSON.stringify({ skills, emergencyAvailable, email, phone }),
    );

    await submit({
      name,
      role: Role.volunteer,
      city,
      bloodGroup: undefined,
      email: email || undefined,
      phone,
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key="volunteer-form"
    >
      <RoleHeader
        emoji="🙌"
        label="Volunteer"
        description="Assist in emergency blood donation coordination"
        color={color}
        bg={bg}
      />
      <StatusFeedback status={status} errorMsg={errorMsg} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="vol-name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="vol-name"
            placeholder="Karthik Subramanian"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vol-email" className="text-sm font-medium">
            Email (optional)
          </Label>
          <Input
            id="vol-email"
            type="email"
            placeholder="karthik@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vol-phone" className="text-sm font-medium">
            Phone *
          </Label>
          <Input
            id="vol-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="vol-city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="vol-city"
            placeholder="Chennai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="vol-skills" className="text-sm font-medium">
            Skills / Role Description
          </Label>
          <Textarea
            id="vol-skills"
            placeholder="Transport, logistics, first aid, blood camp coordination, social media outreach..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="bg-secondary border-border resize-none"
            rows={3}
            data-ocid="register.skills.textarea"
            disabled={isBusy}
          />
        </div>
        <div className="sm:col-span-2">
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: bg, border: `1px solid ${color}30` }}
          >
            <Checkbox
              id="vol-emergency"
              checked={emergencyAvailable}
              onCheckedChange={(v) => setEmergencyAvailable(!!v)}
              disabled={isBusy}
              data-ocid="register.emergency_available.checkbox"
            />
            <Label
              htmlFor="vol-emergency"
              className="text-sm font-medium cursor-pointer"
            >
              🚨 Available for emergency response (24/7)
            </Label>
          </div>
        </div>
      </div>

      <SubmitButton
        isBusy={isBusy}
        status={status}
        label="Volunteer"
        color={color}
      />
    </motion.form>
  );
}

// ─────────────────────────────────────────────────────────────
// ROLE TABS CONFIG
// ─────────────────────────────────────────────────────────────

const roleTabs = [
  {
    role: Role.donor,
    label: "Donor",
    emoji: "🩸",
    color: "oklch(0.65 0.24 25)",
    bg: "oklch(0.65 0.24 25 / 0.1)",
    icon: Droplets,
  },
  {
    role: Role.patient,
    label: "Patient",
    emoji: "🏥",
    color: "oklch(0.60 0.18 260)",
    bg: "oklch(0.60 0.18 260 / 0.1)",
    icon: Heart,
  },
  {
    role: Role.hospital,
    label: "Hospital",
    emoji: "🏨",
    color: "oklch(0.65 0.20 140)",
    bg: "oklch(0.65 0.20 140 / 0.1)",
    icon: Building2,
  },
  {
    role: Role.bloodBank,
    label: "Blood Bank",
    emoji: "🧪",
    color: "oklch(0.65 0.18 300)",
    bg: "oklch(0.65 0.18 300 / 0.1)",
    icon: FlaskConical,
  },
  {
    role: Role.ngo,
    label: "NGO",
    emoji: "🤝",
    color: "oklch(0.68 0.18 60)",
    bg: "oklch(0.68 0.18 60 / 0.1)",
    icon: HandHeart,
  },
  {
    role: Role.volunteer,
    label: "Volunteer",
    emoji: "🙌",
    color: "oklch(0.65 0.18 180)",
    bg: "oklch(0.65 0.18 180 / 0.1)",
    icon: Users,
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN REGISTER PAGE
// ─────────────────────────────────────────────────────────────

export function RegisterPage() {
  const routerState = useRouterState();
  const searchParams = new URLSearchParams(routerState.location.search);
  const roleParam = searchParams.get("role");
  const validRoles = [
    "donor",
    "patient",
    "hospital",
    "bloodBank",
    "ngo",
    "volunteer",
  ];
  const initialTab = (
    roleParam && validRoles.includes(roleParam) ? roleParam : Role.donor
  ) as Role;

  const [activeTab, setActiveTab] = useState<Role>(initialTab);

  const activeConfig =
    roleTabs.find((r) => r.role === activeTab) ?? roleTabs[0];

  return (
    <main className="min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.26 25 / 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Page header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
            >
              <Droplets
                className="h-5 w-5"
                style={{ color: "oklch(var(--neon-red))" }}
              />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight">
              LIFE<span style={{ color: "oklch(var(--neon-red))" }}>DROP</span>
            </h1>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Register Your Role
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Select the role that fits you best. Each role has a unique
            registration form and dedicated dashboard.
          </p>
        </motion.div>

        {/* Role selection cards (mobile-friendly) */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {roleTabs.map((rc) => (
            <button
              key={rc.role}
              type="button"
              onClick={() => setActiveTab(rc.role)}
              data-ocid={`register.${rc.role}.tab`}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 text-xs font-medium"
              style={{
                background:
                  activeTab === rc.role ? rc.bg : "oklch(0.12 0.005 20 / 0.5)",
                border: `1.5px solid ${activeTab === rc.role ? `${rc.color}60` : "oklch(var(--border) / 0.3)"}`,
                color:
                  activeTab === rc.role ? rc.color : "oklch(0.55 0.005 20)",
                boxShadow:
                  activeTab === rc.role
                    ? `0 0 20px ${rc.color}40, 0 0 40px ${rc.color}20`
                    : "none",
                transform: activeTab === rc.role ? "scale(1.04)" : "scale(1)",
              }}
            >
              <span className="text-lg leading-none">{rc.emoji}</span>
              <span className="leading-none text-center">{rc.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Form card */}
        <motion.div
          className="rounded-2xl overflow-hidden card-glow-intense"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "oklch(0.10 0.005 20)",
            border: `1.5px solid ${activeConfig.color}60`,
            boxShadow:
              "0 0 40px oklch(var(--neon-red) / 0.15), 0 0 80px oklch(var(--neon-red) / 0.08), 0 8px 32px oklch(0 0 0 / 0.6)",
          }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Role)}
          >
            {/* Scrollable tab bar for desktop */}
            <div
              className="hidden sm:block px-2 pt-3 pb-0 overflow-x-auto"
              style={{
                borderBottom: `1px solid ${activeConfig.color}20`,
              }}
            >
              <TabsList
                className="h-auto bg-transparent gap-1 w-full justify-start flex-nowrap"
                data-ocid="register.tab"
              >
                {roleTabs.map((rc) => (
                  <TabsTrigger
                    key={rc.role}
                    value={rc.role}
                    className="flex-shrink-0 text-xs px-3 py-2 rounded-lg data-[state=active]:shadow-none transition-all"
                    style={
                      activeTab === rc.role
                        ? {
                            backgroundColor: rc.bg,
                            color: rc.color,
                            border: `1px solid ${rc.color}40`,
                          }
                        : {}
                    }
                  >
                    <span className="mr-1.5">{rc.emoji}</span>
                    {rc.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab content */}
            <div className="px-6 pb-6 pt-4">
              <TabsContent
                value={Role.donor}
                className="mt-0 focus-visible:outline-none"
              >
                <DonorForm />
              </TabsContent>
              <TabsContent
                value={Role.patient}
                className="mt-0 focus-visible:outline-none"
              >
                <PatientForm />
              </TabsContent>
              <TabsContent
                value={Role.hospital}
                className="mt-0 focus-visible:outline-none"
              >
                <HospitalForm />
              </TabsContent>
              <TabsContent
                value={Role.bloodBank}
                className="mt-0 focus-visible:outline-none"
              >
                <BloodBankForm />
              </TabsContent>
              <TabsContent
                value={Role.ngo}
                className="mt-0 focus-visible:outline-none"
              >
                <NGOForm />
              </TabsContent>
              <TabsContent
                value={Role.volunteer}
                className="mt-0 focus-visible:outline-none"
              >
                <VolunteerForm />
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>

        {/* Role description pills */}
        <motion.div
          className="mt-5 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {roleTabs.map((rc) => (
            <span
              key={rc.role}
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                background:
                  activeTab === rc.role ? rc.bg : "oklch(0.12 0 0 / 0.5)",
                color: activeTab === rc.role ? rc.color : "oklch(0.4 0 0)",
                border: `1px solid ${activeTab === rc.role ? `${rc.color}40` : "oklch(var(--border) / 0.2)"}`,
              }}
            >
              {rc.emoji} {rc.label}
            </span>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Powered by Internet Computer Protocol — fully decentralized &amp;
          secure
        </motion.p>
      </div>
    </main>
  );
}
