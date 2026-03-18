import { useEffect, useRef, useState } from "react";

const BAR_CONFIGS = [
  { h: "5px", d: "0s" },
  { h: "9px", d: "0.12s" },
  { h: "13px", d: "0.24s" },
  { h: "9px", d: "0.36s" },
  { h: "5px", d: "0.48s" },
] as const;

interface AudioSession {
  ctx: AudioContext;
  masterGain: GainNode;
  chimeTimeout: ReturnType<typeof setTimeout> | null;
}

function startAudio(session: AudioSession) {
  const { ctx, masterGain } = session;

  // Start at full volume immediately — no delay, no ramp
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(0.55, ctx.currentTime);

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

  const padFreqs = [
    { freq: 110, gain: 0.045, type: "triangle" as OscillatorType },
    { freq: 165, gain: 0.028, type: "sine" as OscillatorType },
    { freq: 220, gain: 0.022, type: "triangle" as OscillatorType },
    { freq: 247, gain: 0.015, type: "sine" as OscillatorType },
    { freq: 330, gain: 0.01, type: "sine" as OscillatorType },
  ];
  for (const p of padFreqs) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
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
  }

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

  const chimeFreqs = [432, 528, 396, 594, 264, 352, 440, 660];
  function scheduleChime() {
    const delay = 3500 + Math.random() * 7000;
    session.chimeTimeout = setTimeout(() => {
      if (ctx.state === "closed") return;
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

  const breathLfo = ctx.createOscillator();
  const breathLfoG = ctx.createGain();
  breathLfo.type = "sine";
  breathLfo.frequency.value = 0.04;
  breathLfoG.gain.value = 0.08;
  breathLfo.connect(breathLfoG);
  breathLfoG.connect(masterGain.gain);
  breathLfo.start();
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const sessionRef = useRef<AudioSession | null>(null);
  const busyRef = useRef(false);

  const toggle = async () => {
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (!isPlayingRef.current) {
        // Close any lingering session
        if (sessionRef.current) {
          try { await sessionRef.current.ctx.close(); } catch {}
          sessionRef.current = null;
        }

        const ctx = new AudioCtx();
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);

        const session: AudioSession = { ctx, masterGain, chimeTimeout: null };
        sessionRef.current = session;

        if (ctx.state === "suspended") await ctx.resume();

        // Start audio immediately — sound plays right away
        startAudio(session);

        isPlayingRef.current = true;
        setIsPlaying(true);
      } else {
        // STOP — fade out quickly then close
        const session = sessionRef.current;
        if (session) {
          if (session.chimeTimeout) clearTimeout(session.chimeTimeout);
          const { masterGain, ctx } = session;
          masterGain.gain.cancelScheduledValues(ctx.currentTime);
          masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
          masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          setTimeout(async () => {
            try { await ctx.close(); } catch {}
          }, 400);
          sessionRef.current = null;
        }

        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    } catch (e) {
      console.error("Audio toggle error:", e);
    } finally {
      busyRef.current = false;
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        if (sessionRef.current.chimeTimeout)
          clearTimeout(sessionRef.current.chimeTimeout);
        sessionRef.current.ctx.close().catch(() => {});
        sessionRef.current = null;
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
            {"@keyframes musicBar { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }"}
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
          <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6" cy="18" r="3" fill="none" />
          <circle cx="18" cy="16" r="3" fill="none" />
        </svg>
      )}
    </button>
  );
}
