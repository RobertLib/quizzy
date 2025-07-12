"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
}

const COLORS = [
  "#7b4ce0",
  "#a486f5",
  "#f0700a",
  "#f5c531",
  "#34d277",
  "#37b6f0",
  "#f76b83",
];

interface ConfettiProps {
  /** Bump this to fire another burst. */
  trigger: number;
  /** 0 → 1, scales particle count. */
  intensity?: number;
}

export default function Confetti({ trigger, intensity = 1 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.round(90 * Math.max(0.3, Math.min(1, intensity)));
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const speed = 6 + Math.random() * 9;
      return {
        x: width / 2 + (Math.random() - 0.5) * width * 0.35,
        y: height * 0.42,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 7,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.28,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      };
    });

    let running = true;
    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of particles) {
        p.vy += 0.24;
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 0.008;

        if (p.life > 0 && p.y < height + 40) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      }

      if (alive) frameRef.current = requestAnimationFrame(step);
      else ctx.clearRect(0, 0, width, height);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
