// Animated SVG DNA double-helix — fills vertical decorative space

interface DnaStrandDecorProps {
  height?: number;
  className?: string;
}

export function DnaStrandDecor({
  height = 300,
  className = "",
}: DnaStrandDecorProps) {
  const steps = 24;
  const width = 120;
  const cx = width / 2;
  const amplitude = 40;

  const strand1Points: [number, number][] = [];
  const strand2Points: [number, number][] = [];
  const rungs: [number, number, number, number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * height;
    const angle = t * Math.PI * 4;
    const x1 = cx + Math.cos(angle) * amplitude;
    const x2 = cx + Math.cos(angle + Math.PI) * amplitude;
    strand1Points.push([x1, y]);
    strand2Points.push([x2, y]);
    if (i % 3 === 0) {
      rungs.push([x1, y, x2, y, i]);
    }
  }

  const toPath = (pts: [number, number][]) =>
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`,
      )
      .join(" ");

  return (
    <>
      <style>{`
        @keyframes dnaScroll {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes rungGlow {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.8; }
        }
        @keyframes strandGlow {
          0%, 100% { filter: drop-shadow(0 0 4px oklch(0.65 0.28 22 / 0.6)); }
          50%       { filter: drop-shadow(0 0 10px oklch(0.65 0.28 22)); }
        }
      `}</style>

      <div
        className={className}
        aria-hidden="true"
        style={{
          height,
          overflow: "hidden",
          position: "relative",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            animation: "dnaScroll 8s linear infinite",
            height: height * 2,
          }}
        >
          {[0, 1].map((repeat) => (
            <svg
              key={repeat}
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              aria-hidden="true"
              style={{
                display: "block",
                animation: "strandGlow 3s ease-in-out infinite",
              }}
            >
              <title>DNA strand decoration</title>
              {rungs.map(([x1, y1, x2, y2, idx]) => (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.65 0.28 22)"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  style={{
                    animation: `rungGlow 2s ease-in-out ${(idx as number) * 0.15}s infinite`,
                  }}
                />
              ))}
              <path
                d={toPath(strand1Points)}
                fill="none"
                stroke="oklch(0.7 0.28 22)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.85"
              />
              <path
                d={toPath(strand2Points)}
                fill="none"
                stroke="oklch(0.55 0.22 22)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.7"
              />
              {strand1Points
                .filter((_, i) => i % 4 === 0)
                .map(([x, y], _i) => (
                  <circle
                    key={`s1-${x.toFixed(0)}-${y.toFixed(0)}`}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="oklch(0.8 0.28 22)"
                    fillOpacity="0.9"
                    style={{
                      filter: "drop-shadow(0 0 4px oklch(0.65 0.28 22 / 0.8))",
                    }}
                  />
                ))}
              {strand2Points
                .filter((_, i) => i % 4 === 0)
                .map(([x, y], _i) => (
                  <circle
                    key={`s2-${x.toFixed(0)}-${y.toFixed(0)}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="oklch(0.65 0.22 22)"
                    fillOpacity="0.8"
                  />
                ))}
            </svg>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(to bottom, oklch(0.09 0.005 20), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(to top, oklch(0.09 0.005 20), transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            color: "oklch(0.65 0.28 22 / 0.45)",
            textTransform: "uppercase",
          }}
        >
          Blood DNA
        </div>
      </div>
    </>
  );
}
