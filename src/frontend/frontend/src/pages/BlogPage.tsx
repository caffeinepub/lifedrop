import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight } from "lucide-react";
import { BloodCellDecor } from "../components/BloodCellDecor";

const posts = [
  {
    id: 1,
    title: "Benefits of Blood Donation: Why Your Body Loves It",
    category: "Health",
    date: "March 5, 2026",
    excerpt:
      "Donating blood doesn't just save lives — it benefits the donor too. Regular blood donation reduces iron levels, lowers cardiovascular risk, and triggers the production of fresh red blood cells.",
    content: [
      "Donating blood is one of the most selfless acts anyone can do, but did you know it also benefits the donor?",
      "Regular donation reduces excess iron in the body, which has been linked to heart disease and cancer. Each donation stimulates the production of fresh red blood cells, improving oxygen transport.",
      "Studies show that regular donors live longer and have lower rates of certain cancers. The mini health check before each donation also helps detect conditions like anemia and high blood pressure early.",
    ],
    emoji: "❤️",
    color: "oklch(0.62 0.22 25)",
    tags: ["Health Benefits", "Donor Wellness"],
  },
  {
    id: 2,
    title: "Who Can Donate Blood? A Complete Eligibility Guide",
    category: "Education",
    date: "February 28, 2026",
    excerpt:
      "Think you might not be eligible? Most healthy adults can donate blood. Learn about age requirements, health conditions, medications, and more in this comprehensive guide.",
    content: [
      "Most healthy adults aged 18-65 who weigh at least 50kg can donate blood. You should wait at least 56 days (8 weeks) between whole blood donations.",
      "You cannot donate if you have received a blood transfusion in the past 12 months, have tested positive for HIV, or have active cancer treatment.",
      "Common medications like blood thinners or recent antibiotics may temporarily defer you. Always consult the health screening team at the donation center.",
    ],
    emoji: "🩺",
    color: "oklch(0.55 0.2 240)",
    tags: ["Eligibility", "Guidelines"],
  },
  {
    id: 3,
    title: "Blood Donation Myths Debunked Once and For All",
    category: "Awareness",
    date: "February 20, 2026",
    excerpt:
      'From "donating makes you weak" to "it hurts terribly" — we tackle the most common misconceptions about blood donation that stop people from saving lives.',
    content: [
      "Myth 1: Blood donation makes you weak for days. Fact: Most donors feel fine immediately after. Your body replaces the plasma within 24 hours and red blood cells within 4-6 weeks.",
      "Myth 2: You can get HIV from donating blood. Fact: Sterile, single-use needles are used for every donation. There is zero risk of infection from donating.",
      "Myth 3: People with tattoos can't donate. Fact: You can donate 6-12 months after getting a tattoo from a licensed parlor. Many tattooed people are active donors.",
    ],
    emoji: "🔬",
    color: "oklch(0.62 0.2 200)",
    tags: ["Myths", "Facts"],
  },
  {
    id: 4,
    title: "Is Blood Donation Safe? Everything You Need to Know",
    category: "Safety",
    date: "February 12, 2026",
    excerpt:
      "Modern blood collection is one of the safest medical procedures. Learn about the rigorous safety protocols, what to expect, and how to prepare for your donation.",
    content: [
      "Blood donation is extremely safe for healthy adults. Before each donation, you'll undergo a mini health screening including blood pressure, hemoglobin, and pulse check.",
      "You'll donate approximately 450ml of blood — less than 10% of your total blood volume. This amount is safely replenished by your body within weeks.",
      "After donation, rest for 10-15 minutes and have a light snack. Avoid heavy lifting or strenuous exercise for the rest of the day. Stay well hydrated.",
    ],
    emoji: "🛡️",
    color: "oklch(0.62 0.18 140)",
    tags: ["Safety", "Procedures"],
  },
  {
    id: 5,
    title: "The Role of NGOs in India's Blood Supply Chain",
    category: "NGO",
    date: "January 30, 2026",
    excerpt:
      "NGOs are the backbone of voluntary blood donation in India. Discover how organizations across the country are bridging the gap between donors and patients.",
    content: [
      "India needs approximately 14 million units of blood annually, but only about 11 million units are collected. NGOs play a critical role in bridging this 3 million unit gap.",
      "From organizing camps in colleges to mobilizing communities during festivals, NGOs create awareness and motivate first-time donors who might otherwise never visit a blood bank.",
      "LIFEDROP partners with NGOs to digitize camp management, track donation outcomes, and recognize top volunteer contributors.",
    ],
    emoji: "🤝",
    color: "oklch(0.65 0.16 60)",
    tags: ["NGO", "Community"],
  },
  {
    id: 6,
    title: "Understanding Blood Components: Whole Blood vs. Plasma",
    category: "Education",
    date: "January 22, 2026",
    excerpt:
      "Did you know one donation can be separated into multiple components to help different patients? Learn about whole blood, plasma, platelets, and red cell components.",
    content: [
      "A single blood donation can be separated into three components: red blood cells, platelets, and plasma. This means one donation can potentially help up to three patients.",
      "Red blood cells carry oxygen and are used for anemia and surgical patients. Platelets help blood clot and are vital for cancer patients undergoing chemotherapy.",
      "Plasma contains proteins and antibodies and is used to treat burns, liver disease, and coagulation disorders. Fresh Frozen Plasma (FFP) has a 12-month shelf life.",
    ],
    emoji: "🧬",
    color: "oklch(0.58 0.2 320)",
    tags: ["Education", "Science"],
  },
];

