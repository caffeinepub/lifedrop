import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  ImagePlus,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CampPosterDialog } from "../../components/CampPosterDialog";
import { DeleteAccountSection } from "../../components/DeleteAccountSection";
import { PhoneInput, extractPhoneDigits } from "../../components/PhoneInput";
import { type CampAnnouncement, useApp } from "../../contexts/AppContext";
import { useSearchDonors } from "../../hooks/useQueries";

const statusColors = {
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

type StoredNGO = {
  orgName?: string;
  regNumber?: string;
  contactPerson?: string;
  focusArea?: string;
  email?: string;
  phone?: string;
};

export function NGODashboard() {
  const { camps, addCamp, deleteCamp } = useApp();

  const storedNGO = useMemo((): StoredNGO | null => {
    try {
      const raw = localStorage.getItem("lifedrop_profile_ngo");
      return raw ? (JSON.parse(raw) as StoredNGO) : null;
    } catch {
      return null;
    }
  }, []);

  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    expectedDonors: "",
    organizer: "",
    contact: "",
    posterImageBase64: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [posterCamp, setPosterCamp] = useState<CampAnnouncement | null>(null);
  const [posterOpen, setPosterOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ngoCamps = camps.filter((c) => c.postedBy === "NGO");

  const { data: volunteers, isLoading: loadingVolunteers } = useSearchDonors(
    null,
    null,
    true,
    true,
  );

  const handlePosterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((p) => ({
        ...p,
        posterImageBase64: ev.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 500));
    const today = new Date().toISOString().split("T")[0];
    const contactDigits = extractPhoneDigits(form.contact);
    if (form.contact && contactDigits.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      setIsCreating(false);
      return;
    }
    const camp: CampAnnouncement = {
      id: `CAMP-NGO-${String(Date.now()).slice(-6)}`,
      name: form.name,
      venue: form.location,
      date: form.date,
      time: form.time,
      expectedDonors: Number.parseInt(form.expectedDonors) || 0,
      organizer: form.organizer || storedNGO?.orgName || "NGO",
      contact: form.contact,
      postedBy: "NGO",
      postedAt: new Date().toISOString(),
      status: form.date >= today ? "upcoming" : "completed",
      posterImage: form.posterImageBase64 || undefined,
      interestedCount: 0,
      interestedByDevice: [],
    };
    addCamp(camp);
    setForm({
      name: "",
      location: "",
      date: "",
      time: "",
      expectedDonors: "",
      organizer: "",
      contact: "",
      posterImageBase64: "",
    });
    setShowForm(false);
    setIsCreating(false);
    toast.success("Blood donation camp announced! Visible to all users.");
  };

  const handleDeleteCamp = (campId: string, campName: string) => {
    if (window.confirm(`Delete camp "${campName}"? This cannot be undone.`)) {
      deleteCamp(campId);
      toast.success("Camp deleted.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-black mb-2 animate-cinema-enter">
        NGO <span style={{ color: "oklch(var(--neon-red))" }}>Dashboard</span>
      </h1>
      <p className="text-muted-foreground mb-2">
        {storedNGO?.orgName ? `${storedNGO.orgName} — ` : ""}Manage donation
        camps and volunteers
      </p>

      {(storedNGO?.phone || storedNGO?.email || storedNGO?.regNumber) && (
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
          {storedNGO.phone && (
            <span className="flex items-center gap-1.5">
              📞{" "}
              <span className="font-semibold text-foreground">
                {storedNGO.phone}
              </span>
            </span>
          )}
          {storedNGO.email && (
            <span className="flex items-center gap-1.5">
              ✉️ <span className="text-foreground">{storedNGO.email}</span>
            </span>
          )}
          {storedNGO.regNumber && (
            <span className="flex items-center gap-1.5">
              🪪{" "}
              <span className="font-mono text-foreground">
                {storedNGO.regNumber}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Camps", value: ngoCamps.length },
          {
            label: "Active Camps",
            value: ngoCamps.filter((c) => c.status === "active").length,
          },
          {
            label: "Total Donors Expected",
            value: ngoCamps.reduce((s, c) => s + c.expectedDonors, 0),
          },
          { label: "Volunteers Available", value: volunteers?.length ?? "..." },
        ].map((s) => (
          <div key={s.label} className="rounded-xl card-dark p-4 text-center">
            <div
              className="font-display text-2xl font-black"
              style={{ color: "oklch(var(--neon-red))" }}
            >
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Create Camp Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Calendar
            className="h-4 w-4"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          Donation Camps
        </h2>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          data-ocid="ngo.create_camp.button"
          className="btn-glow"
          style={{ backgroundColor: "oklch(var(--neon-red))", color: "white" }}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Camp
        </Button>
      </div>

      {/* Camp Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-xl card-dark p-5 mb-6 space-y-4 animate-slide-in-up"
        >
          <h3 className="font-semibold">Create New Camp Announcement</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Camp Name *</Label>
              <Input
                placeholder="City Blood Drive"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.camp_name.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Venue / Location *</Label>
              <Input
                placeholder="Community Hall, Anna Nagar"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.location.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.date.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Time *</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm((p) => ({ ...p, time: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.time.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expected Donors *</Label>
              <Input
                type="number"
                placeholder="100"
                value={form.expectedDonors}
                onChange={(e) =>
                  setForm((p) => ({ ...p, expectedDonors: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.expected_donors.input"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Organizer *</Label>
              <Input
                placeholder="Red Cross Chapter"
                value={form.organizer}
                onChange={(e) =>
                  setForm((p) => ({ ...p, organizer: e.target.value }))
                }
                className="bg-secondary border-border"
                data-ocid="ngo.organizer.input"
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Contact *</Label>
              <PhoneInput
                value={form.contact}
                onChange={(v) => setForm((p) => ({ ...p, contact: v }))}
                className="w-full"
                data-ocid="ngo.contact.input"
                required
              />
            </div>

            {/* Poster Image Upload */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Event Poster Image (optional)</Label>
              <label
                className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all"
                style={{
                  border: "2px dashed oklch(var(--border))",
                  background: "oklch(var(--secondary) / 0.5)",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePosterImageChange}
                  data-ocid="ngo.camp_poster.upload_button"
                />
                {form.posterImageBase64 ? (
                  <>
                    <img
                      src={form.posterImageBase64}
                      alt="Poster preview"
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                        flexShrink: 0,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        Poster uploaded
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setForm((p) => ({ ...p, posterImageBase64: "" }));
                      }}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        color: "oklch(var(--neon-red))",
                        border: "1px solid oklch(var(--neon-red) / 0.3)",
                      }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: "oklch(var(--neon-red) / 0.1)",
                      }}
                    >
                      <ImagePlus
                        className="h-5 w-5"
                        style={{ color: "oklch(var(--neon-red))" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Upload Event Poster
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPEG, PNG or WebP — max 5 MB
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 btn-glow"
              disabled={isCreating}
              data-ocid="ngo.create_camp.submit_button"
              style={{
                backgroundColor: "oklch(var(--neon-red))",
                color: "white",
              }}
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Camp Announcement"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
              data-ocid="ngo.create_camp.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Camps List */}
      {ngoCamps.length === 0 && (
        <div
          className="rounded-xl card-dark p-8 text-center mb-10"
          data-ocid="ngo.camps.empty_state"
        >
          <div className="text-3xl mb-2">🏕️</div>
          <p className="text-muted-foreground text-sm">
            No camps announced yet. Click "New Camp" to post your first donation
            camp.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {ngoCamps.map((camp, i) => {
          const sc = statusColors[camp.status];
          return (
            <div
              key={camp.id}
              className="rounded-xl card-dark overflow-hidden relative"
              data-ocid={`ngo.camp.item.${i + 1}`}
            >
              {/* Poster image */}
              {camp.posterImage && (
                <img
                  src={camp.posterImage}
                  alt={`Poster for ${camp.name}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}

              <div className="p-5">
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setPosterCamp(camp);
                      setPosterOpen(true);
                    }}
                    data-ocid={`ngo.camp.poster.button.${i + 1}`}
                    title="View event poster"
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all hover:scale-110"
                    style={{
                      backgroundColor: "oklch(0.65 0.18 240 / 0.15)",
                      border: "1px solid oklch(0.65 0.18 240 / 0.3)",
                      color: "oklch(0.65 0.18 240)",
                    }}
                  >
                    🪧
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCamp(camp.id, camp.name)}
                    data-ocid={`ngo.camp.delete_button.${i + 1}`}
                    title="Delete camp"
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      backgroundColor: "oklch(0.55 0.22 25 / 0.15)",
                      border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                      color: "oklch(0.62 0.26 25)",
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-start justify-between mb-3 pr-20">
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
                  {camp.interestedCount > 0 && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "oklch(0.72 0.18 60)" }}
                    >
                      <span>🙋</span>
                      <span>{camp.interestedCount} interested</span>
                    </div>
                  )}
                </div>
                <div
                  className="mt-3 pt-3 border-t text-xs text-muted-foreground font-mono"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  {camp.id}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Volunteers Section */}
      <div>
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Users
            className="h-4 w-4"
            style={{ color: "oklch(var(--neon-red))" }}
          />
          Available Volunteers
        </h2>
        {loadingVolunteers ? (
          <div
            className="p-8 text-center"
            data-ocid="ngo.volunteers.loading_state"
          >
            <Loader2
              className="h-6 w-6 animate-spin mx-auto"
              style={{ color: "oklch(var(--neon-red))" }}
            />
          </div>
        ) : volunteers && volunteers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {volunteers.slice(0, 6).map((v, i) => (
              <div
                key={v.userId.toString()}
                data-ocid={`ngo.volunteer.item.${i + 1}`}
                className="rounded-lg card-dark p-4 flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{
                    backgroundColor: "oklch(var(--neon-red) / 0.12)",
                    color: "oklch(var(--neon-red))",
                  }}
                >
                  {v.bloodGroup
                    .toString()
                    .replace("_", "")
                    .replace("Positive", "+")
                    .replace("Negative", "−")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-muted-foreground truncate">
                    {v.userId.toString().slice(0, 12)}...
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.2 140)" }}
                  >
                    {v.availability ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl card-dark p-8 text-center"
            data-ocid="ngo.volunteers.empty_state"
          >
            <p className="text-muted-foreground text-sm">
              No volunteers found yet.
            </p>
          </div>
        )}
      </div>

      <CampPosterDialog
        camp={posterCamp}
        open={posterOpen}
        onOpenChange={(open) => {
          setPosterOpen(open);
          if (!open) setPosterCamp(null);
        }}
      />
      <DeleteAccountSection />
    </main>
  );
}
