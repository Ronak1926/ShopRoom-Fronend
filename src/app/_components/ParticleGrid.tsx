"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseR: number;
  baseOp: number;
  r: number;
  opacity: number;
};

const COUNT = 90;
const MAX_DIST = 140;
const MOUSE_RADIUS = 180;

export default function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function init() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = Array.from({ length: COUNT }, () => {
        const baseR = Math.random() * 1.5 + 0.7;
        const baseOp = Math.random() * 0.28 + 0.12;
        return {
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseR,
          baseOp,
          r: baseR,
          opacity: baseOp,
        };
      });
    }

    init();

    const ro = new ResizeObserver(init);
    ro.observe(canvas);

    const section = canvas.parentElement;

    function onMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }

    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;
      const { x: mx, y: my } = mouseRef.current;
      const W = canvas.width;
      const H = canvas.height;

      // Update + draw particles
      for (const p of ps) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        const inRange = d2 < MOUSE_RADIUS * MOUSE_RADIUS;

        // Smooth influence factor: 0 (far) → 1 (cursor)
        const influence = inRange
          ? Math.pow(1 - Math.sqrt(d2) / MOUSE_RADIUS, 2)
          : 0;

        // Repel gently
        if (inRange && d2 > 1) {
          const d = Math.sqrt(d2);
          const strength = influence * 0.28;
          p.vx += (dx / d) * strength;
          p.vy += (dy / d) * strength;
        }

        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < -10) p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;

        // Lerp size: grow up to ~4.5× base radius near cursor
        const targetR = p.baseR + influence * p.baseR * 4.5;
        // Lerp opacity: brighten up to 0.95 near cursor
        const targetOp = p.baseOp + influence * (0.95 - p.baseOp);
        p.r += (targetR - p.r) * 0.1;
        p.opacity += (targetOp - p.opacity) * 0.1;

        // Glow halo for enlarged dots
        const isGlowing = p.r > p.baseR * 1.8;
        if (isGlowing) {
          ctx.shadowBlur = p.r * 4;
          ctx.shadowColor = `rgba(160,140,255,${p.opacity * 0.7})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        // Tint near-cursor dots toward lavender
        const blend = Math.round(255 - influence * 80);
        ctx.fillStyle = `rgba(${blend},${blend},255,${p.opacity})`;
        ctx.fill();

        if (isGlowing) {
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }
      }

      // Draw connections — skip expensive sqrt when clearly too far
      const MAX_DIST2 = MAX_DIST * MAX_DIST;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d2c = dx * dx + dy * dy;
          if (d2c < MAX_DIST2) {
            const d = Math.sqrt(d2c);
            const alpha = (1 - d / MAX_DIST) * 0.28;
            // Brighten connections when either particle is enlarged
            const boost = Math.max(
              (ps[i].r - ps[i].baseR) / (ps[i].baseR * 4 + 0.001),
              (ps[j].r - ps[j].baseR) / (ps[j].baseR * 4 + 0.001),
            );
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(91,71,212,${Math.min(alpha + boost * 0.4, 0.7)})`;
            ctx.lineWidth = 0.75 + boost * 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
}
