import { PulseWave } from "@/components/PulseWave";
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
import { useScrollReveal } from "../hooks/useScrollReveal";

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
  const { actor, isFetching } = useDeviceActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const requests = await actor.getBloodRequests().catch(() => []);
        return { requests: requests.length };
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

const marqueeItems = [
  "🩸 One donation saves up to 3 lives",
  "💉 Blood cannot be manufactured — only donated",
  "❤️ Every 2 seconds someone needs blood",
  "🏥 O- is the universal donor blood type",
  "⚡ Register in under 5 minutes",
  "🌐 Blockchain-secured on Internet Computer",
  "🎖️ Be a hero — donate blood today",
  "🩸 One donation saves up to 3 lives",
  "💉 Blood cannot be manufactured — only donated",
  "❤️ Every 2 seconds someone needs blood",
  "🏥 O- is the universal donor blood type",
  "⚡ Register in under 5 minutes",
  "🌐 Blockchain-secured on Internet Computer",
  "🎖️ Be a hero — donate blood today",
];

const whyLifedropCards = [
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Instant Match",
    desc: "Smart algorithms connect donors with patients in seconds, not hours.",
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-400/10",
    animClass: "animate-shimmer-card",
  },
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Blockchain Secure",
    desc: "All data immutably stored on Internet Computer Protocol. Zero tampering.",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10",
    animClass: "animate-border-glow-blue",
  },
  {
    icon: <Heart className="h-7 w-7" />,
    title: "Save 3 Lives",
    desc: "Each donation can save up to 3 lives. Be someone's hero today.",
    colorClass: "text-red-400",
    bgClass: "bg-red-400/10",
    animClass: "animate-breathe",
  },
];

// Orbiting particles around the logo
const orbitParticles = [
  { delay: "0s", dur: "4s", dist: 80, color: "oklch(0.65 0.28 22)", size: 7 },
  {
    delay: "1s",
    dur: "5s",
    dist: 90,
    color: "oklch(0.65 0.28 22 / 0.7)",
    size: 5,
  },
  {
    delay: "2s",
    dur: "6s",
    dist: 75,
    color: "oklch(0.7 0.2 50 / 0.8)",
    size: 4,
  },
  {
    delay: "0.5s",
    dur: "4.5s",
    dist: 85,
    color: "oklch(0.65 0.28 22 / 0.5)",
    size: 6,
  },
  {
    delay: "1.5s",
    dur: "7s",
    dist: 70,
    color: "oklch(0.8 0.1 20 / 0.6)",
    size: 3,
  },
];

// Particles
const heroParticles = [
  { size: 8, left: "5%", delay: "0s", dur: "6s", top: "70%", shape: "drop" },
  { size: 5, left: "12%", delay: "1s", dur: "8s", top: "80%", shape: "circle" },
  { size: 12, left: "25%", delay: "2s", dur: "7s", top: "75%", shape: "drop" },
  {
    size: 6,
    left: "38%",
    delay: "0.5s",
    dur: "9s",
    top: "85%",
    shape: "circle",
  },
  {
    size: 10,
    left: "50%",
    delay: "1.5s",
    dur: "6.5s",
    top: "72%",
    shape: "drop",
  },
  { size: 4, left: "60%", delay: "3s", dur: "8s", top: "82%", shape: "circle" },
  {
    size: 9,
    left: "70%",
    delay: "2.5s",
    dur: "7.5s",
    top: "78%",
    shape: "drop",
  },
  {
    size: 7,
    left: "80%",
    delay: "0.8s",
    dur: "5.5s",
    top: "88%",
    shape: "circle",
  },
  {
    size: 11,
    left: "18%",
    delay: "1.2s",
    dur: "6.8s",
    top: "68%",
    shape: "drop",
  },
  {
    size: 5,
    left: "32%",
    delay: "2.8s",
    dur: "9.2s",
    top: "92%",
    shape: "circle",
  },
  {
    size: 8,
    left: "45%",
    delay: "0.3s",
    dur: "7.2s",
    top: "65%",
    shape: "drop",
  },
  {
    size: 6,
    left: "55%",
    delay: "1.8s",
    dur: "8.5s",
    top: "90%",
    shape: "circle",
  },
  {
    size: 10,
    left: "72%",
    delay: "3.5s",
    dur: "6.2s",
    top: "76%",
    shape: "drop",
  },
  {
    size: 4,
    left: "85%",
    delay: "2.2s",
    dur: "7.8s",
    top: "84%",
    shape: "circle",
  },
  {
    size: 9,
    left: "92%",
    delay: "0.6s",
    dur: "5.8s",
    top: "71%",
    shape: "drop",
  },
];

