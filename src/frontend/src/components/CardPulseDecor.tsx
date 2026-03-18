/**
 * CardPulseDecor — animated ECG / heartbeat flatline with spike
 * Desktop only (hidden md:block)
 */
export function CardPulseDecor() {
  const ecgPath =
    "M0,50 L40,50 L50,50 L55,15 L60,80 L65,50 L80,50 L120,50 L130,50 L135,15 L140,80 L145,50 L160,50 L200,50";

  return (
    <div
      className="hidden md:flex items-center justify-center py-4"
      aria-hidden="true"
    >
      <style>{`
        @keyframes ecg-draw {
          0%   { stroke-dashoffset: 600; opacity: 1; }
          70%  { stroke-dashoffset: 0;   opacity: 1; }
          85%  { stroke-dashoffset: 0;   opacity: 0.9; }
          100% { stroke-dashoffset: 600; opacity: 1; }
        }
        .ecg-path {
          stroke-dasharray: 600;
          animation: ecg-draw 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 4px oklch(0.62 0.26 25 / 0.9));
        }
        @keyframes ecg-pulse-dot {
          0%, 60% { opacity: 0; r: 0; }
          70% { opacity: 1; r: 5; }
          85% { opacity: 0.5; r: 3; }
          100% { opacity: 0; r: 0; }
        }
        .ecg-dot {
          animation: ecg-pulse-dot 2.5s ease-in-out infinite;
        }
      `}</style>
      <svg
        viewBox="0 0 200 100"
        width="260"
        height="100"
        fill="none"
        overflow="visible"
        aria-hidden="true"
      >
        {([20, 40, 60, 80] as const).map((y) => (
          <line
            key={`hy-${y}`}
            x1="0"
            y1={y}
            x2="200"
            y2={y}
            stroke="oklch(0.62 0.26 25 / 0.08)"
            strokeWidth="0.5"
          />
        ))}
        {([0, 40, 80, 120, 160, 200] as const).map((x) => (
          <line
            key={`vx-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="100"
            stroke="oklch(0.62 0.26 25 / 0.08)"
            strokeWidth="0.5"
          />
        ))}
        <path
          d={ecgPath}
          stroke="oklch(0.62 0.26 25)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ecg-path"
        />
        <circle
          cx="65"
          cy="50"
          r="5"
          fill="oklch(0.62 0.26 25)"
          className="ecg-dot"
        />
      </svg>
    </div>
  );
}
