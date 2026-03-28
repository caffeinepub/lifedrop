import { useCallback, useEffect, useRef, useState } from "react";

const BAR_CONFIGS = [
  { h: "5px", d: "0s" },
  { h: "9px", d: "0.12s" },
  { h: "13px", d: "0.24s" },
  { h: "9px", d: "0.36s" },
  { h: "5px", d: "0.48s" },
] as const;

function startAmbientAudio(ctx: AudioContext): () => void {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.45, ctx.currentTime);
  masterGain.connect(ctx.destination);

  // Immediate low drone — audible instantly
  const droneFreqs: { freq: number; gain: number; type: OscillatorType }[] = [
    { freq: 110, gain: 0.055, type: "triangle" },
    { freq: 165, gain: 0.032, type: "sine" },
    { freq: 220, gain: 0.025, type: "triangle" },
    { freq: 247, gain: 0.018, type: "sine" },
    { freq: 330, gain: 0.012, type: "sine" },
  ];

  const nodes: AudioNode[] = [masterGain];

  for (const p of droneFreqs) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.06 + Math.random() * 0.04;
    lfoG.gain.value = 0.4;
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    lfo.start(ctx.currentTime);
    osc.type = p.type;
    osc.frequency.value = p.freq;
    g.gain.setValueAtTime(p.gain, ctx.currentTime);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(ctx.currentTime);
    nodes.push(osc, g, lfo, lfoG);
  }

  // Rain noise — starts immediately
  const bufSize = ctx.sampleRate * 4;
  const noiseBuf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const noiseData = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufSize; i++)
    noiseData[i] = (Math.random() * 2 - 1) * 0.012;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = "bandpass";
  rainFilter.frequency.value = 1100;
  rainFilter.Q.value = 0.35;
  const rainGain = ctx.createGain();
  rainGain.gain.setValueAtTime(0.07, ctx.currentTime);
  noise.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);
  noise.start(ctx.currentTime);
  nodes.push(noise, rainFilter, rainGain);

  // Healing chimes (scheduled, not immediate but add richness)
  const chimeFreqs = [432, 528, 396, 594, 264, 352, 440, 660];
  let chimeTimeout: ReturnType<typeof setTimeout>;
  let stopped = false;

  function scheduleChime() {
    const delay = 3000 + Math.random() * 5000;
    chimeTimeout = setTimeout(() => {
      if (stopped || ctx.state !== "running") return;
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      osc.connect(env);
      env.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.5);
      scheduleChime();
    }, delay);
  }
  scheduleChime();

  // Return cleanup — fast fade-out
  return () => {
    stopped = true;
    clearTimeout(chimeTimeout);
    try {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    } catch {}
  };
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const pendingRef = useRef(false);

  const toggle = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (isPlaying) {
        // Stop: fade out then close
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
        const ctx = ctxRef.current;
        ctxRef.current = null;
        setIsPlaying(false);
        if (ctx) {
          setTimeout(() => {
            try {
              ctx.close();
            } catch {}
          }, 400);
        }
      } else {
        // Start: create context and play immediately
        const ctx = new AudioCtx();
        ctxRef.current = ctx;
        // Resume if suspended (mobile browsers auto-suspend)
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        cleanupRef.current = startAmbientAudio(ctx);
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("Audio toggle error:", e);
    } finally {
      pendingRef.current = false;
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch {}
      }
      if (ctxRef.current) {
        try {
          ctxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      data-ocid="nav.music.toggle"
      title={isPlaying ? "Stop music" : "Play calming ambient music"}
      aria-label={isPlaying ? "Stop music" : "Play calming ambient music"}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: isPlaying
          ? "oklch(var(--neon-red) / 0.15)"
          : "transparent",
        border: isPlaying
          ? "1px solid oklch(var(--neon-red) / 0.4)"
          : "1px solid transparent",
        boxShadow: isPlaying
          ? "0 0 12px oklch(var(--neon-red) / 0.35)"
          : "none",
      }}
    >
      {isPlaying ? (
        <span className="flex items-end gap-[2px] h-4">
          {BAR_CONFIGS.map((bar) => (
            <span
              key={bar.d}
              className="block w-[3px] rounded-full"
              style={{
                height: bar.h,
                backgroundColor: "oklch(var(--neon-red))",
                animation: "musicBar 0.6s ease-in-out infinite alternate",
                animationDelay: bar.d,
              }}
            />
          ))}
          <style>
            {
              "@keyframes musicBar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }"
            }
          </style>
        </span>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "oklch(var(--muted-foreground))" }}
          aria-hidden="true"
        >
          <title>Music off</title>
          <path
            d="M9 18V5l12-2v13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6" cy="18" r="3" fill="none" />
          <circle cx="18" cy="16" r="3" fill="none" />
        </svg>
      )}
    </button>
  );
}
