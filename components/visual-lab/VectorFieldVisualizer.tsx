"use client";

import React, { useEffect, useRef, useState } from "react";
import { Compass, RotateCw, Sliders, Play, Pause } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeContext";

type FieldType = "vortex" | "saddle" | "sink" | "wave";

export default function VectorFieldVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const { isFieldGuide } = useTheme();

  const [fieldType, setFieldType] = useState<FieldType>("vortex");
  const [particleSpeed, setParticleSpeed] = useState(1.2);
  const [particleCount, setParticleCount] = useState(180);
  const [isSimulating, setIsSimulating] = useState(true);

  // Field calculation function
  const computeField = (x: number, y: number, type: FieldType): [number, number] => {
    switch (type) {
      case "vortex":
        return [-y, x];
      case "saddle":
        return [x, -y];
      case "sink":
        return [-x, -y];
      case "wave":
        return [Math.sin(y * 2), Math.cos(x * 2)];
      default:
        return [-y, x];
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initial clear with solid color to prevent artifacts
    ctx.fillStyle = isFieldGuide ? "#FCF9EF" : "#07090e";
    ctx.fillRect(0, 0, width, height);

    // Initialize particles
    interface Particle {
      x: number;
      y: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
      life: Math.random() * 100,
      maxLife: 60 + Math.random() * 80,
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const render = () => {
      if (isVisible && isSimulating) {
        // Semi-transparent trailing background for flow streaks
        ctx.fillStyle = isFieldGuide
          ? "rgba(252, 249, 239, 0.26)"
          : "rgba(7, 9, 14, 0.18)";
        ctx.fillRect(0, 0, width, height);

        const scale = Math.min(width, height) / 4.5;
        const centerX = width / 2;
        const centerY = height / 2;

        // Draw grid lines
        ctx.strokeStyle = isFieldGuide
          ? "rgba(11, 37, 69, 0.08)"
          : "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let x = -2; x <= 2; x += 1) {
          ctx.beginPath();
          ctx.moveTo(centerX + x * scale, 0);
          ctx.lineTo(centerX + x * scale, height);
          ctx.stroke();
        }
        for (let y = -2; y <= 2; y += 1) {
          ctx.beginPath();
          ctx.moveTo(0, centerY + y * scale);
          ctx.lineTo(width, centerY + y * scale);
          ctx.stroke();
        }

        // Stationary vector direction arrows on sparse grid
        const step = 0.5;
        for (let gx = -1.8; gx <= 1.8; gx += step) {
          for (let gy = -1.8; gy <= 1.8; gy += step) {
            const [vx, vy] = computeField(gx, gy, fieldType);
            const len = Math.hypot(vx, vy) || 0.001;
            const normX = (vx / len) * 13;
            const normY = (vy / len) * 13;

            const px = centerX + gx * scale;
            const py = centerY - gy * scale;

            ctx.strokeStyle = isFieldGuide
              ? "rgba(11, 37, 69, 0.28)"
              : "rgba(0, 245, 212, 0.22)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + normX, py - normY);
            ctx.stroke();
          }
        }

        // Draw moving flow particles
        particles.forEach((p) => {
          const [vx, vy] = computeField(p.x, p.y, fieldType);
          const len = Math.hypot(vx, vy) || 0.001;

          p.x += (vx / len) * 0.015 * particleSpeed;
          p.y += (vy / len) * 0.015 * particleSpeed;
          p.life += 1;

          if (p.life > p.maxLife || Math.abs(p.x) > 2.2 || Math.abs(p.y) > 2.2) {
            p.x = (Math.random() - 0.5) * 4;
            p.y = (Math.random() - 0.5) * 4;
            p.life = 0;
          }

          const screenX = centerX + p.x * scale;
          const screenY = centerY - p.y * scale;

          if (isFieldGuide) {
            // Archimedean Drafting Ink Palette
            ctx.fillStyle =
              fieldType === "vortex"
                ? "#0B2545" // Prussian Blue
                : fieldType === "saddle"
                ? "#D75C2A" // Terracotta
                : fieldType === "sink"
                ? "#2A7553" // Verdigris
                : "#A8421A"; // Deep Ochre
          } else {
            // Cyber Terminal Neon Palette
            ctx.fillStyle =
              fieldType === "vortex"
                ? "#00F5D4" // Neon Cyan
                : fieldType === "saddle"
                ? "#BD00FF" // Cyber Purple
                : fieldType === "sink"
                ? "#10B981" // Emerald
                : "#FF7A33"; // Neon Amber
          }

          ctx.beginPath();
          ctx.arc(screenX, screenY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [fieldType, particleSpeed, particleCount, isSimulating, isFieldGuide]);

  return (
    <div className="w-full bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] rounded-xl p-6 shadow-2xl overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--ink-faint,#1f2937)]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[var(--orange,#FF7A33)]" />
            <h3 className="font-mono text-base font-semibold text-[var(--ink,#f4f4f5)]">
              10+2 Calculus & STEM Vector Field Visualizer
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--orange-soft,rgba(255,122,51,0.12))] text-[var(--orange,#FF7A33)] border border-[var(--orange,#FF7A33)] font-semibold uppercase">
              Calculus & Mechanics
            </span>
          </div>
          <p className="text-xs text-[var(--ink-soft,#a1a1aa)] font-mono mt-1">
            Dynamic phase portrait illustrating vector differentials F(x, y), curl, divergence, and fluid streamlines for Senior Secondary STEM students.
          </p>
        </div>

        {/* Play/Pause */}
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--paper-warm,#161b22)] hover:bg-[var(--paper-light,#1f2937)] border border-[var(--ink-faint,#374151)] text-xs font-mono text-[var(--ink,#e4e4e7)] transition-colors cursor-pointer shrink-0"
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-[var(--orange,#FF7A33)]" />
              <span>PAUSE STREAM</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-[var(--green,#10B981)]" />
              <span>PLAY STREAM</span>
            </>
          )}
        </button>
      </div>

      {/* Field Equations Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2 my-4">
        {[
          { id: "vortex", label: "Vortex: F = (-y, x)", formula: "curl ≠ 0" },
          { id: "saddle", label: "Saddle: F = (x, -y)", formula: "hyperbolic" },
          { id: "sink", label: "Central Sink: F = (-x, -y)", formula: "div < 0" },
          { id: "wave", label: "Oscillator: F = (sin y, cos x)", formula: "periodic" },
        ].map((f) => {
          const isActive = fieldType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFieldType(f.id as FieldType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                isActive
                  ? isFieldGuide
                    ? "bg-[#EDE3C9] text-[#0B2545] border-[#0B2545] font-bold shadow-sm"
                    : "bg-white/10 text-amber-400 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-[var(--paper-warm,#161b22)] text-[var(--ink-soft,#a1a1aa)] border-[var(--ink-trace,#1f2937)] hover:text-[var(--ink,#f4f4f5)]"
              }`}
            >
              <span>{f.label}</span>
              <span className="text-[10px] opacity-75 ml-1.5 font-normal">({f.formula})</span>
            </button>
          );
        })}
      </div>

      {/* Canvas Area with Corner Brackets */}
      <div className="relative my-4 aspect-[16/9] md:aspect-[21/9] max-h-[420px] bg-[var(--canvas-bg,#07090e)] border border-[var(--ink-faint,#1f2937)] rounded-xl overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--ink-trace,#1f2937)] text-xs font-mono text-[var(--ink,#d4d4d8)]">
        <div className="flex items-center gap-3">
          <Sliders className="w-4 h-4 text-[var(--orange,#FF7A33)] shrink-0" />
          <span className="shrink-0">STREAM SPEED: {particleSpeed.toFixed(1)}x</span>
          <input
            type="range"
            min="0.4"
            max="3.0"
            step="0.2"
            value={particleSpeed}
            onChange={(e) => setParticleSpeed(Number(e.target.value))}
            className="w-full accent-[var(--orange,#FF7A33)] cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <RotateCw className="w-4 h-4 text-[var(--green,#10B981)] shrink-0" />
          <span className="shrink-0">PARTICLE DENSITY: {particleCount}</span>
          <input
            type="range"
            min="60"
            max="300"
            step="20"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full accent-[var(--green,#10B981)] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
