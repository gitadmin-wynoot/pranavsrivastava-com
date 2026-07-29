"use client";

import { useEffect, useRef, useState } from "react";

/*
  SyncField — a live Kuramoto model. Sixty oscillators, each ticking at its own
  natural pace, arranged as runners on a circular track (position = phase). Turn
  up the coupling and, past a threshold, they spontaneously fall into step — the
  same maths behind synchronised fireflies, applause, and firing neurons
  (Winfree; Kuramoto, 1975; Strogatz, "Sync", 2003). Physics, not mysticism.

  The mean-field form makes it O(N): each oscillator feels the crowd's average
  phase, weighted by how coherent the crowd already is.
*/

const N = 60;

export function SyncField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const kRef = useRef(0.6);
  const [k, setK] = useState(0.6);
  const [coherence, setCoherence] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Deterministic-ish spread of natural frequencies (a small Gaussian-like mix).
    const phase = new Float64Array(N);
    const omega = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      phase[i] = Math.random() * Math.PI * 2;
      const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; // ~N(0,1)
      omega[i] = 1.1 + g * 0.5; // rad/s spread around a shared tempo
    }

    let raf = 0;
    let frame = 0;

    const step = (dt: number) => {
      // Mean field: R e^{iψ} = average of unit phase vectors.
      let sx = 0;
      let sy = 0;
      for (let i = 0; i < N; i++) {
        sx += Math.cos(phase[i]);
        sy += Math.sin(phase[i]);
      }
      sx /= N;
      sy /= N;
      const R = Math.hypot(sx, sy);
      const psi = Math.atan2(sy, sx);
      const K = kRef.current;
      for (let i = 0; i < N; i++) {
        // dθ/dt = ω + K·R·sin(ψ − θ)
        phase[i] += (omega[i] + K * R * Math.sin(psi - phase[i])) * dt;
      }
      return R;
    };

    const draw = (R: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = 240;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 12;
      const rr = Math.min(w, h) * 0.32;

      // track
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(120,120,135,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // resultant (coherence) vector
      let sx = 0;
      let sy = 0;
      for (let i = 0; i < N; i++) {
        sx += Math.cos(phase[i]);
        sy += Math.sin(phase[i]);
      }
      const psi = Math.atan2(sy, sx);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(psi) * rr * R, cy + Math.sin(psi) * rr * R);
      ctx.strokeStyle = "rgba(59,130,246,0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // oscillators — hue = phase, so coherence reads as one colour clumping
      for (let i = 0; i < N; i++) {
        const x = cx + Math.cos(phase[i]) * rr;
        const y = cy + Math.sin(phase[i]) * rr;
        const hue = ((phase[i] % (Math.PI * 2)) / (Math.PI * 2)) * 360;
        ctx.beginPath();
        ctx.arc(x, y, 3.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 55%, 0.9)`;
        ctx.fill();
      }

      // coherence bar
      const bx = cx - rr;
      const by = h - 16;
      const bw = rr * 2;
      ctx.fillStyle = "rgba(120,120,135,0.2)";
      ctx.fillRect(bx, by, bw, 4);
      ctx.fillStyle = "rgba(16,185,129,0.9)";
      ctx.fillRect(bx, by, bw * R, 4);
    };

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const R = step(dt);
      draw(R);
      frame++;
      if (frame % 8 === 0) setCoherence(R);
      raf = requestAnimationFrame(loop);
    };

    if (reduce) {
      // Settle to a representative state and render one static frame.
      kRef.current = 2.5;
      for (let s = 0; s < 400; s++) step(0.05);
      const R0 = step(0.05);
      draw(R0);
      setCoherence(R0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Sixty tickers, each at its own pace — turn up the connection
      </div>
      <div className="p-4 sm:p-5">
        <canvas ref={canvasRef} className="w-full" style={{ height: 240 }} />

        <div className="mt-3 flex items-center gap-3">
          <label className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
            Connection (coupling)
          </label>
          <input
            type="range"
            min={0}
            max={4}
            step={0.05}
            value={k}
            onChange={(e) => {
              const v = Number(e.target.value);
              setK(v);
              kRef.current = v;
            }}
            className="flex-1 cursor-pointer accent-blue-500"
            aria-label="Coupling strength"
          />
          <span className="w-28 shrink-0 text-right text-[11px] text-zinc-400 tabular-nums">
            coherence {Math.round(coherence * 100)}%
          </span>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Below a critical coupling they twinkle at random — a crowd of strangers. Push past the threshold and they lock into one pulse, no conductor required. The felt sense of &ldquo;everyone&rsquo;s on the same wavelength&rdquo; has a differential equation, and our era has been quietly turning up the dial.
        </p>
      </div>
    </figure>
  );
}
