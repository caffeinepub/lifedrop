/**
 * NeuralPulseDecor — animated concentric notification ping rings
 * Desktop only (hidden md:block)
 */
export function NeuralPulseDecor() {
  return (
    <div
      className="hidden md:flex items-center justify-center"
      aria-hidden="true"
      style={{ height: 260 }}
    >
      <style>{`
        @keyframes neural-ring {
          0%   { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(1);   opacity: 0; }
        }
        .neural-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid oklch(0.62 0.26 25 / 0.7);
          width: 200px;
          height: 200px;
          top: 50%;
          left: 50%;
          margin-top: -100px;
          margin-left: -100px;
          animation: neural-ring 2.8s ease-out infinite;
        }
        .neural-ring-2 { animation-delay: 0.5s; border-color: oklch(0.62 0.26 25 / 0.5); }
        .neural-ring-3 { animation-delay: 1s;   border-color: oklch(0.62 0.26 25 / 0.35); }
        .neural-ring-4 { animation-delay: 1.5s; border-color: oklch(0.62 0.26 25 / 0.2); }
        .neural-ring-5 { animation-delay: 2s;   border-color: oklch(0.62 0.26 25 / 0.12); }
      `}</style>
      <div style={{ position: "relative", width: 220, height: 220 }}>
        <div className="neural-ring" />
        <div className="neural-ring neural-ring-2" />
        <div className="neural-ring neural-ring-3" />
        <div className="neural-ring neural-ring-4" />
        <div className="neural-ring neural-ring-5" />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "oklch(0.62 0.26 25 / 0.15)",
            border: "2px solid oklch(0.62 0.26 25 / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px oklch(0.62 0.26 25 / 0.4)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="oklch(0.62 0.26 25)"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
