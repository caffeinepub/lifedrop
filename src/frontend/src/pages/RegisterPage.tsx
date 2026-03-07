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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Droplets, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BloodGroup, Role } from "../backend.d";
import { addRegisteredUser, useApp } from "../contexts/AppContext";
import { useActor } from "../hooks/useActor";

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

interface RoleConfig {
  role: Role;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  description: string;
  needsBloodGroup: boolean;
}

const roles: RoleConfig[] = [
  {
    role: Role.donor,
    label: "Donor",
    emoji: "🩸",
    color: "oklch(0.65 0.24 25)",
    bg: "oklch(0.65 0.24 25 / 0.1)",
    description: "Donate blood and save lives",
    needsBloodGroup: true,
  },
  {
    role: Role.patient,
    label: "Patient",
    emoji: "🏥",
    color: "oklch(0.60 0.18 260)",
    bg: "oklch(0.60 0.18 260 / 0.1)",
    description: "Request blood for medical needs",
    needsBloodGroup: false,
  },
  {
    role: Role.hospital,
    label: "Hospital",
    emoji: "🏨",
    color: "oklch(0.65 0.20 140)",
    bg: "oklch(0.65 0.20 140 / 0.1)",
    description: "Manage blood inventory and requests",
    needsBloodGroup: false,
  },
  {
    role: Role.bloodBank,
    label: "Blood Bank",
    emoji: "🧪",
    color: "oklch(0.65 0.18 300)",
    bg: "oklch(0.65 0.18 300 / 0.1)",
    description: "Manage blood storage and distribution",
    needsBloodGroup: false,
  },
  {
    role: Role.ngo,
    label: "NGO",
    emoji: "🤝",
    color: "oklch(0.68 0.18 60)",
    bg: "oklch(0.68 0.18 60 / 0.1)",
    description: "Organize donation camps and events",
    needsBloodGroup: false,
  },
  {
    role: Role.volunteer,
    label: "Volunteer",
    emoji: "🙌",
    color: "oklch(0.65 0.18 180)",
    bg: "oklch(0.65 0.18 180 / 0.1)",
    description: "Assist in emergency coordination",
    needsBloodGroup: false,
  },
];

type SubmitStatus = "idle" | "registering" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  phone: string;
  city: string;
  bloodGroup: BloodGroup | "";
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  bloodGroup: "",
};

