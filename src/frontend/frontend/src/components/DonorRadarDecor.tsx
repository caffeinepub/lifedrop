export function DonorRadarDecor({ height = 400 }: { height?: number }) {
  const dots = [
    { cx: 58, cy: 52, r: 3.5 },
    { cx: 78, cy: 38, r: 2.5 },
    { cx: 110, cy: 48, r: 4 },
    { cx: 42, cy: 80, r: 3 },
    { cx: 90, cy: 72, r: 2.5 },
    { cx: 62, cy: 100, r: 3.5 },
    { cx: 120, cy: 90, r: 2 },
    { cx: 30, cy: 55, r: 2 },
    { cx: 135, cy: 65, r: 3 },
    { cx: 50, cy: 118, r: 2.5 },
    { cx: 100, cy: 120, r: 3 },
    { cx: 82, cy: 112, r: 2 },
  ];

  return (
    <div
      style={{
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "16px 8px",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes radarDotPulse {
          0%, 100% { opacity: 0.25; r: 2; }
          50%       { opacity: 1;    r: 4; }
        }
        @keyframes radarRingPulse {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.45; }
        }
        @keyframes radarLabelPulse {
          0%, 100% { opacity: 0.55; letter-spacing: 0.18em; }
          50%       { opacity: 1;    letter-spacing: 0.28em; }
        }
        @keyframes radarGlow {
          0%, 100% { filter: drop-shadow(0 0 6px oklch(0.62 0.26 22 / 0.45)); }
          50%       { filter: drop-shadow(0 0 18px oklch(0.62 0.26 22 / 0.85)); }
        }
      `}</style>

      {/* Radar SVG */}
      <div style={{ animation: "radarGlow 3s ease-in-out infinite" }}>
        <svg
          viewBox="0 0 160 160"
          width={Math.min(height * 0.62, 230)}
          height={Math.min(height * 0.62, 230)}
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle cx="80" cy="80" r="75" fill="oklch(0.1 0.015 22)" />

          {/* Concentric rings */}
          {[20, 38, 56, 74].map((r) => (
            <circle
              key={r}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke="oklch(0.62 0.26 22)"
              strokeWidth="0.7"
              opacity="0.25"
              style={{
                animation: `radarRingPulse ${2.4 + r * 0.025}s ease-in-out infinite`,
              }}
            />
          ))}

          {/* Cross-hair lines */}
          <line
            x1="80"
            y1="6"
            x2="80"
            y2="154"
            stroke="oklch(0.62 0.26 22)"
            strokeWidth="0.5"
            opacity="0.18"
          />
          <line
            x1="6"
            y1="80"
            x2="154"
            y2="80"
            stroke="oklch(0.62 0.26 22)"
            strokeWidth="0.5"
            opacity="0.18"
          />

          {/* Sweep arm group */}
          <g
            style={{
              transformOrigin: "80px 80px",
              animation: "radarSweep 4s linear infinite",
            }}
          >
            {/* Sweep fill arc — approximate with a wedge polygon */}
            <path
              d="M80,80 L80,6 A74,74 0 0,1 128,38 Z"
              fill="url(#sweepGrad)"
              opacity="0.55"
            />
            {/* Sweep arm line */}
            <line
              x1="80"
              y1="80"
              x2="80"
              y2="6"
              stroke="oklch(0.7 0.28 22)"
              strokeWidth="2"
              opacity="0.9"
            />
          </g>

          {/* Radial gradient for sweep */}
          <defs>
            <radialGradient
              id="sweepGrad"
              cx="80"
              cy="80"
              r="74"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                offset="0%"
                stopColor="oklch(0.65 0.28 22)"
                stopOpacity="0.7"
              />
              <stop
                offset="100%"
                stopColor="oklch(0.65 0.28 22)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          {/* Donor dots */}
          {dots.map((d, i) => (
            <circle
              key={`${d.cx}-${d.cy}`}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill="oklch(0.75 0.28 22)"
              style={{
                animation: `radarDotPulse ${2.5 + (i % 4) * 0.4}s ease-in-out infinite`,
                animationDelay: `${(i * 0.31) % 2}s`,
              }}
            />
          ))}

          {/* Center dot */}
          <circle
            cx="80"
            cy="80"
            r="3.5"
            fill="oklch(0.85 0.28 22)"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Label */}
      <div
        style={{
          color: "oklch(0.7 0.26 22)",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          animation: "radarLabelPulse 3s ease-in-out infinite",
          fontFamily: "monospace",
        }}
      >
        SCANNING FOR DONORS
      </div>

      {/* Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "oklch(0.65 0.28 22)",
            display: "inline-block",
            animation: "radarDotPulse 1.4s ease-in-out infinite",
          }}
        />
        <span
          style={{
            color: "oklch(0.55 0.12 22)",
            fontSize: 9,
            letterSpacing: "0.15em",
            fontFamily: "monospace",
          }}
        >
          SIGNAL ACTIVE
        </span>
      </div>
    </div>
  );
}
