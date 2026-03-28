export function BloodCellDecor({ height = 380 }: { height?: number }) {
  const cells = [
    { cx: 50, cy: 30, rx: 22, ry: 14, dur: 5.2, tx: 12, ty: -8, delay: 0 },
    { cx: 80, cy: 60, rx: 18, ry: 11, dur: 6.8, tx: -10, ty: 12, delay: 1.1 },
    { cx: 30, cy: 65, rx: 26, ry: 16, dur: 4.9, tx: 8, ty: 10, delay: 0.5 },
    { cx: 65, cy: 88, rx: 20, ry: 12, dur: 7.1, tx: -14, ty: -6, delay: 1.8 },
    { cx: 18, cy: 50, rx: 16, ry: 10, dur: 5.6, tx: 6, ty: 14, delay: 0.8 },
    { cx: 87, cy: 35, rx: 24, ry: 15, dur: 6.2, tx: -8, ty: 8, delay: 2.2 },
  ];

  return (
    <div
      style={{
        height,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        userSelect: "none",
        gap: 12,
      }}
    >
      <style>{`
        @keyframes rbcFloat0 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(12px, -8px) rotate(8deg); }
          66%       { transform: translate(-5px, 6px) rotate(-4deg); }
        }
        @keyframes rbcFloat1 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(-10px, 12px) rotate(-10deg); }
          66%       { transform: translate(7px, -4px) rotate(5deg); }
        }
        @keyframes rbcFloat2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(8px, 10px) rotate(6deg); }
          66%       { transform: translate(-12px, -7px) rotate(-8deg); }
        }
        @keyframes rbcFloat3 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(-14px, -6px) rotate(-7deg); }
          66%       { transform: translate(6px, 9px) rotate(12deg); }
        }
        @keyframes rbcFloat4 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(6px, 14px) rotate(5deg); }
          66%       { transform: translate(-8px, -5px) rotate(-9deg); }
        }
        @keyframes rbcFloat5 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33%       { transform: translate(-8px, 8px) rotate(-6deg); }
          66%       { transform: translate(10px, -6px) rotate(7deg); }
        }
        @keyframes rbcGlow {
          0%, 100% { filter: drop-shadow(0 0 5px oklch(0.62 0.26 22 / 0.45)); }
          50%       { filter: drop-shadow(0 0 16px oklch(0.72 0.28 22 / 0.85)); }
        }
        @keyframes awarenessLabel {
          0%, 100% { opacity: 0.5; letter-spacing: 0.18em; }
          50%       { opacity: 1;   letter-spacing: 0.28em; }
        }
      `}</style>

      {/* Radial background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.62 0.26 22 / 0.06) 0%, transparent 70%)",
          borderRadius: 16,
          pointerEvents: "none",
        }}
      />

      {/* Blood cells SVG canvas */}
      <svg
        viewBox="0 0 100 100"
        width={Math.min(height * 0.7, 260)}
        height={Math.min(height * 0.7, 260)}
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {cells.map((cell, i) => (
          <g
            key={`${cell.cx}-${cell.cy}`}
            style={{
              animation: `rbcFloat${i} ${cell.dur}s ease-in-out infinite`,
              animationDelay: `${cell.delay}s`,
              transformOrigin: `${cell.cx}px ${cell.cy}px`,
            }}
          >
            {/* RBC outer shape */}
            <ellipse
              cx={cell.cx}
              cy={cell.cy}
              rx={cell.rx}
              ry={cell.ry}
              fill="oklch(0.48 0.24 22)"
              style={{
                animation: `rbcGlow ${cell.dur * 0.75}s ease-in-out infinite`,
                animationDelay: `${cell.delay}s`,
              }}
            />
            {/* RBC dimple (biconcave indent) */}
            <ellipse
              cx={cell.cx}
              cy={cell.cy}
              rx={cell.rx * 0.45}
              ry={cell.ry * 0.45}
              fill="oklch(0.38 0.22 22)"
              opacity="0.7"
            />
            {/* Specular highlight */}
            <ellipse
              cx={cell.cx - cell.rx * 0.25}
              cy={cell.cy - cell.ry * 0.25}
              rx={cell.rx * 0.3}
              ry={cell.ry * 0.28}
              fill="oklch(0.78 0.12 22)"
              opacity="0.22"
            />
          </g>
        ))}
      </svg>

      {/* Awareness label */}
      <div
        style={{
          color: "oklch(0.65 0.24 22)",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          animation: "awarenessLabel 3s ease-in-out infinite",
        }}
      >
        AWARENESS
      </div>
    </div>
  );
}
