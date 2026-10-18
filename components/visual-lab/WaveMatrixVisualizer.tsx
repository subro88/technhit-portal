"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Play, Pause, RotateCcw, Sliders, Activity, Sparkles } from "lucide-react";

export default function WaveMatrixVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [waveSpeed, setWaveSpeed] = useState(1200);
  const [dotScale, setDotScale] = useState(2.2);

  const GRID_ROWS = 14;
  const GRID_COLS = 24;

  const initAnimation = () => {
    if (!containerRef.current) return;
    if (animationRef.current) animationRef.current.pause();

    animationRef.current = anime({
      targets: containerRef.current.querySelectorAll(".matrix-dot"),
      scale: [
        { value: 0.3, easing: "easeOutSine", duration: 400 },
        { value: dotScale, easing: "easeInOutQuad", duration: waveSpeed },
        { value: 0.5, easing: "easeInOutSine", duration: waveSpeed * 0.8 },
      ],
      opacity: [
        { value: 0.2, duration: 300 },
        { value: 0.95, duration: waveSpeed },
        { value: 0.3, duration: waveSpeed * 0.8 },
      ],
      translateY: [
        { value: -12, easing: "easeInOutSine", duration: waveSpeed },
        { value: 0, easing: "easeOutQuad", duration: waveSpeed * 0.8 },
      ],
      delay: anime.stagger(60, {
        grid: [GRID_COLS, GRID_ROWS],
        from: "center",
      }),
      loop: true,
      autoplay: isPlaying,
    });
  };

  useEffect(() => {
    initAnimation();

    // IntersectionObserver to pause offscreen (Anti-Slop GPU performance)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && animationRef.current) {
            animationRef.current.pause();
          } else if (entry.isIntersecting && isPlaying && animationRef.current) {
            animationRef.current.play();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) animationRef.current.pause();
    };
  }, [waveSpeed, dotScale]);

  const togglePlayback = () => {
    if (!animationRef.current) return;
    if (isPlaying) {
      animationRef.current.pause();
      setIsPlaying(false);
    } else {
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  const restartWave = () => {
    if (animationRef.current) {
      animationRef.current.restart();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-6 shadow-2xl overflow-hidden">
      {/* Header telemetry and control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            <h3 className="font-mono text-base font-semibold text-zinc-100">
              2D Harmonic Wave Matrix Dispersion
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
              Anime.js v3.2
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Radial stagger dispersion simulating seismic and electromagnetic wave propagation across discrete 2D lattice.
          </p>
        </div>

        {/* Live Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePlayback}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 border border-cyber-border text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-cyber-amber" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>RUN</span>
              </>
            )}
          </button>
          <button
            onClick={restartWave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 border border-cyber-border text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas Zone */}
      <div
        ref={containerRef}
        className="relative my-6 aspect-[16/9] md:aspect-[21/9] max-h-[420px] bg-cyber-950 border border-cyber-border/70 rounded-xl flex items-center justify-center overflow-hidden p-6"
      >
        <div
          className="grid gap-2 sm:gap-3"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_ROWS * GRID_COLS }).map((_, i) => (
            <div
              key={i}
              className="matrix-dot w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyber-cyan transition-transform will-change-transform shadow-[0_0_8px_rgba(0,245,212,0.4)]"
            />
          ))}
        </div>
      </div>

      {/* Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cyber-border text-xs font-mono text-zinc-300">
        <div className="flex items-center gap-3">
          <Sliders className="w-4 h-4 text-cyber-cyan shrink-0" />
          <span className="shrink-0">WAVE PERIOD: {waveSpeed}ms</span>
          <input
            type="range"
            min="600"
            max="2400"
            step="100"
            value={waveSpeed}
            onChange={(e) => setWaveSpeed(Number(e.target.value))}
            className="w-full accent-cyber-cyan cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-cyber-purple shrink-0" />
          <span className="shrink-0">AMPLITUDE: {dotScale}x</span>
          <input
            type="range"
            min="1.2"
            max="3.5"
            step="0.1"
            value={dotScale}
            onChange={(e) => setDotScale(Number(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
