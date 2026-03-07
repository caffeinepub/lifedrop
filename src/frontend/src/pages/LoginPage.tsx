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
import { Droplets, Loader2, LogIn, Shield, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BloodGroup, Role } from "../backend.d";
import { useApp } from "../contexts/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const roleOptions = [
  { value: Role.donor, label: "🩸 Blood Donor" },
  { value: Role.patient, label: "🏥 Patient / Attender" },
  { value: Role.hospital, label: "🏨 Hospital" },
  { value: Role.bloodBank, label: "🧪 Blood Bank" },
  { value: Role.ngo, label: "🤝 NGO" },
  { value: Role.volunteer, label: "🙌 Volunteer" },
];

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

export function LoginPage() {
  const navigate = useNavigate();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { userProfile, isLoadingProfile, refetchProfile } = useApp();
  const { actor } = useActor();

  const [showRegister, setShowRegister] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as Role | "",
    city: "",
    bloodGroup: "" as BloodGroup | "",
  });

  // If logged in and profile exists → redirect to dashboard
  useEffect(() => {
    if (identity && !isLoadingProfile && userProfile) {
      const path = roleDashboardMap[userProfile.role] ?? "/dashboard";
      void navigate({ to: path });
    }
    if (identity && !isLoadingProfile && !userProfile) {
      setShowRegister(true);
    }
  }, [identity, isLoadingProfile, userProfile, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !actor ||
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.role ||
      !form.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSaving(true);
    try {
      await actor.registerUser(
        form.name,
        form.email,
        form.phone,
        form.role as Role,
        form.city,
        form.bloodGroup ? (form.bloodGroup as BloodGroup) : null,
      );
      await refetchProfile();
      toast.success("Profile created! Welcome to LIFEDROP 🩸");
      const path = roleDashboardMap[form.role] ?? "/dashboard";
      void navigate({ to: path });
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-blood-drop"
            style={{ backgroundColor: "oklch(var(--neon-red) / 0.15)" }}
          >
            <Droplets
              className="h-8 w-8"
              style={{ color: "oklch(var(--neon-red))" }}
            />
          </div>
          <h1 className="font-display text-3xl font-black">
            LIFE<span style={{ color: "oklch(var(--neon-red))" }}>DROP</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Smart Blood Donor Platform
          </p>
        </div>

        <div className="card-dark rounded-2xl p-8">
          {!identity && !showRegister && (
            /* ── Login Step ── */
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold mb-2">
                  Welcome back
                </h2>
                <p className="text-muted-foreground text-sm">
                  Login with your Internet Identity to access your dashboard
                </p>
              </div>

              <div
                className="p-4 rounded-xl text-sm"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.08)",
                  border: "1px solid oklch(var(--neon-red) / 0.2)",
                  color: "oklch(var(--neon-red))",
                }}
              >
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Shield className="h-4 w-4" />
                  Secure Decentralized Login
                </div>
                <p className="text-xs opacity-80">
                  LIFEDROP uses Internet Identity for passwordless,
                  privacy-first authentication on the Internet Computer.
                </p>
              </div>

              <Button
                className="w-full py-6 text-base font-bold"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="login.ii.primary_button"
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Login with Internet Identity
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                New user?{" "}
                <button
                  type="button"
                  onClick={() => {
                    login();
                  }}
                  className="underline hover:text-foreground transition-colors"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  Create account after login
                </button>
              </p>
            </div>
          )}

          {identity && showRegister && !userProfile && (
            /* ── Register Step ── */
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <UserPlus
                    className="h-5 w-5"
                    style={{ color: "oklch(var(--neon-red))" }}
                  />
                  <h2 className="font-display text-xl font-bold">
                    Complete Your Profile
                  </h2>
                </div>
                <p className="text-muted-foreground text-sm">
                  Logged in as {identity.getPrincipal().toString().slice(0, 16)}
                  ...
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="login.name.input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="rajesh@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="login.email.input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="login.phone.input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, role: v as Role }))
                  }
                >
                  <SelectTrigger
                    data-ocid="login.role.select"
                    className="bg-secondary border-border"
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Chennai"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  data-ocid="login.city.input"
                  required
                />
              </div>

              {form.role === Role.donor && (
                <div className="space-y-2">
                  <Label>Blood Group *</Label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, bloodGroup: v as BloodGroup }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="login.bloodgroup.select"
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

              <Button
                type="submit"
                className="w-full py-6 font-bold"
                disabled={isSaving}
                data-ocid="login.register.submit_button"
                style={{
                  backgroundColor: "oklch(var(--neon-red))",
                  color: "white",
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Join LIFEDROP 🩸"
                )}
              </Button>
            </form>
          )}

          {isLoadingProfile && identity && (
            <div
              className="flex items-center justify-center py-8"
              data-ocid="login.loading_state"
            >
              <Loader2
                className="h-8 w-8 animate-spin"
                style={{ color: "oklch(var(--neon-red))" }}
              />
              <span className="ml-3 text-muted-foreground">
                Loading your profile...
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
