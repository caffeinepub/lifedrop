import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, Calendar, CheckCircle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../../contexts/AppContext";
import { useUpdateDonorAvailability } from "../../hooks/useQueries";

type StoredVolunteer = {
  skills?: string;
  emergencyAvailable?: boolean;
  email?: string;
  phone?: string;
};

export function VolunteerDashboard() {
  const { userProfile } = useApp();
  const [available, setAvailable] = useState(true);
  const updateAvailability = useUpdateDonorAvailability();

  // Read volunteer-specific fields saved during registration
  const storedVolunteer = useMemo((): StoredVolunteer | null => {
    try {
      const raw = localStorage.getItem("lifedrop_profile_volunteer");
      return raw ? (JSON.parse(raw) as StoredVolunteer) : null;
    } catch {
      return null;
    }
  }, []);

  const handleToggle = async (val: boolean) => {
    setAvailable(val);
    try {
      await updateAvailability.mutateAsync(val);
      toast.success(val ? "You are now available" : "Availability paused");
    } catch {
      setAvailable(!val);
      toast.error("Failed to update");
    }
  };

  // No fake camps or emergency requests — starts empty until real data exists
  const assignedCamps: {
    id: string;
    name: string;
    role: string;
    date: string;
    location: string;
  }[] = [];

  const emergencyRequests: {
    id: string;
    desc: string;
    city: string;
    time: string;
  }[] = [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2">
        Volunteer{" "}
        <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-2">
        Welcome, {userProfile?.name ?? "Volunteer"}
      </p>
      {/* Profile info strip */}
      {(storedVolunteer?.phone ||
        userProfile?.phone ||
        storedVolunteer?.email ||
        userProfile?.email) && (
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          {(storedVolunteer?.phone || userProfile?.phone) && (
            <span className="flex items-center gap-1.5">
              📞{" "}
              <span className="font-semibold text-foreground">
                {storedVolunteer?.phone || userProfile?.phone}
              </span>
            </span>
          )}
          {(storedVolunteer?.email || userProfile?.email) && (
            <span className="flex items-center gap-1.5">
              ✉️{" "}
              <span className="text-foreground">
                {storedVolunteer?.email || userProfile?.email}
              </span>
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div>
          <div className="rounded-xl card-dark p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
              >
                🙌
              </div>
              <div>
                <h2 className="font-semibold">
                  {userProfile?.name ?? "Volunteer"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userProfile?.city ?? "City"}
                </p>
              </div>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "oklch(var(--secondary))" }}
            >
              <Label htmlFor="vol-avail" className="text-sm font-medium">
                Available for emergencies
              </Label>
              <Switch
                id="vol-avail"
                checked={available}
                onCheckedChange={handleToggle}
                data-ocid="volunteer.availability.toggle"
              />
            </div>

            {storedVolunteer?.skills && (
              <div
                className="mt-3 p-3 rounded-lg text-xs text-muted-foreground"
                style={{ backgroundColor: "oklch(var(--secondary))" }}
              >
                <div className="font-semibold text-foreground mb-1">Skills</div>
                {storedVolunteer.skills}
              </div>
            )}
          </div>

          {/* Status indicator */}
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              backgroundColor: available
                ? "oklch(0.65 0.2 140 / 0.08)"
                : "oklch(var(--secondary))",
              border: `1px solid ${available ? "oklch(0.65 0.2 140 / 0.3)" : "oklch(var(--border))"}`,
            }}
            data-ocid="volunteer.status.card"
          >
            {available ? (
              <CheckCircle
                className="h-5 w-5"
                style={{ color: "oklch(0.65 0.2 140)" }}
              />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
            )}
            <div className="text-sm">
              <div
                className="font-medium"
                style={{ color: available ? "oklch(0.65 0.2 140)" : undefined }}
              >
                {available ? "Currently Available" : "Not Available"}
              </div>
              <div className="text-xs text-muted-foreground">
                {available
                  ? "You will receive emergency alerts"
                  : "You won't receive new requests"}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Camps */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar
              className="h-4 w-4"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            Assigned Camps
          </h2>
          {assignedCamps.length === 0 ? (
            <div
              className="rounded-xl card-dark p-6 text-center"
              data-ocid="volunteer.camps.empty_state"
            >
              <div className="text-2xl mb-2">🏕️</div>
              <p className="text-sm text-muted-foreground">
                No camps assigned yet. Camps will appear here once an NGO
                assigns you.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedCamps.map((camp, i) => (
                <div
                  key={camp.id}
                  className="rounded-xl card-dark p-4"
                  data-ocid={`volunteer.camp.item.${i + 1}`}
                >
                  <h3 className="font-semibold text-sm mb-2">{camp.name}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Role:{" "}
                      <span className="text-foreground font-medium">
                        {camp.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {camp.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      📍 {camp.location}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="text-xs h-7 flex-1"
                      style={{
                        backgroundColor: "oklch(var(--neon-red))",
                        color: "white",
                      }}
                      data-ocid={`volunteer.camp.confirm.button.${i + 1}`}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7"
                      data-ocid={`volunteer.camp.decline.button.${i + 1}`}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Requests */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: "oklch(var(--neon-red))" }}
            />
            Emergency Alerts
          </h2>
          {emergencyRequests.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              data-ocid="volunteer.emergency.empty_state"
              style={{
                border: "1px solid oklch(var(--border))",
                backgroundColor: "oklch(var(--card))",
                borderRadius: "0.75rem",
              }}
            >
              <div className="text-2xl mb-2">🚨</div>
              <p className="text-sm text-muted-foreground">
                No emergency alerts right now. You'll be notified when there's
                an urgent need.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {emergencyRequests.map((req, i) => (
                <div
                  key={req.id}
                  className="rounded-xl p-4 animate-pulse-glow"
                  data-ocid={`volunteer.emergency.item.${i + 1}`}
                  style={{
                    border: "1px solid oklch(var(--neon-red) / 0.3)",
                    backgroundColor: "oklch(var(--neon-red) / 0.05)",
                  }}
                >
                  <p className="text-sm font-medium mb-1">{req.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      📍 {req.city} · {req.time}
                    </span>
                    <Button
                      size="sm"
                      className="text-xs h-7"
                      data-ocid={`volunteer.emergency.respond.button.${i + 1}`}
                      style={{
                        backgroundColor: "oklch(var(--neon-red))",
                        color: "white",
                      }}
                    >
                      Respond
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
