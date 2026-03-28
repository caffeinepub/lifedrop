/**
 * PulseWave — a perfect ECG heartbeat / pulse-line SVG animation.
 */
export function PulseWave({
  color = "oklch(0.65 0.28 22)",
  width = 320,
  height = 48,
  className = "",
}: {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const ecg =
    "M0,24 L40,24 L48,24 L52,20 L56,24 L60,24 " +
    "L80,24 L84,8 L88,40 L92,16 L96,28 L100,24 " +
    "L120,24 L124,22 L128,24 L160,24 " +
    "L200,24 L204,8 L208,40 L212,16 L216,28 L220,24 " +
    "L240,24 L244,22 L248,24 L280,24 " +
    "L320,24";

  const gradId = `ecgGrad-${width}-${height}`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      aria-hidden="true"
      role="presentation"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(4px)",
          opacity: 0.5,
          animation: "ecgScroll 2.2s linear infinite",
        }}
      >
        <title>pulse</title>
        <polyline
          points={ecgToPoints(ecg)}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          animation: "ecgScroll 2.2s linear infinite",
        }}
      >
        <title>pulse</title>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="30%" stopColor={color} stopOpacity="1" />
            <stop offset="70%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={ecgToPoints(ecg)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          top: "50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px 3px ${color}`,
          transform: "translateY(-50%)",
          animation: "ecgDot 2.2s linear infinite",
        }}
      />

      <style>{`
        @keyframes ecgScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${width / 2}px); }
        }
        @keyframes ecgDot {
          0%   { left: 0; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: ${width}px; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ecgToPoints(path: string): string {
  return path.replace(/[ML]/g, "").trim().split(" ").filter(Boolean).join(" ");
}