const bloodGroups = [
  {
    group: "A+",
    canGive: "A+, AB+",
    canReceive: "A+, A-, O+, O-",
    color: "oklch(0.62 0.25 22)",
  },
  {
    group: "A-",
    canGive: "A+, A-, AB+, AB-",
    canReceive: "A-, O-",
    color: "oklch(0.55 0.22 22)",
  },
  {
    group: "B+",
    canGive: "B+, AB+",
    canReceive: "B+, B-, O+, O-",
    color: "oklch(0.62 0.22 200)",
  },
  {
    group: "B-",
    canGive: "B+, B-, AB+, AB-",
    canReceive: "B-, O-",
    color: "oklch(0.55 0.2 200)",
  },
  {
    group: "AB+",
    canGive: "AB+ only",
    canReceive: "All types",
    color: "oklch(0.62 0.2 280)",
  },
  {
    group: "AB-",
    canGive: "AB+, AB-",
    canReceive: "A-, B-, AB-, O-",
    color: "oklch(0.55 0.18 280)",
  },
  {
    group: "O+",
    canGive: "A+, B+, AB+, O+",
    canReceive: "O+, O-",
    color: "oklch(0.62 0.22 140)",
  },
  {
    group: "O-",
    canGive: "All types",
    canReceive: "O- only",
    color: "oklch(0.55 0.22 140)",
  },
];

const bloodFacts = [
  {
    num: "4.5M",
    label: "Donations Every Year in India",
    color: "oklch(0.65 0.28 22)",
    icon: "🩸",
  },
  {
    num: "3x",
    label: "Lives Saved Per Donation",
    color: "oklch(0.62 0.22 140)",
    icon: "💚",
  },
  {
    num: "56",
    label: "Days Between Whole Blood Donations",
    color: "oklch(0.62 0.2 240)",
    icon: "⏱️",
  },
  {
    num: "7%",
    label: "Of People Have O- Universal Donor Type",
    color: "oklch(0.65 0.2 60)",
    icon: "🌍",
  },
];