function RoleForm({ roleConfig }: { roleConfig: RoleConfig }) {
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();
  const { setUserProfile } = useApp();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }
    if (roleConfig.needsBloodGroup && !form.bloodGroup) {
      toast.error("Please select your blood group");
      return;
    }

    if (!actor) {
      toast.error(
        "Connecting to backend... Please wait a moment and try again.",
      );
      return;
    }

    setStatus("registering");
    setErrorMsg("");

    try {
      // Step 1: Initialize system (silently ignore if already done)
      try {
        await actor.initSystem();
      } catch {
        // Expected: "System already initialized" — safe to ignore
      }

      // Step 2: Register
      await actor.registerUser(
        form.name,
        form.email,
        form.phone,
        roleConfig.role,
        form.city,
        form.bloodGroup ? (form.bloodGroup as BloodGroup) : null,
      );

      const profile = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: roleConfig.role,
        city: form.city,
        bloodGroup: form.bloodGroup
          ? (form.bloodGroup as BloodGroup)
          : undefined,
      };

      setUserProfile(profile);

      const bloodGroupLabel = form.bloodGroup
        ? (bloodGroupLabels[form.bloodGroup] ?? form.bloodGroup)
        : undefined;

      addRegisteredUser({
        name: form.name,
        role: roleConfig.role,
        city: form.city,
        bloodGroup: bloodGroupLabel,
        registeredAt: new Date().toISOString(),
      });

      setStatus("success");
      toast.success(`Welcome to LIFEDROP, ${form.name}!`);

      setTimeout(() => {
        void navigate({
          to: roleDashboardMap[roleConfig.role] ?? "/dashboard",
        });
      }, 1200);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("registered") ||
        message.toLowerCase().includes("exists")
      ) {
        // Already registered — treat as success, go to dashboard
        const profile = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: roleConfig.role,
          city: form.city,
          bloodGroup: form.bloodGroup
            ? (form.bloodGroup as BloodGroup)
            : undefined,
        };
        setUserProfile(profile);
        toast.info("Welcome back! Redirecting to your dashboard...");
        setStatus("success");
        setTimeout(() => {
          void navigate({
            to: roleDashboardMap[roleConfig.role] ?? "/dashboard",
          });
        }, 1000);
      } else {
        setStatus("error");
        setErrorMsg("Registration failed. Please try again.");
        toast.error(`Registration failed: ${message}`);
        setTimeout(() => setStatus("idle"), 5000);
      }
    }
  };

  const isBusy = status === "registering" || isActorFetching;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 pt-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={roleConfig.role}
    >
      {/* Role header */}
      <div
        className="flex items-center gap-3 p-3 rounded-xl mb-2"
        style={{
          background: roleConfig.bg,
          border: `1px solid ${roleConfig.color}30`,
        }}
      >
        <span className="text-2xl">{roleConfig.emoji}</span>
        <div>
          <div
            className="text-sm font-bold"
            style={{ color: roleConfig.color }}
          >
            {roleConfig.label} Registration
          </div>
          <div className="text-xs text-muted-foreground">
            {roleConfig.description}
          </div>
        </div>
      </div>

      {/* Status feedback */}
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
                    ? "Registered! Redirecting..."
                    : "Setting up & registering..."}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor={`${roleConfig.role}-name`}
            className="text-sm font-medium"
          >
            Full Name *
          </Label>
          <Input
            id={`${roleConfig.role}-name`}
            placeholder="Rajesh Kumar"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="bg-secondary border-border"
            data-ocid="register.name.input"
            required
            disabled={isBusy}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor={`${roleConfig.role}-email`}
            className="text-sm font-medium"
          >
            Email *
          </Label>
          <Input
            id={`${roleConfig.role}-email`}
            type="email"
            placeholder="rajesh@example.com"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="bg-secondary border-border"
            data-ocid="register.email.input"
            required
            disabled={isBusy}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor={`${roleConfig.role}-phone`}
            className="text-sm font-medium"
          >
            Phone *
          </Label>
          <Input
            id={`${roleConfig.role}-phone`}
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="bg-secondary border-border"
            data-ocid="register.phone.input"
            required
            disabled={isBusy}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor={`${roleConfig.role}-city`}
            className="text-sm font-medium"
          >
            City *
          </Label>
          <Input
            id={`${roleConfig.role}-city`}
            placeholder="Chennai"
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            className="bg-secondary border-border"
            data-ocid="register.city.input"
            required
            disabled={isBusy}
          />
        </div>

        {roleConfig.needsBloodGroup && (
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm font-medium">Blood Group *</Label>
            <Select
              value={form.bloodGroup}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, bloodGroup: v as BloodGroup }))
              }
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
        )}
      </div>

      <Button
        type="submit"
        className="w-full py-5 font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-2"
        disabled={isBusy || status === "success"}
        data-ocid="register.submit_button"
        style={{
          backgroundColor: isBusy ? undefined : roleConfig.color,
          color: "white",
          boxShadow: isBusy ? "none" : `0 4px 20px ${roleConfig.color}40`,
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
          `Register as ${roleConfig.label} →`
        )}
      </Button>
    </motion.form>
  );
}

export function RegisterPage() {
  const [activeTab, setActiveTab] = useState(Role.donor);

  return (
    <main className="min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.26 25 / 0.06) 0%, transparent 70%)",
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
            Choose Your Role & Register
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Select the role that fits you best. Each role gives you access to a
            dedicated dashboard and features.
          </p>
        </motion.div>

        {/* Tabs card */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            background: "oklch(0.11 0.005 20)",
            border: "1px solid oklch(var(--border) / 0.6)",
            boxShadow: "0 25px 50px oklch(0 0 0 / 0.4)",
          }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Role)}
          >
            {/* Tab triggers */}
            <div
              className="px-2 pt-3 pb-0 overflow-x-auto"
              style={{
                borderBottom: "1px solid oklch(var(--border) / 0.4)",
              }}
            >
              <TabsList
                className="h-auto bg-transparent gap-1 w-full justify-start flex-nowrap"
                data-ocid="register.tab"
              >
                {roles.map((rc) => (
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
                    data-ocid={`register.${rc.role}.tab`}
                  >
                    <span className="mr-1.5">{rc.emoji}</span>
                    {rc.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab content */}
            <div className="px-6 pb-6 pt-4">
              {roles.map((rc) => (
                <TabsContent
                  key={rc.role}
                  value={rc.role}
                  className="mt-0 focus-visible:outline-none"
                >
                  <RoleForm roleConfig={rc} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
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
