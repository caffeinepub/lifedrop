// Radar/sonar-style concentric pulsing rings — purely decorative, fills vertical space

const RING_SIZES = [30, 60, 95, 130, 170, 210];

interface PulseRingsDecorProps {
  className?: string;
}

export function PulseRingsDecor({ className = "" }: PulseRingsDecorProps) {
  return (
    <>
      <style>{`
        @keyframes radarRing {
          0%   { transform: translate(-50%, -50%) scale(0.1); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1);   opacity: 0; }
        }
        @keyframes radarScan {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes innerPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.9; }
          50%       { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }
      `}</style>

      <div
        className={className}
        aria-hidden="true"
        style={{
          position: "relative",
          height: "240px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Radar scan line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100px",
            height: "1.5px",
            transformOrigin: "0 50%",
            background:
              "linear-gradient(90deg, oklch(0.65 0.28 22 / 0.8), transparent)",
            animation: "radarScan 4s linear infinite",
            zIndex: 2,
          }}
        />

        {/* Concentric rings */}
        {RING_SIZES.map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size * 2,
              height: size * 2,
              marginLeft: -size,
              marginTop: -size,
              borderRadius: "50%",
              border: `${i < 2 ? "1.5" : "1"}px solid oklch(0.65 0.28 22 / ${(0.5 - i * 0.07).toFixed(2)})`,
              boxShadow:
                i < 3
                  ? `0 0 ${6 + i * 4}px oklch(0.65 0.28 22 / ${(0.2 - i * 0.04).toFixed(2)}) inset`
                  : undefined,
              animation: `radarRing 3s ease-out ${i * 0.5}s infinite`,
            }}
          />
        ))}

        {/* Center blood drop */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            animation: "innerPulse 2.5s ease-in-out infinite",
            zIndex: 3,
          }}
        >
          <svg
            width="28"
            height="33"
            viewBox="0 0 24 28"
            fill="none"
            aria-hidden="true"
            style={{
              transform: "translate(-50%, -50%)",
              filter: "drop-shadow(0 0 8px oklch(0.65 0.28 22 / 0.9))",
            }}
          >
            <title>Blood drop pulse indicator</title>
            <path
              d="M12 2 C12 2 3 12 3 18 C3 23 7.1 27 12 27 C16.9 27 21 23 21 18 C21 12 12 2 12 2Z"
              fill="oklch(0.55 0.28 22)"
              stroke="oklch(0.8 0.28 22)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Label */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "oklch(0.65 0.28 22 / 0.5)",
            textTransform: "uppercase",
          }}
        >
          Live Tracking
        </div>
      </div>
    </>
  );
}
