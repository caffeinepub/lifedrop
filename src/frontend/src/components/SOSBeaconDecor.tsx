/**
 * SOSBeaconDecor — SOS text with neon flicker + expanding pulse rings
 * Desktop only (hidden md:block)
 */
export function SOSBeaconDecor() {
  return (
    <div
      className="hidden md:flex flex-col items-center justify-center py-8 select-none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes sos-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow:
              0 0 6px oklch(0.62 0.26 25),
              0 0 20px oklch(0.62 0.26 25),
              0 0 40px oklch(0.62 0.26 25);
            opacity: 1;
          }
          20%, 24%, 55% {
            text-shadow: none;
            opacity: 0.6;
          }
        }
        .sos-text {
          animation: sos-flicker 3s linear infinite;
        }
        @keyframes sos-ring {
          0%   { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .sos-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid oklch(0.62 0.26 25 / 0.6);
          width: 80px;
          height: 80px;
          top: 50%;
          left: 50%;
          margin-top: -40px;
          margin-left: -40px;
          animation: sos-ring 2s ease-out infinite;
        }
        .sos-ring:nth-child(2) { animation-delay: 0.6s; }
        .sos-ring:nth-child(3) { animation-delay: 1.2s; }
      `}</style>
      <div
        style={{
          position: "relative",
          width: 160,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="sos-ring" />
        <div className="sos-ring" />
        <div className="sos-ring" />
        <span
          className="sos-text font-black"
          style={{
            fontSize: 36,
            letterSpacing: "0.2em",
            color: "oklch(0.62 0.26 25)",
            position: "relative",
            zIndex: 1,
          }}
        >
          SOS
        </span>
      </div>
      <p
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          color: "oklch(0.62 0.26 25 / 0.6)",
          marginTop: 8,
          textTransform: "uppercase",
        }}
      >
        Emergency Active
      </p>
    </div>
  );
}
