// 3D-style blood drop with 3 orbiting glowing rings — inline, fills vertical space

interface BloodOrbitWidgetProps {
  size?: number;
  className?: string;
}

const RING1_DEGS = [0, 90, 180, 270];
const RING2_DEGS = [45, 165, 285];
const RING3_DEGS = [30, 150, 210, 330];

export function BloodOrbitWidget({
  size = 220,
  className = "",
}: BloodOrbitWidgetProps) {
  return (
    <>
      <style>{`
        @keyframes orbit1 {
          from { transform: rotateX(75deg) rotateZ(0deg); }
          to   { transform: rotateX(75deg) rotateZ(360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotateX(60deg) rotateZ(120deg); }
          to   { transform: rotateX(60deg) rotateZ(480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotateX(80deg) rotateZ(240deg); }
          to   { transform: rotateX(80deg) rotateZ(600deg); }
        }
        @keyframes bloodPulse3d {
          0%, 100% { filter: drop-shadow(0 0 14px oklch(0.65 0.28 22 / 0.9)) drop-shadow(0 0 30px oklch(0.65 0.28 22 / 0.5)); transform: scale(1); }
          50%       { filter: drop-shadow(0 0 22px oklch(0.65 0.28 22)) drop-shadow(0 0 50px oklch(0.65 0.28 22 / 0.7)); transform: scale(1.06); }
        }
        @keyframes orbitDot {
          0%   { box-shadow: 0 0 6px 3px oklch(0.65 0.28 22 / 0.9); }
          50%  { box-shadow: 0 0 10px 5px oklch(0.65 0.28 22); }
          100% { box-shadow: 0 0 6px 3px oklch(0.65 0.28 22 / 0.9); }
        }
      `}</style>

      <div
        className={className}
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          position: "relative",
          perspective: "600px",
          margin: "0 auto",
        }}
      >
        {/* Central blood drop */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            animation: "bloodPulse3d 3s ease-in-out infinite",
          }}
        >
          <svg
            width={size * 0.32}
            height={size * 0.38}
            viewBox="0 0 24 28"
            fill="none"
            role="presentation"
            aria-hidden="true"
          >
            <title>Blood drop</title>
            <path
              d="M12 2 C12 2 3 12 3 18 C3 23 7.1 27 12 27 C16.9 27 21 23 21 18 C21 12 12 2 12 2Z"
              fill="oklch(0.55 0.28 22)"
              stroke="oklch(0.75 0.28 22)"
              strokeWidth="0.8"
            />
            <ellipse
              cx="9"
              cy="17"
              rx="2.5"
              ry="3.5"
              fill="oklch(0.75 0.28 22 / 0.35)"
            />
          </svg>
        </div>

        {/* Ring 1 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 0.72,
            height: size * 0.72,
            marginLeft: -(size * 0.36),
            marginTop: -(size * 0.36),
            borderRadius: "50%",
            border: "1.5px solid oklch(0.65 0.28 22 / 0.5)",
            boxShadow: "0 0 8px oklch(0.65 0.28 22 / 0.3) inset",
            transformStyle: "preserve-3d",
            animation: "orbit1 6s linear infinite",
          }}
        >
          {RING1_DEGS.map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "oklch(0.75 0.28 22)",
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateX(${size * 0.36}px) translate(-50%, -50%)`,
                animation: "orbitDot 2s ease-in-out infinite",
                animationDelay: `${deg / 360}s`,
              }}
            />
          ))}
        </div>

        {/* Ring 2 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 0.88,
            height: size * 0.88,
            marginLeft: -(size * 0.44),
            marginTop: -(size * 0.44),
            borderRadius: "50%",
            border: "1px solid oklch(0.65 0.28 22 / 0.3)",
            transformStyle: "preserve-3d",
            animation: "orbit2 9s linear infinite",
          }}
        >
          {RING2_DEGS.map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: "oklch(0.8 0.2 22)",
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateX(${size * 0.44}px) translate(-50%, -50%)`,
                boxShadow: "0 0 8px oklch(0.65 0.28 22 / 0.8)",
              }}
            />
          ))}
        </div>

        {/* Ring 3 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: size * 1.0,
            height: size * 1.0,
            marginLeft: -(size * 0.5),
            marginTop: -(size * 0.5),
            borderRadius: "50%",
            border: "1px dashed oklch(0.65 0.28 22 / 0.2)",
            transformStyle: "preserve-3d",
            animation: "orbit3 14s linear infinite reverse",
          }}
        >
          {RING3_DEGS.map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "oklch(0.7 0.15 22)",
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateX(${size * 0.5}px) translate(-50%, -50%)`,
                boxShadow: "0 0 6px oklch(0.65 0.28 22 / 0.6)",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
