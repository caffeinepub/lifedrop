// Staggered animated cards with blood donation facts — fills vertical space
import { useEffect, useState } from "react";

const FACTS = [
  { icon: "⏱️", stat: "Every 2 sec", desc: "Someone in the world needs blood" },
  { icon: "🩸", stat: "3 Lives", desc: "Saved by a single blood donation" },
  { icon: "🧬", stat: "Only 37%", desc: "Of people are eligible to donate" },
  {
    icon: "🏭",
    stat: "0 Factories",
    desc: "Blood cannot be manufactured — only donated",
  },
  {
    icon: "📅",
    stat: "56 Days",
    desc: "Minimum gap between donations (whole blood)",
  },
  {
    icon: "💪",
    stat: "450 ml",
    desc: "Collected per donation in under 10 minutes",
  },
];

export function BloodFactTicker({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(60px); opacity: 0; }
          to   { transform: translateX(0);   opacity: 1; }
        }
        @keyframes factGlow {
          0%, 100% { box-shadow: 0 0 8px oklch(0.65 0.28 22 / 0.2); }
          50%       { box-shadow: 0 0 16px oklch(0.65 0.28 22 / 0.4); }
        }
      `}</style>

      <div className={className} aria-hidden="true">
        <h3
          style={{
            textAlign: "center",
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.2em",
            color: "oklch(0.65 0.28 22 / 0.6)",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          Did You Know?
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {FACTS.map((f, i) => (
            <div
              key={f.stat}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                background: "oklch(0.55 0.28 22 / 0.06)",
                border: "1px solid oklch(0.65 0.28 22 / 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                animation: visible
                  ? `slideInRight 0.5s ease-out ${i * 0.08}s both, factGlow 3s ease-in-out ${i * 0.3}s infinite`
                  : "none",
              }}
            >
              <span style={{ fontSize: "22px", flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "14px",
                    color: "oklch(0.75 0.28 22)",
                    lineHeight: 1.1,
                  }}
                >
                  {f.stat}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "oklch(0.65 0.05 20)",
                    marginTop: "2px",
                    lineHeight: 1.3,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
