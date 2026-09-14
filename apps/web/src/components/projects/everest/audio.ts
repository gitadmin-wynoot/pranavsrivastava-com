"use client";

/**
 * A tiny sound-effect engine — every cue here is synthesized at call time with
 * the Web Audio API. No audio files, no licensing concerns, no network request.
 * Browsers also block sound until a real user gesture has occurred, so nothing
 * plays on page load regardless of the mute preference below.
 */

let ctx: AudioContext | null = null;
let muted = false;
const STORAGE_KEY = "everest-audio-muted";

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => { /* resumes on the next real gesture instead */ });
  return ctx;
}

export function initAudio() {
  try { muted = localStorage.getItem(STORAGE_KEY) === "1"; } catch { muted = false; }
}
export function isMuted() { return muted; }
export function setMuted(next: boolean) {
  muted = next;
  try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch { /* optional preference */ }
  if (!next) ensureContext();
  else stopWind();
}

function tone(freq: number, duration: number, opts: { type?: OscillatorType; gain?: number; delay?: number; slideTo?: number } = {}) {
  if (muted) return;
  const audio = ensureContext();
  if (!audio) return;
  const start = audio.currentTime + (opts.delay ?? 0);
  const osc = audio.createOscillator();
  const gainNode = audio.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(freq, start);
  if (opts.slideTo) osc.frequency.linearRampToValueAtTime(opts.slideTo, start + duration);
  const peak = opts.gain ?? 0.05;
  gainNode.gain.setValueAtTime(0, start);
  gainNode.gain.linearRampToValueAtTime(peak, start + Math.min(0.02, duration / 4));
  gainNode.gain.linearRampToValueAtTime(0, start + duration);
  osc.connect(gainNode); gainNode.connect(audio.destination);
  osc.start(start); osc.stop(start + duration + 0.02);
}

function noiseBurst(duration: number, gain = 0.04) {
  if (muted) return;
  const audio = ensureContext();
  if (!audio) return;
  const length = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass"; filter.frequency.value = 1800;
  const gainNode = audio.createGain();
  gainNode.gain.value = gain;
  source.connect(filter); filter.connect(gainNode); gainNode.connect(audio.destination);
  source.start();
}

/** A short radio click/static burst — an MCP call going out or a chatter line arriving. */
export function radioClick() { noiseBurst(0.06, 0.05); tone(1400, 0.03, { type: "square", gain: 0.02, delay: 0.03 }); }
/** A tool call came back successfully. */
export function toolSuccessBeep() { tone(880, 0.09, { gain: 0.05 }); tone(1320, 0.09, { gain: 0.045, delay: 0.09 }); }
/** A tool call failed, was blocked, or errored. */
export function toolErrorBuzz() { tone(180, 0.18, { type: "sawtooth", gain: 0.05, slideTo: 120 }); }
/** Something is waiting on a human decision (an approval gate). */
export function waitingTone() { tone(700, 0.05, { type: "square", gain: 0.025 }); }
/** An incident just started. */
export function alertTone() { tone(520, 0.22, { type: "triangle", gain: 0.06, slideTo: 720 }); tone(520, 0.22, { type: "triangle", gain: 0.06, slideTo: 720, delay: 0.28 }); }
/** A badge was earned. */
export function successChime() { [660, 880, 1320].forEach((freq, i) => tone(freq, 0.22, { gain: 0.045, delay: i * 0.09 })); }
/** The expedition reached a winning resolution. */
export function fanfare() { [523, 659, 784, 1046].forEach((freq, i) => tone(freq, 0.28, { gain: 0.05, delay: i * 0.11 })); }
/** The expedition ended in failure. */
export function missionFailedTone() { tone(300, 0.3, { type: "sawtooth", gain: 0.06, slideTo: 140 }); tone(220, 0.35, { type: "sawtooth", gain: 0.05, slideTo: 90, delay: 0.32 }); }
/** A discrete architecture decision was made (a button press, not a slider drag). */
export function decisionClick() { tone(700, 0.045, { type: "square", gain: 0.025 }); }
/** Reached a new camp while auto-climbing. */
export function arrivalChime() { tone(760, 0.14, { gain: 0.04 }); tone(980, 0.14, { gain: 0.035, delay: 0.1 }); }

let windSource: AudioBufferSourceNode | null = null;
let windGain: GainNode | null = null;
/** A faint, looping filtered-noise wind bed — starts silent and fades in. */
export function startWind() {
  if (muted || windSource) return;
  const audio = ensureContext();
  if (!audio) return;
  const length = audio.sampleRate * 2;
  const buffer = audio.createBuffer(1, length, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const source = audio.createBufferSource();
  source.buffer = buffer; source.loop = true;
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass"; filter.frequency.value = 500;
  const gainNode = audio.createGain();
  gainNode.gain.value = 0;
  source.connect(filter); filter.connect(gainNode); gainNode.connect(audio.destination);
  source.start();
  gainNode.gain.linearRampToValueAtTime(0.016, audio.currentTime + 1.2);
  windSource = source; windGain = gainNode;
}
/** severity: 0 (calm) to 1 (storm) — reuses the same scale the visual weather uses. */
export function setWindIntensity(severity: number) {
  if (!windGain || !ctx) return;
  windGain.gain.linearRampToValueAtTime(0.01 + Math.min(1, Math.max(0, severity)) * 0.024, ctx.currentTime + 0.6);
}
export function stopWind() {
  if (!windSource || !windGain || !ctx) return;
  const gainNode = windGain, source = windSource;
  gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
  setTimeout(() => { try { source.stop(); } catch { /* already stopped */ } }, 600);
  windSource = null; windGain = null;
}