/** Inline SVG blood drop — neon red teardrop with glow and highlight */
function BloodDropSvg() {
  return (
    <svg
      viewBox="0 0 140 160"
      width="140"
      height="160"
      aria-hidden="true"
      style={{
        filter:
          "drop-shadow(0 0 18px oklch(0.65 0.28 22 / 0.85)) drop-shadow(0 0 40px oklch(0.65 0.28 22 / 0.5))",
        animation: "float-glow-drop 3s ease-in-out infinite",
      }}
    >
      <defs>
        <radialGradient id="dropGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="oklch(0.78 0.22 22)" />
          <stop offset="55%" stopColor="oklch(0.62 0.28 22)" />
          <stop offset="100%" stopColor="oklch(0.42 0.26 22)" />
        </radialGradient>
        <radialGradient id="dropHighlight" cx="35%" cy="28%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Main blood drop shape — teardrop: pointed top, rounded bottom */}
      <path
        d="M70 8 C70 8 18 62 18 95 C18 126 41 148 70 148 C99 148 122 126 122 95 C122 62 70 8 70 8 Z"
        fill="url(#dropGrad)"
      />
      {/* Inner highlight for 3D glass look */}
      <path
        d="M70 8 C70 8 18 62 18 95 C18 126 41 148 70 148 C99 148 122 126 122 95 C122 62 70 8 70 8 Z"
        fill="url(#dropHighlight)"
      />
      {/* Small specular glint */}
      <ellipse
        cx="50"
        cy="55"
        rx="10"
        ry="16"
        fill="white"
        opacity="0.18"
        transform="rotate(-20 50 55)"
      />
      <style>
        {`
          @keyframes float-glow-drop {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </svg>
  );
}

export function HomePage() {
  const { t } = useApp();
  const { data: backendStats } = useStats();
  const { data: allDonors } = useAllDonors();
  const { data: publicUsers = [] } = usePublicUserList();

  useScrollReveal();

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
      sub: "Active donors",
    },
    {
      label: "Blood Requests",
      value: backendStats ? String(backendStats.requests) : "0",
      icon: <Heart className="h-5 w-5" />,
      sub: "Requests posted",
    },
    {
      label: "Partner Hospitals",
      value: String(hospitalCount),
      icon: <Building2 className="h-5 w-5" />,
      sub: "Registered hospitals",
    },
    {
      label: "Total Users",
      value: String(totalUsersCount),
      icon: <Globe className="h-5 w-5" />,
      sub: "On the platform",
    },
  ];

  const bloodGroupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const bg of bloodGroupKeys) counts[bg.key] = 0;
    if (allDonors) {
      for (const donor of allDonors) {
        const key = String(donor.bloodGroup);
        if (key in counts) counts[key]++;
      }
    }
    return counts;
  }, [allDonors]);

  const maxBloodGroupCount = useMemo(
    () => Math.max(...Object.values(bloodGroupCounts), 1),
    [bloodGroupCounts],
  );

  return (
    <main className="overflow-x-hidden">
      {/* ─── Hero ────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] sm:min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1600x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.07 0.005 20 / 0.97) 0%, oklch(0.07 0.005 20 / 0.82) 50%, oklch(0.58 0.24 25 / 0.12) 100%)",
          }}
        />

        {/* Morphing blobs */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 opacity-20 blur-3xl pointer-events-none animate-blob-morph will-change-transform"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.28 22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-80 h-80 opacity-15 blur-3xl pointer-events-none animate-blob-morph-2 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.28 22 / 0.8) 0%, oklch(0.55 0.2 50 / 0.4) 60%, transparent 80%)",
          }}
        />
        <div
          className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10 blur-2xl pointer-events-none animate-blob-morph will-change-transform"
          style={{
            animationDelay: "4s",
            background:
              "radial-gradient(circle, oklch(0.7 0.2 50) 0%, transparent 70%)",
          }}
        />

        {/* Scan line sweep */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute left-0 right-0 h-px opacity-20 animate-scan-line will-change-transform"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.65 0.28 22), transparent)",
            }}
          />
        </div>

        {/* Aurora sweep */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 h-px w-full opacity-30 animate-aurora"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.65 0.28 22 / 0.6), transparent)",
              animationDelay: "2s",
            }}
          />
        </div>

        {/* Floating blood drop particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroParticles.map((p) => (
            <div
              key={`particle-${p.left}-${p.top}`}
              className="absolute will-change-transform"
              style={{
                width: p.size,
                height: p.size * (p.shape === "drop" ? 1.3 : 1),
                left: p.left,
                top: p.top,
                backgroundColor: "oklch(0.65 0.28 22 / 0.55)",
                boxShadow: `0 0 ${p.size * 2}px oklch(0.65 0.28 22 / 0.5)`,
                borderRadius:
                  p.shape === "drop"
                    ? "50% 50% 50% 50% / 60% 60% 40% 40%"
                    : "50%",
                animation: `float-up ${p.dur} ${p.delay} ease-in infinite`,
              }}
            />
          ))}
        </div>

        {/* Decorative orbit ring with blood drop (desktop only) */}
        <div className="absolute right-8 md:right-16 lg:right-20 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
          <div className="relative w-64 h-64 lg:w-72 lg:h-72 flex items-center justify-center">
            {/* Outer spinning border */}
            <div
              className="absolute inset-0 rounded-full animate-spin-glow will-change-transform"
              style={{
                border: "2px solid transparent",
                background:
                  "linear-gradient(oklch(0.07 0.005 20), oklch(0.07 0.005 20)) padding-box, conic-gradient(oklch(0.65 0.28 22 / 0.8), transparent 60%, oklch(0.65 0.28 22 / 0.4), transparent) border-box",
              }}
            />
            {/* Ripple rings */}
            {["0s", "0.8s", "1.6s"].map((delay) => (
              <div
                key={delay}
                className="absolute inset-4 rounded-full animate-ripple will-change-transform"
                style={{
                  border: "1px solid oklch(0.65 0.28 22 / 0.35)",
                  animationDelay: delay,
                }}
              />
            ))}
            {/* Orbiting particles */}
            {orbitParticles.map((op) => (
              <div
                key={op.delay}
                className="absolute inset-0 flex items-center justify-center will-change-transform"
                style={{
                  animation: `orbit-particle ${op.dur} ${op.delay} linear infinite`,
                }}
              >
                <div
                  style={{
                    width: op.size,
                    height: op.size,
                    borderRadius: "50%",
                    backgroundColor: op.color,
                    boxShadow: `0 0 ${op.size * 2}px ${op.color}`,
                    transform: `translateX(${op.dist}px)`,
                  }}
                />
              </div>
            ))}
            {/* Blood drop SVG — no external image dependency */}
            <div className="relative z-10 flex items-center justify-center">
              <BloodDropSvg />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <div
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: "oklch(0.65 0.28 22 / 0.15)",
                  color: "oklch(0.65 0.28 22)",
                  border: "1px solid oklch(0.65 0.28 22 / 0.3)",
                }}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Platform Live
              </div>
              <Badge variant="outline" className="text-xs">
                Powered by ICP
              </Badge>
            </div>

            {/* Title with neon flicker */}
            <h1
              className="font-display text-5xl md:text-7xl font-black tracking-tight leading-none mb-6 animate-cinema-enter"
              style={{ animationDelay: "0.1s" }}
            >
              <span
                className="animate-neon-flicker animate-glow-text-pulse"
                style={{
                  color: "oklch(0.65 0.28 22)",
                  display: "inline-block",
                }}
              >
                LIFE
              </span>
              <span
                className="neon-text"
                style={{ color: "oklch(0.65 0.28 22)" }}
              >
                DROP
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-semibold mt-2 block animate-shimmer-text">
                {t("tagline")}
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed animate-stagger-wave"
              style={{ animationDelay: "0.3s" }}
            >
              {t("hero_subtitle")}
            </p>

            {/* Pulse wave below subtitle */}
            <div
              className="mb-8 animate-fade-in"
              style={{ animationDelay: "0.25s" }}
            >
              <PulseWave width={400} height={52} />
            </div>
            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-wave-in"
              style={{ animationDelay: "0.35s" }}
            >
              <Link to="/request" data-ocid="hero.emergency.primary_button">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-base font-bold px-8 py-6 btn-magnetic animate-glow-pulse-intense"
                  style={{
                    backgroundColor: "oklch(0.65 0.28 22)",
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
                  className="w-full sm:w-auto text-base font-semibold px-8 py-6 border-primary/50 hover:bg-primary/10 btn-magnetic"
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
                  className="w-full sm:w-auto text-base font-semibold px-8 py-6 text-muted-foreground hover:text-foreground btn-magnetic"
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
          boxShadow: "0 0 12px oklch(var(--neon-red) / 0.4)",
        }}
      />

      {/* ─── ECG Heartbeat animated line ─────────────────────── */}
      <div className="relative overflow-hidden bg-background py-4 flex items-center justify-center">
        <svg
          viewBox="0 0 600 60"
          aria-hidden="true"
          className="w-full max-w-2xl h-12 opacity-60"
          style={{ filter: "drop-shadow(0 0 5px oklch(0.65 0.28 22 / 0.9))" }}
        >
          <polyline
            points="0,30 80,30 100,10 115,50 130,5 145,55 160,30 240,30 260,30 280,10 295,50 310,5 325,55 340,30 420,30 440,30 460,10 475,50 490,5 505,55 520,30 600,30"
            fill="none"
            stroke="oklch(0.65 0.28 22)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="1200"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-dasharray"
              values="0,1200;600,600;1200,0"
              dur="2s"
              repeatCount="indefinite"
            />
          </polyline>
        </svg>
      </div>

      {/* ─── Stats Strip ─────────────────────────────────────── */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                data-ocid={`stats.item.${i + 1}`}
                className="card-glow card-3d rounded-xl p-5 text-center animate-card-emerge"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3"
                  style={{ backgroundColor: "oklch(var(--neon-red) / 0.12)" }}
                >
                  <span style={{ color: "oklch(var(--neon-red))" }}>
                    {stat.icon}
                  </span>
                </div>
                <div className="font-display text-3xl md:text-4xl font-black text-foreground">
                  {stat.value}
                </div>
                {/* Animated underline */}
                <div
                  className="mx-auto mt-1.5 mb-1 h-0.5 rounded-full animate-shimmer-line"
                  style={{
                    width: "40%",
                    background:
                      "linear-gradient(90deg, transparent, oklch(0.65 0.28 22), transparent)",
                  }}
                />
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto text-center scroll-reveal">
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

      {/* ─── Why LIFEDROP ────────────────────────────────────── */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-6 scroll-reveal">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{
              backgroundColor: "oklch(var(--neon-red) / 0.1)",
              color: "oklch(var(--neon-red))",
              border: "1px solid oklch(var(--neon-red) / 0.2)",
            }}
          >
            <Activity className="h-3 w-3" />
            Why LIFEDROP
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
            Built different. Built better.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyLifedropCards.map((card, i) => (
            <div
              key={card.title}
              className={`relative p-7 rounded-2xl card-dark card-3d scroll-reveal border overflow-hidden group ${
                i === 2 ? "animate-breathe" : ""
              }`}
              style={{
                transitionDelay: `${i * 0.15}s`,
                borderColor: "oklch(var(--neon-red) / 0.2)",
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none animate-shimmer-overlay" />
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${card.bgClass} ${card.colorClass}`}
              >
                {card.icon}
              </div>
              <h3
                className={`font-display text-xl font-black mb-3 ${card.colorClass}`}
              >
                {card.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {card.desc}
              </p>
              {/* Animated bottom glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 animate-shimmer-line"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.65 0.28 22 / 0.5), transparent)",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────── */}
      <section className="bg-card/30 border-y border-border py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 scroll-reveal">
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
                className="relative p-6 rounded-xl card-dark card-3d group hover:border-primary/40 transition-all scroll-reveal"
                style={{
                  transitionDelay: `${i * 0.15}s`,
                }}
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

      {/* ─── Blood Group Strip ───────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-6 scroll-reveal">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
            Blood Supply Status
          </h2>
          <p className="text-muted-foreground">
            Real-time donor availability across all blood groups
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {bloodGroupKeys.map((bg, idx) => {
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
                className="p-4 rounded-xl card-dark card-3d hover:border-primary/30 transition-all group scroll-reveal"
                style={{ ...glowStyle, transitionDelay: `${idx * 0.05}s` }}
              >
                <div
                  className="font-display text-2xl font-black text-center mb-3"
                  style={{ color: "oklch(var(--neon-red))" }}
                >
                  {bg.label}
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:opacity-90"
                    style={{ width: `${barWidth}%`, backgroundColor: barColor }}
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
        className="py-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--neon-red) / 0.05) 0%, transparent 50%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{
                  backgroundColor: "oklch(var(--neon-red) / 0.1)",
                  color: "oklch(var(--neon-red))",
                  border: "1px solid oklch(var(--neon-red) / 0.2)",
                }}
              >
                <Globe className="h-3 w-3" />
                NGOs and Camps
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
                <Button
                  variant="outline"
                  className="border-primary/50 btn-magnetic"
                >
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
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className="p-5 rounded-xl card-dark card-3d text-center scroll-reveal"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-3xl mb-2 animate-breathe">
                    {item.icon}
                  </div>
                  <div className="font-display text-xl font-bold text-foreground">
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

      {/* ─── Live Activity ───────────────────────────────────── */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto scroll-reveal">
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: "oklch(0.10 0.005 20 / 0.9)",
              borderColor: "oklch(0.22 0.01 20)",
              boxShadow: "0 0 30px oklch(0 0 0 / 0.4)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-bold text-green-400 uppercase tracking-widest">
                System Online
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                Live Activity
              </span>
            </div>
            {/* Empty state — no fake data */}
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Activity
                className="h-8 w-8 opacity-20"
                style={{ color: "oklch(0.65 0.28 22)" }}
              />
              <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
                Activity will appear here as users register, submit blood
                requests, and fulfill donations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pulsing awareness marquee ───────────────────────── */}
      <div
        className="overflow-hidden py-3 border-y"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.65 0.28 22 / 0.08), oklch(0.65 0.28 22 / 0.04))",
          borderColor: "oklch(0.65 0.28 22 / 0.2)",
        }}
      >
        <div
          className="flex gap-12 whitespace-nowrap text-sm font-semibold"
          style={{
            color: "oklch(0.65 0.28 22)",
            animation: "marquee 25s linear infinite",
          }}
        >
          {marqueeItems.map((fact, i) => (
            <span
              key={`marquee-${i}-${fact.slice(0, 10)}`}
              className="flex items-center gap-2"
            >
              {fact}
              <span style={{ color: "oklch(0.22 0.01 20)" }}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-8">
        <div
          className="rounded-2xl p-8 md:p-12 text-center relative overflow-hidden scroll-reveal animate-glow-pulse-intense"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--neon-red) / 0.15) 0%, oklch(var(--neon-red) / 0.05) 100%)",
            border: "1px solid oklch(var(--neon-red) / 0.35)",
          }}
        >
          {/* Large blurred blob inside CTA */}
          <div
            className="absolute inset-0 opacity-15 blur-3xl pointer-events-none animate-blob-morph"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, oklch(0.65 0.28 22) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-8"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, oklch(var(--neon-red)) 0%, transparent 70%)",
            }}
          />
          {/* 5 ripple rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none">
            {["0s", "0.6s", "1.2s", "1.8s", "2.4s"].map((delay) => (
              <div
                key={delay}
                className="absolute inset-0 rounded-full animate-ripple will-change-transform"
                style={{
                  border: "2px solid oklch(0.65 0.28 22 / 0.25)",
                  animationDelay: delay,
                }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <div className="text-4xl mb-4 animate-float-glow inline-block">
              🩸
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black mb-4">
              Ready to save a life?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join donors already on LIFEDROP. Your blood can save up to 3
              lives.
            </p>
            {/* Pulse wave */}
            <div className="flex justify-center mb-6">
              <PulseWave width={320} height={44} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" data-ocid="cta.register.primary_button">
                <Button
                  size="lg"
                  className="text-base font-bold px-10 btn-magnetic"
                  style={{
                    backgroundColor: "oklch(var(--neon-red))",
                    color: "white",
                  }}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Register Now — It is Free
                </Button>
              </Link>
              <Link to="/search" data-ocid="cta.search.secondary_button">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base border-primary/50 btn-magnetic"
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
