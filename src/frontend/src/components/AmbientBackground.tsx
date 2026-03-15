// Global ambient background — fixed behind all content, pointer-events: none
// Drifting red particles + aurora sweep + subtle DNA cell pattern

const PARTICLES = [
  { left: "8%", size: 3, dur: "14s", delay: "0s", bright: 0.7 },
  { left: "18%", size: 2, dur: "19s", delay: "3s", bright: 0.5 },
  { left: "28%", size: 4, dur: "22s", delay: "7s", bright: 0.9 },
  { left: "38%", size: 2, dur: "16s", delay: "1s", bright: 0.6 },
  { left: "48%", size: 3, dur: "20s", delay: "5s", bright: 0.8 },
  { left: "58%", size: 2, dur: "24s", delay: "9s", bright: 0.5 },
  { left: "68%", size: 4, dur: "17s", delay: "2s", bright: 0.7 },
  { left: "78%", size: 2, dur: "21s", delay: "11s", bright: 0.6 },
  { left: "88%", size: 3, dur: "15s", delay: "4s", bright: 0.9 },
  { left: "93%", size: 2, dur: "23s", delay: "8s", bright: 0.5 },
  { left: "3%", size: 3, dur: "18s", delay: "13s", bright: 0.7 },
  { left: "53%", size: 2, dur: "25s", delay: "6s", bright: 0.6 },
];

export function AmbientBackground() {
  return (
    <>
      <style>{`
        @keyframes auroraSlide {
          0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
        }
        @keyframes auroraSlide2 {
          0%   { transform: translateX(-120%) skewX(12deg); opacity: 0; }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { transform: translateX(220%) skewX(12deg); opacity: 0; }
        }
        @keyframes cellPulse {
          0%, 100% { opacity: 0.04; }
          50% { opacity: 0.09; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(100vh) translateX(0px); opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.5; }
          100% { transform: translateY(-20vh) translateX(60px); opacity: 0; }
        }
      `}</style>

      {/* Base dark gradient */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.15 0.04 22 / 0.4) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, oklch(0.12 0.03 22 / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* Aurora sweep 1 */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "15%",
          left: 0,
          right: 0,
          height: "180px",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, oklch(0.55 0.28 22 / 0.06) 40%, oklch(0.55 0.28 22 / 0.1) 50%, oklch(0.55 0.28 22 / 0.06) 60%, transparent)",
            animation: "auroraSlide 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* Aurora sweep 2 — offset */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "55%",
          left: 0,
          right: 0,
          height: "120px",
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, transparent, oklch(0.65 0.18 340 / 0.04) 40%, oklch(0.55 0.28 22 / 0.07) 50%, oklch(0.65 0.18 340 / 0.04) 60%, transparent)",
            animation: "auroraSlide2 18s ease-in-out 6s infinite",
          }}
        />
      </div>

      {/* Floating particles — keyed by unique left+dur combo */}
      {PARTICLES.map((p) => (
        <div
          key={`${p.left}-${p.dur}`}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: p.left,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            backgroundColor: `oklch(${p.bright} 0.28 22)`,
            boxShadow: `0 0 ${p.size * 3}px oklch(0.65 0.28 22 / 0.6)`,
            zIndex: 0,
            pointerEvents: "none",
            animation: `particleDrift ${p.dur} linear ${p.delay} infinite`,
          }}
        />
      ))}

      {/* Subtle cell/DNA background pattern via SVG */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='18' stroke='%23ef444420' stroke-width='0.8' fill='none'/%3E%3Ccircle cx='40' cy='40' r='10' stroke='%23ef444415' stroke-width='0.6' fill='none'/%3E%3Cline x1='40' y1='22' x2='40' y2='0' stroke='%23ef444412' stroke-width='0.5'/%3E%3Cline x1='40' y1='58' x2='40' y2='80' stroke='%23ef444412' stroke-width='0.5'/%3E%3Cline x1='22' y1='40' x2='0' y2='40' stroke='%23ef444412' stroke-width='0.5'/%3E%3Cline x1='58' y1='40' x2='80' y2='40' stroke='%23ef444412' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
          opacity: 0.5,
          animation: "cellPulse 8s ease-in-out infinite",
        }}
      />
    </>
  );
}
