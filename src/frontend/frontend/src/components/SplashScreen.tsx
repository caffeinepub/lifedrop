import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fillProgress, setFillProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Sub-second: 700ms total, fade out in 300ms
    const startTime = Date.now();
    const duration = 700;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      setFillProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onComplete, 300);
        }, 80);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  const dropHeight = 120;
  const fillY = dropHeight - (fillProgress / 100) * dropHeight;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "oklch(0.08 0.005 20)",
        transition: "opacity 0.3s ease",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.35 0.15 25 / 0.12), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Blood drop SVG with fill animation */}
      <div
        style={{
          position: "relative",
          width: 80,
          height: 96,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -16,
            background:
              "radial-gradient(circle, oklch(0.55 0.28 25 / 0.3), transparent 70%)",
            filter: "blur(10px)",
            animation: "splashGlow 0.8s ease-in-out infinite alternate",
          }}
        />
        <svg
          viewBox="0 0 100 120"
          width="80"
          height="96"
          style={{ overflow: "visible" }}
          aria-label="Blood drop filling animation"
          role="img"
        >
          <defs>
            <clipPath id="dropFill">
              <rect x="0" y={fillY} width="100" height={dropHeight} />
            </clipPath>
          </defs>
          <path
            d="M50 8 C50 8 10 52 10 76 A40 40 0 0 0 90 76 C90 52 50 8 50 8Z"
            fill="none"
            stroke="oklch(0.55 0.28 25 / 0.5)"
            strokeWidth="2"
          />
          <path
            d="M50 8 C50 8 10 52 10 76 A40 40 0 0 0 90 76 C90 52 50 8 50 8Z"
            fill="oklch(0.55 0.28 25)"
            clipPath="url(#dropFill)"
          />
          <ellipse
            cx="38"
            cy="55"
            rx="7"
            ry="12"
            fill="white"
            opacity="0.12"
            clipPath="url(#dropFill)"
          />
        </svg>
      </div>

      <div
        style={{
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "1.8rem",
          fontWeight: 900,
          letterSpacing: "-0.02em",
          color: "oklch(0.95 0.02 20)",
          marginBottom: 6,
        }}
      >
        LIFE<span style={{ color: "oklch(0.55 0.28 25)" }}>DROP</span>
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "oklch(0.6 0.04 20)",
          letterSpacing: "0.15em",
          marginBottom: 18,
        }}
      >
        SAVE LIVES • DONATE BLOOD
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 140,
          height: 3,
          background: "oklch(0.2 0.01 20)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, oklch(0.45 0.25 25), oklch(0.65 0.28 25))",
            borderRadius: 999,
            transition: "width 16ms linear",
            boxShadow: "0 0 8px oklch(0.55 0.28 25 / 0.6)",
          }}
        />
      </div>

      <style>{`
        @keyframes splashGlow {
          from { opacity: 0.6; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
