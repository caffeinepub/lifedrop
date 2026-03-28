export function SOSRippleDecor({ size = 260 }: { size?: number }) {
  const rings = [0, 1, 2];

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes sosRingExpand {
          0%   { transform: scale(0.3); opacity: 0.85; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes sosTextPulse {
          0%, 100% {
            text-shadow: 0 0 10px oklch(0.65 0.28 22 / 0.7), 0 0 30px oklch(0.65 0.28 22 / 0.4);
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 20px oklch(0.75 0.28 22 / 1), 0 0 50px oklch(0.65 0.28 22 / 0.6);
            transform: scale(1.04);
          }
        }
        @keyframes sosBroadcast {
          0%, 100% { opacity: 0.35; letter-spacing: 0.18em; }
          50%       { opacity: 0.75; letter-spacing: 0.26em; }
        }
        @keyframes sosCenterPulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 18px oklch(0.65 0.28 22 / 0.5), 0 0 40px oklch(0.65 0.28 22 / 0.2); }
          50%       { transform: scale(1.06); box-shadow: 0 0 30px oklch(0.75 0.28 22 / 0.8), 0 0 60px oklch(0.65 0.28 22 / 0.4); }
        }
      `}</style>

      {/* Ripple rings */}
      {rings.map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: "50%",
            border: "2px solid oklch(0.65 0.28 22)",
            animation: "sosRingExpand 2s ease-out infinite",
            animationDelay: `${i * 0.65}s`,
          }}
        />
      ))}

      {/* Center circle */}
      <div
        style={{
          position: "relative",
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 38%, oklch(0.22 0.04 22), oklch(0.12 0.02 22))",
          border: "2px solid oklch(0.65 0.28 22 / 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "sosCenterPulse 2s ease-in-out infinite",
          zIndex: 2,
        }}
      >
        <span
          style={{
            color: "oklch(0.82 0.28 22)",
            fontSize: size * 0.1,
            fontWeight: 900,
            letterSpacing: "0.1em",
            fontFamily: "monospace",
            animation: "sosTextPulse 2s ease-in-out infinite",
          }}
        >
          SOS
        </span>
      </div>

      {/* Broadcast label */}
      <div
        style={{
          marginTop: size * 0.38,
          color: "oklch(0.55 0.18 22)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          animation: "sosBroadcast 2s ease-in-out infinite",
          position: "absolute",
          bottom: 8,
        }}
      >
        EMERGENCY BROADCAST
      </div>
    </div>
  );
}
