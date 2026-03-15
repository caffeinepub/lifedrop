export function HeartbeatDecor({
  width = 280,
  height = 160,
}: { width?: number; height?: number }) {
  // EKG path: flat — P wave — QRS complex spike — T wave — flat
  const path =
    "M0,80 L30,80 L40,72 L48,80 L58,20 L66,120 L74,80 L90,60 L100,80 L200,80 L210,72 L218,80 L228,20 L236,120 L244,80 L260,60 L270,80 L320,80";
  const pathLen = 620;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes ekgDraw {
          0%   { stroke-dashoffset: ${pathLen}; }
          100% { stroke-dashoffset: -${pathLen}; }
        }
        @keyframes ekgDotTrail {
          0%   { offset-distance: 0%; opacity: 1; }
          95%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes heartFloat1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.15); }
        }
        @keyframes heartFloat2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-6px) scale(1.1); }
        }
        @keyframes ekgLabel {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* Heart icons on sides + EKG line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Left heart */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            animation: "heartFloat1 1.8s ease-in-out infinite",
            flexShrink: 0,
          }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="oklch(0.62 0.26 22)"
            opacity="0.85"
          />
        </svg>

        {/* EKG SVG */}
        <svg
          viewBox="0 0 320 100"
          width={width - 60}
          height={height * 0.55}
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          {/* Glow layer */}
          <path
            d={path}
            fill="none"
            stroke="oklch(0.62 0.26 22)"
            strokeWidth="5"
            opacity="0.18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Animated drawing line */}
          <path
            d={path}
            fill="none"
            stroke="oklch(0.75 0.28 22)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLen}
            strokeDashoffset={pathLen}
            style={{
              animation: "ekgDraw 2.8s linear infinite",
              filter: "drop-shadow(0 0 5px oklch(0.75 0.28 22 / 0.8))",
            }}
          />
        </svg>

        {/* Right heart */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{
            animation: "heartFloat2 2.2s ease-in-out infinite",
            flexShrink: 0,
          }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="oklch(0.62 0.26 22)"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Label */}
      <div
        style={{
          color: "oklch(0.65 0.24 22)",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          animation: "ekgLabel 2s ease-in-out infinite",
          fontFamily: "monospace",
        }}
      >
        HEARTBEAT
      </div>
    </div>
  );
}
