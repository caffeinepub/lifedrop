import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Building2,
  ChevronRight,
  Clock,
  Droplets,
  Globe,
  Heart,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import { useApp } from "../contexts/AppContext";
import { useDeviceActor } from "../hooks/useDeviceActor";
import {
  countRoleInList,
  useAllDonors,
  usePublicUserList,
} from "../hooks/useQueries";

const bloodGroupKeys = [
  { key: "A_Positive", label: "A+" },
  { key: "A_Negative", label: "A−" },
  { key: "B_Positive", label: "B+" },
  { key: "B_Negative", label: "B−" },
  { key: "AB_Positive", label: "AB+" },
  { key: "AB_Negative", label: "AB−" },
  { key: "O_Positive", label: "O+" },
  { key: "O_Negative", label: "O−" },
];

function useStats() {
  // getBloodRequests() requires #user permission — use device actor
  const { actor, isFetching } = useDeviceActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const requests = await actor.getBloodRequests().catch(() => []);
        return {
          requests: requests.length,
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

const howItWorksSteps = [
  {
    icon: <Users className="h-6 w-6" />,
    step: "01",
    title: "Register & Verify",
    desc: "Create your profile as a donor, patient, or hospital. Verification ensures trust.",
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    step: "02",
    title: "Submit Request",
    desc: "Patients or hospitals submit emergency blood requests with urgency level.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    step: "03",
    title: "Instant Match",
    desc: "Our system instantly alerts nearby compatible donors and blood banks.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    step: "04",
    title: "Save a Life",
    desc: "Donors respond, blood is delivered, a life is saved. Track everything in real-time.",
  },
];

export function HomePage() {
  const { t } = useApp();
  const { data: backendStats } = useStats();
  const { data: allDonors } = useAllDonors();
  const { data: publicUsers = [] } = usePublicUserList();

  // All counts derived from publicUserList (no auth required, always accurate)
  const donorCount = useMemo(
    () => countRoleInList(publicUsers, "donor"),
    [publicUsers],
  );
  const hospitalCount = useMemo(
    () => countRoleInList(publicUsers, "hospital"),
    [publicUsers],
  );
  const totalUsersCount = publicUsers.length;

  const stats = [
    {
      label: "Registered Donors",
      value: String(donorCount),
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Blood Requests",
      value: backendStats ? String(backendStats.requests) : "0",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      label: "Partner Hospitals",
      value: String(hospitalCount),
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Total Users",
      value: String(totalUsersCount),
      icon: <Globe className="h-5 w-5" />,
    },
  ];

  // Real per-blood-group counts from backend
  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const bg of bloodGroupKeys) {
      counts[bg.key] = 0;
    }
    if (allDonors) {
      for (const donor of allDonors) {
        const key = String(donor.bloodGroup);
        if (key in counts) {
          counts[key]++;
        }
      }
    }
    return counts;
  }, [allDonors]);

  const maxBloodGroupCount = useMemo(() => {
    return Math.max(...Object.values(bloodGroupCounts), 1);
  }, [bloodGroupCounts]);

  return (
    <main>
      {/* ─── Hero ────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1600x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.085 0 0 / 0.95) 0%, oklch(0.085 0 0 / 0.8) 50%, oklch(0.58 0.24 25 / 0.15) 100%)",
          }}
        />

        {/* Animated blood drop decoration */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
          <div className="animate-blood-drop">
            <img
              src="/assets/generated/lifedrop-logo.dim_200x200.png"
              alt=""
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <div
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.15)",
                  color: "oklch(var(--neon-red))",
                  border: "1px solid oklch(var(--neon-red) / 0.3)",
                }}
              >
                <Activity className="h-3 w-3 animate-pulse" />
                Platform Live
              </div>
              <Badge variant="outline" className="text-xs">
                Powered by ICP
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight leading-none mb-6 animate-slide-in-up">
              LIFE
              <span
                className="neon-text"
                style={{ color: "oklch(var(--neon-red))" }}
              >
                DROP
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-semibold text-muted-foreground mt-2 block">
                {t("tagline")}
              </span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed animate-slide-in-up">
              {t("hero_subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-up">
              <Link to="/request" data-ocid="hero.emergency.primary_button">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-bold px-8 py-6 animate-glow-border"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t("emergency_btn")}
                </Button>
              </Link>

              <Link to="/register" data-ocid="hero.donor.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base font-semibold px-8 py-6 border-primary/50 hover:bg-primary/10"
                >
                  <Droplets className="h-5 w-5 mr-2" />
                  {t("become_donor")}
                </Button>
              </Link>

              <Link
                to="/register"
                search={{ role: "hospital" }}
                data-ocid="hero.hospital.secondary_button"
              >
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-base font-semibold px-8 py-6 text-muted-foreground hover:text-foreground"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  {t("register_hospital")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, transparent, oklch(var(--background)))",
          }}
        />
      </section>

      {/* ─── Glowing divider ─────────────────────────────────── */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(var(--neon-red) / 0.4) 30%, oklch(var(--neon-red) / 0.6) 50%, oklch(var(--neon-red) / 0.4) 70%, transparent)",
          boxShadow: "0 0 10px oklch(var(--neon-red) / 0.3)",
        }}
      />

      {/* ─── Stats Strip ─────────────────────────────────────── */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-glow rounded-xl p-5 text-center animate-pulse-glow"
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3"
                  style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
                >
                  <span style={{ color: "oklch(var(--neon-red))" }}>
                    {stat.icon}
                  </span>
                </div>
                <div className="font-display text-3xl md:text-4xl font-black text-foreground transition-all duration-500">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{
              backgroundColor: "oklch(var(--neon-red) / 0.1)",
              color: "oklch(var(--neon-red))",
              border: "1px solid oklch(var(--neon-red) / 0.2)",
            }}
          >
            <Shield className="h-3 w-3" />
            Our Mission
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black mb-6 leading-tight">
            Bridging the gap between{" "}
            <span style={{ color: "oklch(var(--neon-red))" }}>donors</span> and{" "}
            <span style={{ color: "oklch(var(--neon-red))" }}>patients</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every 2 seconds, someone in India needs blood. LIFEDROP uses
            blockchain technology on the Internet Computer Protocol to create a
            transparent, reliable platform where no one dies waiting for blood.
          </p>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────── */}
      <section className="bg-card/30 border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Four simple steps to save a life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, i) => (
              <div
                key={step.step}
                className="relative p-6 rounded-xl card-dark group hover:border-primary/40 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: "oklch(var(--neon-red) / 0.12)",
                      color: "oklch(var(--neon-red))",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <div
                      className="text-xs font-mono font-bold mb-1"
                      style={{ color: "oklch(var(--neon-red) / 0.6)" }}
                    >
                      STEP {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
                {i < howItWorksSteps.length - 1 && (
                  <ChevronRight
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block text-border"
                    size={20}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Blood Group Strip (Real Data) ───────────────────── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
            Blood Supply Status
          </h2>
          <p className="text-muted-foreground">
            Real-time donor availability across all blood groups
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {bloodGroupKeys.map((bg) => {
            const count = bloodGroupCounts[bg.key] ?? 0;
            const barWidth = (count / maxBloodGroupCount) * 100;
            const barColor =
              count === 0
                ? "oklch(0.35 0 0)"
                : count < 3
                  ? "oklch(0.65 0.22 40)"
                  : count < 7
                    ? "oklch(0.75 0.15 90)"
                    : "oklch(0.62 0.22 140)";

            const glowStyle =
              count === 0
                ? {}
                : count < 3
                  ? {
                      boxShadow:
                        "0 0 10px oklch(0.75 0.18 70 / 0.2), 0 0 20px oklch(0.75 0.18 70 / 0.1)",
                    }
                  : {
                      boxShadow:
                        "0 0 12px oklch(0.65 0.2 140 / 0.25), 0 0 24px oklch(0.65 0.2 140 / 0.12)",
                    };

            return (
              <div
                key={bg.key}
                className="p-4 rounded-xl card-dark hover:border-primary/30 transition-all group"
                style={glowStyle}
              >
                <div
                  className="font-display text-2xl font-black text-center mb-3"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  {bg.label}
                </div>
                {/* Mini bar */}
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:opacity-90"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {count === 0
                    ? "No donors"
                    : `${count} donor${count !== 1 ? "s" : ""}`}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── NGO / Camps Section ─────────────────────────────── */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--neon-red) / 0.05) 0%, transparent 50%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.1)",
                  color: "oklch(var(--neon-red))",
                  border: "1px solid oklch(var(--neon-red) / 0.2)",
                }}
              >
                <Globe className="h-3 w-3" />
                NGOs & Camps
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-black mb-4">
                Organize{" "}
                <span style={{ color: "oklch(var(--neon-red))" }}>
                  Blood Donation Camps
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                NGOs and community organizations can organize blood donation
                camps, coordinate volunteers, and track donation events — all
                from one dashboard.
              </p>
              <Link
                to="/register"
                search={{ role: "ngo" }}
                data-ocid="home.ngo.secondary_button"
              >
                <Button variant="outline" className="border-primary/50">
                  Register as NGO
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Blood Requests",
                  value: backendStats ? String(backendStats.requests) : "0",
                  icon: "🏕️",
                },
                {
                  label: "Registered Users",
                  value: String(totalUsersCount),
                  icon: "🙌",
                },
                {
                  label: "Total Donors",
                  value: String(donorCount),
                  icon: "🩸",
                },
                {
                  label: "Hospitals",
                  value: String(hospitalCount),
                  icon: "🏨",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-xl card-dark text-center"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-display text-xl font-bold text-foreground transition-all duration-500">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div
          className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--neon-red) / 0.15) 0%, oklch(var(--neon-red) / 0.05) 100%)",
            border: "1px solid oklch(var(--neon-red) / 0.3)",
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, oklch(var(--neon-red)) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <div className="text-4xl mb-4">🩸</div>
            <h2 className="font-display text-3xl md:text-5xl font-black mb-4">
              Ready to save a life?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join donors already on LIFEDROP. Your blood can save up to 3
              lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" data-ocid="cta.register.primary_button">
                <Button
                  size="lg"
                  className="text-base font-bold px-10"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Register Now — It's Free
                </Button>
              </Link>
              <Link to="/search" data-ocid="cta.search.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base border-primary/50"
                >
                  Find a Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
