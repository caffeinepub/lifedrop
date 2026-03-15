export function BloodDropRainDecor({ height = 400 }: { height?: number }) {
  const drops = [
    { x: 12, size: 22, dur: 2.4, delay: 0.0, opacity: 0.85 },
    { x: 28, size: 16, dur: 3.1, delay: 0.7, opacity: 0.7 },
    { x: 42, size: 28, dur: 2.0, delay: 0.3, opacity: 0.9 },
    { x: 56, size: 18, dur: 3.5, delay: 1.1, opacity: 0.65 },
    { x: 68, size: 24, dur: 2.7, delay: 0.5, opacity: 0.8 },
    { x: 80, size: 14, dur: 3.8, delay: 1.5, opacity: 0.6 },
    { x: 20, size: 20, dur: 2.2, delay: 1.8, opacity: 0.75 },
    { x: 48, size: 30, dur: 1.9, delay: 0.9, opacity: 0.92 },
    { x: 74, size: 17, dur: 3.2, delay: 0.2, opacity: 0.7 },
    { x: 36, size: 25, dur: 2.6, delay: 1.3, opacity: 0.8 },
  ];

  return (
    <div
      style={{
        height,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes bloodDropFall {
          0%   { transform: translateY(-60px); opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(${height}px); opacity: 0; }
        }
        @keyframes poolPulse {
          0%, 100% { transform: scaleX(1);    opacity: 0.4; }
          50%       { transform: scaleX(1.12); opacity: 0.7; }
        }
        @keyframes dropGlow {
          0%, 100% { filter: drop-shadow(0 0 4px oklch(0.62 0.26 22 / 0.5)); }
          50%       { filter: drop-shadow(0 0 12px oklch(0.75 0.28 22 / 0.9)); }
        }
      `}</style>

      {/* Falling drops */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: height - 32,
          overflow: "hidden",
        }}
      >
        {drops.map((drop) => (
          <div
            key={`${drop.x}-${drop.dur}`}
            style={{
              position: "absolute",
              left: `${drop.x}%`,
              top: 0,
              animation: `bloodDropFall ${drop.dur}s ease-in infinite`,
              animationDelay: `${drop.delay}s`,
            }}
          >
            <svg
              viewBox="0 0 24 32"
              width={drop.size}
              height={drop.size * 1.35}
              aria-hidden="true"
              style={{
                opacity: drop.opacity,
                animation: `dropGlow ${drop.dur * 0.8}s ease-in-out infinite`,
                animationDelay: `${drop.delay * 0.5}s`,
              }}
            >
              <path
                d="M12 2 C12 2, 3 14, 3 20 A9 9 0 0 0 21 20 C21 14, 12 2, 12 2 Z"
                fill="oklch(0.58 0.26 22)"
              />
              {/* Specular highlight */}
              <ellipse
                cx="9"
                cy="16"
                rx="2"
                ry="3.5"
                fill="oklch(0.85 0.1 22)"
                opacity="0.35"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Pool at bottom */}
      <div
        style={{
          width: "72%",
          height: 14,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.26 22 / 0.75) 0%, oklch(0.55 0.26 22 / 0.1) 80%)",
          animation: "poolPulse 2.2s ease-in-out infinite",
          flexShrink: 0,
        }}
      />

      {/* Label */}
      <div
        style={{
          marginTop: 8,
          color: "oklch(0.62 0.24 22)",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        EVERY DROP COUNTS
      </div>
    </div>
  );
}
