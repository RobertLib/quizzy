/**
 * Tiny synthesised sound engine — no audio assets to download, and it stays
 * silent until the player's first interaction (browser autoplay rules).
 */

type Wave = OscillatorType;

interface Note {
  freq: number;
  /** Offset from the start of the cue, in seconds. */
  at: number;
  duration: number;
  wave?: Wave;
  gain?: number;
}

export type SoundName =
  | "click"
  | "select"
  | "correct"
  | "wrong"
  | "streak"
  | "tick"
  | "timeout"
  | "powerup"
  | "achievement"
  | "finish";

const CUES: Record<SoundName, Note[]> = {
  click: [{ freq: 440, at: 0, duration: 0.05, wave: "triangle", gain: 0.14 }],
  select: [{ freq: 620, at: 0, duration: 0.07, wave: "triangle", gain: 0.16 }],
  correct: [
    { freq: 659.25, at: 0, duration: 0.11 },
    { freq: 830.61, at: 0.08, duration: 0.11 },
    { freq: 987.77, at: 0.16, duration: 0.2 },
  ],
  wrong: [
    { freq: 207.65, at: 0, duration: 0.16, wave: "sawtooth", gain: 0.14 },
    { freq: 155.56, at: 0.12, duration: 0.24, wave: "sawtooth", gain: 0.14 },
  ],
  streak: [
    { freq: 987.77, at: 0, duration: 0.08 },
    { freq: 1318.51, at: 0.07, duration: 0.08 },
    { freq: 1567.98, at: 0.14, duration: 0.16 },
  ],
  tick: [{ freq: 880, at: 0, duration: 0.04, wave: "square", gain: 0.07 }],
  timeout: [
    { freq: 392, at: 0, duration: 0.12, wave: "square", gain: 0.12 },
    { freq: 261.63, at: 0.1, duration: 0.28, wave: "square", gain: 0.12 },
  ],
  powerup: [
    { freq: 523.25, at: 0, duration: 0.07 },
    { freq: 783.99, at: 0.06, duration: 0.07 },
    { freq: 1046.5, at: 0.12, duration: 0.14 },
  ],
  achievement: [
    { freq: 523.25, at: 0, duration: 0.1 },
    { freq: 659.25, at: 0.09, duration: 0.1 },
    { freq: 783.99, at: 0.18, duration: 0.1 },
    { freq: 1046.5, at: 0.27, duration: 0.32 },
  ],
  finish: [
    { freq: 523.25, at: 0, duration: 0.13 },
    { freq: 659.25, at: 0.12, duration: 0.13 },
    { freq: 783.99, at: 0.24, duration: 0.13 },
    { freq: 1046.5, at: 0.36, duration: 0.4 },
  ],
};

let ctx: AudioContext | null = null;
let enabled = true;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function play(name: SoundName) {
  if (!enabled) return;
  const audio = context();
  if (!audio) return;

  const start = audio.currentTime + 0.001;
  for (const note of CUES[name]) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const peak = note.gain ?? 0.2;
    const t0 = start + note.at;
    const t1 = t0 + note.duration;

    osc.type = note.wave ?? "sine";
    osc.frequency.setValueAtTime(note.freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t1);

    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t1 + 0.02);
  }
}

const HAPTIC_PATTERNS: Partial<Record<SoundName, number | number[]>> = {
  select: 8,
  correct: 18,
  wrong: [30, 45, 30],
  streak: [12, 30, 12],
  powerup: 14,
  achievement: [15, 40, 15, 40, 25],
  timeout: [40, 60, 40],
};

export function vibrate(name: SoundName, allowed: boolean) {
  if (!allowed || typeof navigator === "undefined" || !navigator.vibrate) return;
  const pattern = HAPTIC_PATTERNS[name];
  if (!pattern) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* unsupported — ignore */
  }
}

/** Convenience: play a cue and fire its haptic counterpart together. */
export function cue(
  name: SoundName,
  opts: { sound: boolean; haptics: boolean }
) {
  if (opts.sound) play(name);
  vibrate(name, opts.haptics);
}
