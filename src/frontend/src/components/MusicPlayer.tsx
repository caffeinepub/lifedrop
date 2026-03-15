import { useCallback, useEffect, useRef, useState } from "react";

const BAR_CONFIGS = [
  { h: "5px", d: "0s" },
  { h: "9px", d: "0.12s" },
  { h: "13px", d: "0.24s" },
  { h: "9px", d: "0.36s" },
  { h: "5px", d: "0.48s" },
] as const;

function createAmbientAudio(ctx: AudioContext): () => void {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  // Instant start — fade in over 0.1s instead of 3s
  masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.1);
  masterGain.connect(ctx.destination);

  // Reverb via convolver
  const convolver = ctx.createConvolver();
  const reverbLen = ctx.sampleRate * 3;
  const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = reverbBuf.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++)
      d[i] = (Math.random() * 2 - 1) * (1 - i / reverbLen) ** 2.5;
  }
  convolver.buffer = reverbBuf;
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.35;
  convolver.connect(reverbGain);
  reverbGain.connect(masterGain);

  // Pads - layered drone oscillators in minor pentatonic
  const padFreqs = [
    { freq: 110, gain: 0.045, type: "triangle" as OscillatorType },
    { freq: 165, gain: 0.028, type: "sine" as OscillatorType },
    { freq: 220, gain: 0.022, type: "triangle" as OscillatorType },
    { freq: 247, gain: 0.015, type: "sine" as OscillatorType },
    { freq: 330, gain: 0.01, type: "sine" as OscillatorType },
  ];
  const oscillators: OscillatorNode[] = [];
  for (const p of padFreqs) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    // Slow vibrato
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.08 + Math.random() * 0.04;
    lfoG.gain.value = 0.6;
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    lfo.start();

    osc.type = p.type;
    osc.frequency.value = p.freq;
    g.gain.value = p.gain;
    osc.connect(g);
    g.connect(masterGain);
    g.connect(convolver);
    osc.start();
    oscillators.push(osc);
  }

  // Soft rain noise
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
  rainFilter.frequency.value = 1200;
  rainFilter.Q.value = 0.4;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0.08;
  noise.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);
  noise.start();

  // Healing frequency chimes (432 Hz, 528 Hz scale)
  const chimeFreqs = [432, 528, 396, 594, 264, 352, 440, 660];
  let chimeTimeout: ReturnType<typeof setTimeout>;
  function scheduleChime() {
    const delay = 3500 + Math.random() * 7000;
    chimeTimeout = setTimeout(() => {
      if (ctx.state === "closed" || ctx.state === "suspended") return;
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, ctx.currentTime);
      env.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5);
      osc.connect(env);
      env.connect(masterGain);
      env.connect(convolver);
      osc.start();
      osc.stop(ctx.currentTime + 5);
      scheduleChime();
    }, delay);
  }
  scheduleChime();

  // Slow LFO on master volume for breathing effect
  const breathLfo = ctx.createOscillator();
  const breathLfoG = ctx.createGain();
  breathLfo.type = "sine";
  breathLfo.frequency.value = 0.04;
  breathLfoG.gain.value = 0.08;
  breathLfo.connect(breathLfoG);
  breathLfoG.connect(masterGain.gain);
  breathLfo.start();

  return () => {
    clearTimeout(chimeTimeout);
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
  };
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const isPlayingRef = useRef(false);

  const toggle = useCallback(async () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        // First play or context was closed — create fresh audio graph
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        if (ctx.state === "suspended") await ctx.resume();
        cleanupRef.current = createAmbientAudio(ctx);
        isPlayingRef.current = true;
        setIsPlaying(true);
        return;
      }

      if (isPlayingRef.current) {
        // Pause — fade out and suspend (preserves audio graph)
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
        setTimeout(async () => {
          if (audioCtxRef.current && audioCtxRef.current.state === "running") {
            await audioCtxRef.current.suspend();
          }
        }, 1300);
        isPlayingRef.current = false;
        setIsPlaying(false);
      } else {
        // Resume from suspended state
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          await ctx.resume();
          cleanupRef.current = createAmbientAudio(ctx);
          isPlayingRef.current = true;
          setIsPlaying(true);
        } else if (ctx.state === "running") {
          // Already running, just mark as playing
          cleanupRef.current = createAmbientAudio(ctx);
          isPlayingRef.current = true;
          setIsPlaying(true);
        } else {
          // Closed or unknown — start fresh
          const newCtx = new AudioCtx();
          audioCtxRef.current = newCtx;
          if (newCtx.state === "suspended") await newCtx.resume();
          cleanupRef.current = createAmbientAudio(newCtx);
          isPlayingRef.current = true;
          setIsPlaying(true);
        }
      }
    } catch (e) {
      console.error("Audio toggle error:", e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
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