export function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-cinema-enter">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6"
          style={{
            backgroundColor: "oklch(var(--neon-red) / 0.1)",
            color: "oklch(var(--neon-red))",
            border: "1px solid oklch(var(--neon-red) / 0.25)",
          }}
        >
          <BookOpen className="h-4 w-4" />
          Awareness & Education
        </div>
        <h1 className="font-display text-4xl font-black mb-3">
          Blood Donation Blog
        </h1>
        <p className="text-muted-foreground">
          Facts, guides, and stories about blood donation and saving lives
        </p>
      </div>

      {/* Featured Post */}
      <div
        className="mb-10 rounded-2xl p-8 relative overflow-hidden"
        style={{
          border: `1px solid ${posts[0].color.replace(")", " / 0.3)")}`,
          backgroundColor: `${posts[0].color.replace(")", " / 0.06)")}`,
        }}
      >
        <div
          className="absolute top-4 right-4 text-6xl opacity-20"
          aria-hidden="true"
        >
          {posts[0].emoji}
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              style={{
                borderColor: posts[0].color.replace(")", " / 0.4)"),
                color: posts[0].color,
              }}
            >
              {posts[0].category}
            </Badge>
            <span className="text-xs text-muted-foreground">Featured</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-black mb-3">
            {posts[0].title}
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {posts[0].excerpt}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post, i) => (
          <article
            key={post.id}
            data-ocid={`blog.post.item.${i + 1}`}
            className="rounded-xl card-dark hover:border-primary/30 transition-all cursor-pointer group animate-card-emerge"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${post.color.replace(")", " / 0.1)")}`,
                  }}
                >
                  {post.emoji}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform mt-3.5" />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: `${post.color.replace(")", " / 0.3)")}`,
                    color: post.color,
                  }}
                >
                  {post.category}
                </Badge>
              </div>

              <h3 className="font-semibold mb-2 leading-snug group-hover:text-foreground transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Full content */}
            <div
              className="px-6 pb-5 border-t"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              <ul className="mt-4 space-y-2">
                {post.content.map((para) => (
                  <li
                    key={para.slice(0, 30)}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-4 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "oklch(var(--secondary))",
                      color: "oklch(var(--muted-foreground))",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div
        className="mt-16 text-center p-8 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--neon-red) / 0.08) 0%, transparent 100%)",
          border: "1px solid oklch(var(--neon-red) / 0.15)",
        }}
      >
        <div className="text-3xl mb-3">🩸</div>
        <h3 className="font-display text-2xl font-bold mb-2">
          Knowledge is the first step
        </h3>
        <p className="text-muted-foreground mb-4">
          Now that you know the facts, take the next step and register as a
          donor.
        </p>
      </div>

      {/* ── Animated Blood Science Section ── */}
      <div
        className="mt-20 relative overflow-hidden"
        data-ocid="blog.science.section"
      >
        <style>{`
          @keyframes spinOrbit {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes bloodPulse {
            0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 12px oklch(0.65 0.28 22 / 0.6)); }
            50%       { transform: scale(1.07) translateY(-7px); filter: drop-shadow(0 0 28px oklch(0.65 0.28 22 / 0.95)); }
          }
          @keyframes pulseRing {
            0%   { opacity: 0.55; transform: scale(0.75); }
            100% { opacity: 0;    transform: scale(1.9); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(32px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.65); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes floatUp {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-8px); }
          }
          @keyframes orbitDot1 {
            from { transform: rotate(0deg) translateX(130px) rotate(0deg); }
            to   { transform: rotate(360deg) translateX(130px) rotate(-360deg); }
          }
          @keyframes orbitDot2 {
            from { transform: rotate(180deg) translateX(100px) rotate(-180deg); }
            to   { transform: rotate(540deg) translateX(100px) rotate(-540deg); }
          }
          @keyframes shimmerText {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
        `}</style>

        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{
              background: "oklch(0.65 0.28 22 / 0.1)",
              border: "1px solid oklch(0.65 0.28 22 / 0.25)",
              color: "oklch(0.65 0.28 22)",
            }}
          >
            The Science of Saving Lives
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-black mb-3">
            Blood Donation{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.7 0.28 22), oklch(0.65 0.25 350), oklch(0.7 0.28 22))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmerText 3s linear infinite",
              }}
            >
              Science
            </span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The biology behind every life-saving drop
          </p>
        </div>

        {/* 3D animated content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Animated 3D Blood Drop + orbiting rings */}
          <div
            className="flex justify-center items-center relative"
            style={{ height: "380px" }}
            aria-hidden="true"
          >
            {/* Background glow */}
            <div
              className="absolute"
              style={{
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, oklch(0.65 0.28 22 / 0.08) 0%, transparent 70%)",
              }}
            />

            {/* Outer orbit ring 1 */}
            <div
              className="absolute"
              style={{
                width: "300px",
                height: "300px",
                border: "1px solid oklch(0.65 0.28 22 / 0.2)",
                borderRadius: "50%",
                animation: "spinOrbit 14s linear infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-7px",
                  left: "50%",
                  width: "14px",
                  height: "14px",
                  backgroundColor: "oklch(0.65 0.28 22)",
                  borderRadius: "50%",
                  boxShadow: "0 0 12px oklch(0.65 0.28 22)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            {/* Orbit ring 2 — reverse */}
            <div
              className="absolute"
              style={{
                width: "240px",
                height: "240px",
                border: "1px solid oklch(0.62 0.2 200 / 0.22)",
                borderRadius: "50%",
                animation: "spinOrbit 9s linear infinite reverse",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "-6px",
                  left: "50%",
                  width: "11px",
                  height: "11px",
                  backgroundColor: "oklch(0.62 0.2 200)",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px oklch(0.62 0.2 200)",
                  transform: "translateX(-50%)",
                }}
              />
            </div>

            {/* Orbit ring 3 — diagonal */}
            <div
              className="absolute"
              style={{
                width: "190px",
                height: "190px",
                border: "1px dashed oklch(0.62 0.18 280 / 0.2)",
                borderRadius: "50%",
                animation: "spinOrbit 6s linear infinite",
                transform: "rotateX(60deg)",
              }}
            />

            {/* Centre: Large animated blood drop */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                animation: "bloodPulse 3.2s ease-in-out infinite",
              }}
            >
              <svg
                width="108"
                height="130"
                viewBox="0 0 100 120"
                fill="none"
                role="img"
                aria-label="Animated blood drop illustration"
              >
                <title>Blood Drop</title>
                <defs>
                  <linearGradient id="dropGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="oklch(0.72 0.27 22)"
                      stopOpacity="0.9"
                    />
                    <stop
                      offset="100%"
                      stopColor="oklch(0.42 0.3 12)"
                      stopOpacity="1"
                    />
                  </linearGradient>
                  <filter id="dropGlow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M50 5 C50 5, 8 56, 8 76 C8 98 27 116 50 116 C73 116 92 98 92 76 C92 56 50 5 50 5Z"
                  fill="url(#dropGrad2)"
                  filter="url(#dropGlow)"
                />
                <path
                  d="M50 5 C50 5, 8 56, 8 76 C8 98 27 116 50 116 C73 116 92 98 92 76 C92 56 50 5 50 5Z"
                  fill="none"
                  stroke="oklch(0.82 0.24 22 / 0.5)"
                  strokeWidth="1.5"
                />
                {/* Highlight shine */}
                <ellipse
                  cx="34"
                  cy="55"
                  rx="7"
                  ry="14"
                  fill="white"
                  opacity="0.22"
                  transform="rotate(-22 34 55)"
                />
                {/* Inner cell icon */}
                <circle
                  cx="50"
                  cy="82"
                  r="13"
                  fill="oklch(0.32 0.24 10 / 0.55)"
                />
                <text
                  x="50"
                  y="87"
                  textAnchor="middle"
                  fontSize="11"
                  fill="white"
                  fontWeight="bold"
                >
                  RBC
                </text>
              </svg>
            </div>

            {/* Pulse rings emanating from the drop */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${70 + i * 44}px`,
                  height: `${70 + i * 44}px`,
                  border: "1px solid oklch(0.65 0.28 22 / 0.18)",
                  animation: `pulseRing 3s ease-out ${i * 1}s infinite`,
                }}
              />
            ))}

            {/* Floating micro-labels */}
            {[
              {
                label: "Haemoglobin",
                top: "10%",
                left: "2%",
                color: "oklch(0.65 0.28 22)",
              },
              {
                label: "Plasma 55%",
                top: "70%",
                left: "5%",
                color: "oklch(0.62 0.2 200)",
              },
              {
                label: "Platelets",
                top: "18%",
                right: "4%",
                color: "oklch(0.62 0.2 280)",
              },
              {
                label: "RBC 45%",
                top: "72%",
                right: "2%",
                color: "oklch(0.62 0.2 140)",
              },
            ].map((lbl) => (
              <div
                key={lbl.label}
                className="absolute text-xs font-bold px-2 py-1 rounded-lg"
                style={{
                  top: lbl.top,
                  left: "left" in lbl ? lbl.left : undefined,
                  right: "right" in lbl ? lbl.right : undefined,
                  color: lbl.color,
                  background: `${lbl.color.replace(")", " / 0.1)")}`,
                  border: `1px solid ${lbl.color.replace(")", " / 0.3)")}`,
                  animation: `floatUp 4s ease-in-out ${Math.random() * 2}s infinite`,
                  whiteSpace: "nowrap",
                }}
              >
                {lbl.label}
              </div>
            ))}
          </div>

          {/* Right: Animated fact cards */}
          <div className="space-y-4">
            {bloodFacts.map((fact, i) => (
              <div
                key={fact.label}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: `${fact.color.replace(")", " / 0.07)")}`,
                  border: `1px solid ${fact.color.replace(")", " / 0.22)")}`,
                  animation: `slideInRight 0.6s ease-out ${i * 0.12 + 0.15}s both`,
                }}
              >
                <div className="text-3xl">{fact.icon}</div>
                <div>
                  <div
                    className="text-3xl font-black leading-none"
                    style={{ color: fact.color }}
                  >
                    {fact.num}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {fact.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blood Group Compatibility Grid */}
        <div
          className="mt-14 p-6 md:p-8 rounded-2xl"
          style={{
            background: "oklch(var(--card))",
            border: "1px solid oklch(var(--border))",
          }}
          data-ocid="blog.compatibility.card"
        >
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-center">
            Blood Group Compatibility
          </h3>
          <p className="text-xs text-muted-foreground text-center mb-6">
            Hover over each type to see who can give and receive
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {bloodGroups.map((bg, i) => (
              <div
                key={bg.group}
                data-ocid={`blog.bloodgroup.item.${i + 1}`}
                className="text-center p-3 rounded-xl cursor-pointer hover:scale-110 transition-transform group relative"
                style={{
                  background: `${bg.color.replace(")", " / 0.09)")}`,
                  border: `1px solid ${bg.color.replace(")", " / 0.28)")}`,
                  animation: `scaleIn 0.45s ease-out ${i * 0.055}s both`,
                }}
                title={`Can give to: ${bg.canGive} | Can receive from: ${bg.canReceive}`}
              >
                <div
                  className="font-black text-xl leading-none"
                  style={{ color: bg.color }}
                >
                  {bg.group}
                </div>
                {/* Tooltip on hover */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ minWidth: "140px" }}
                >
                  <div
                    className="text-xs rounded-lg p-2 text-left"
                    style={{
                      background: "oklch(var(--popover))",
                      border: `1px solid ${bg.color.replace(")", " / 0.35)")}`,
                      color: "oklch(var(--popover-foreground))",
                    }}
                  >
                    <div
                      className="font-semibold mb-1"
                      style={{ color: bg.color }}
                    >
                      Gives to:
                    </div>
                    <div className="mb-1">{bg.canGive}</div>
                    <div
                      className="font-semibold mb-1"
                      style={{ color: bg.color }}
                    >
                      Receives from:
                    </div>
                    <div>{bg.canReceive}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation process timeline */}
        <div className="mt-12">
          <h3 className="font-display text-xl font-bold text-center mb-8">
            What Happens During a Donation?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Registration",
                desc: "Fill a quick health form and show ID",
                icon: "📋",
                color: "oklch(0.62 0.25 22)",
              },
              {
                step: "02",
                title: "Screening",
                desc: "BP, Hb level, and pulse check in minutes",
                icon: "🩺",
                color: "oklch(0.62 0.2 200)",
              },
              {
                step: "03",
                title: "Donation",
                desc: "450ml collected in 8-10 minutes only",
                icon: "🩸",
                color: "oklch(0.62 0.22 280)",
              },
              {
                step: "04",
                title: "Refresh",
                desc: "Rest 10 mins, have juice and a snack",
                icon: "🧃",
                color: "oklch(0.62 0.2 140)",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="relative p-5 rounded-xl text-center"
                style={{
                  background: `${s.color.replace(")", " / 0.07)")}`,
                  border: `1px solid ${s.color.replace(")", " / 0.2)")}`,
                  animation: `scaleIn 0.5s ease-out ${i * 0.1 + 0.2}s both`,
                }}
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div
                  className="text-xs font-black tracking-widest mb-1"
                  style={{ color: `${s.color.replace(")", " / 0.5)")}` }}
                >
                  STEP {s.step}
                </div>
                <div className="font-bold mb-1" style={{ color: s.color }}>
                  {s.title}
                </div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
                {/* Connector line (not on last item) */}
                {i < 3 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-2 w-4 h-px"
                    style={{ background: `${s.color.replace(")", " / 0.3)")}` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── More 3D Decorations ─────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "48px",
          paddingTop: "32px",
          borderTop: "1px solid oklch(0.22 0.01 20)",
        }}
      >
        <BloodCellDecor height={320} />
      </div>
    </main>
  );
}
