/**
 * HelixDecor — animated DNA double helix SVG
 * Desktop only (hidden md:block)
 */
export function HelixDecor() {
  const points = 12;
  const width = 120;
  const height = 280;
  const cx = width / 2;
  const amplitude = 40;
  const strand1: string[] = [];
  const strand2: string[] = [];
  const connectorData: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    idx: number;
  }[] = [];

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const y = t * height;
    const angle = t * Math.PI * 3;
    const x1 = cx + Math.cos(angle) * amplitude;
    const x2 = cx + Math.cos(angle + Math.PI) * amplitude;
    strand1.push(`${i === 0 ? "M" : "L"}${x1.toFixed(1)},${y.toFixed(1)}`);
    strand2.push(`${i === 0 ? "M" : "L"}${x2.toFixed(1)},${y.toFixed(1)}`);
    if (i % 2 === 0) {
      connectorData.push({ x1, y1: y, x2, y2: y, idx: i });
    }
  }

  return (
    <div
      className="hidden md:flex items-center justify-center py-6"
      aria-hidden="true"
    >
      <style>{`
        @keyframes helix-dash {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes helix-dash2 {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -400; }
        }
        .helix-s1 {
          stroke-dasharray: 12 4;
          animation: helix-dash 4s linear infinite;
        }
        .helix-s2 {
          stroke-dasharray: 12 4;
          animation: helix-dash2 4s linear infinite;
        }
        @keyframes helix-connector-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .helix-conn { animation: helix-connector-pulse 2s ease-in-out infinite; }
      `}</style>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <path
          d={strand1.join(" ")}
          fill="none"
          stroke="oklch(0.62 0.26 25)"
          strokeWidth="3"
          strokeLinecap="round"
          className="helix-s1"
          style={{ filter: "drop-shadow(0 0 4px oklch(0.62 0.26 25 / 0.8))" }}
        />
        <path
          d={strand2.join(" ")}
          fill="none"
          stroke="oklch(0.55 0.2 30)"
          strokeWidth="3"
          strokeLinecap="round"
          className="helix-s2"
          style={{ filter: "drop-shadow(0 0 4px oklch(0.55 0.2 30 / 0.7))" }}
        />
        {connectorData.map((c) => (
          <line
            key={`conn-${c.idx}`}
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke="oklch(0.62 0.26 25 / 0.5)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            className="helix-conn"
          />
        ))}
        {connectorData.map((c) => (
          <circle
            key={`d1-${c.idx}`}
            cx={c.x1}
            cy={c.y1}
            r="4"
            fill="oklch(0.62 0.26 25)"
            style={{ filter: "drop-shadow(0 0 4px oklch(0.62 0.26 25))" }}
            className="helix-conn"
          />
        ))}
        {connectorData.map((c) => (
          <circle
            key={`d2-${c.idx}`}
            cx={c.x2}
            cy={c.y2}
            r="4"
            fill="oklch(0.55 0.2 30)"
            style={{ filter: "drop-shadow(0 0 4px oklch(0.55 0.2 30))" }}
            className="helix-conn"
          />
        ))}
      </svg>
    </div>
  );
}
