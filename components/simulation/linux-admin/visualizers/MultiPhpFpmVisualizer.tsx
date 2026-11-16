"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Server, Play, Pause, RotateCcw, Activity } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface MultiPhpFpmVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function MultiPhpFpmVisualizer({ onTimelineSync, externalStep }: MultiPhpFpmVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activePool, setActivePool] = useState<"php74" | "php81" | "php83">("php83");
  const [poolMemory, setPoolMemory] = useState({ php74: "42 MB", php81: "54 MB", php83: "38 MB (JIT On)" });

  const scenes = [
    { title: "Multi-Pool Routing", sub: "proxy_fcgi routing /app1 to PHP 7.4 sock and /app2 to PHP 8.3 sock" },
    { title: "Legacy 7.4 Isolation", sub: "Crashing worker in PHP 7.4 does NOT affect PHP 8.1 or 8.3 production pools" },
    { title: "PHP 8.3 JIT Speed", sub: "OPcache JIT machine code compilation cuts CPU execution latency by 42%" },
    { title: "FPM Process Tuning", sub: "pm.max_children=50, pm.start_servers=10 dynamic socket auto-scaling" },
  ];

  useEffect(() => {
    if (externalStep !== undefined) {
      if (externalStep <= 1) setScene(0);
      else if (externalStep === 2) setScene(1);
      else if (externalStep === 3) setScene(2);
      else if (externalStep >= 4) setScene(3);
    }
  }, [externalStep]);

  const setScene = (idx: number) => {
    setSceneIndex(idx);
    playHapticSound("click");
    if (idx === 0) setActivePool("php83");
    else if (idx === 1) setActivePool("php74");
    else if (idx === 2) setActivePool("php83");
    else if (idx === 3) setActivePool("php81");
    onTimelineSync?.(idx * 5, idx);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSceneIndex((prev) => {
        const next = (prev + 1) % scenes.length;
        setScene(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#07090e] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Multi-PHP-FPM Concurrent Socket Pools Architecture
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            FastCGI UDS Sockets
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setScene(0)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#07090e] to-[#07090e]">
        {/* Status HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ACTIVE SOCKET POOL</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">{activePool.toUpperCase()}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SOCKET PROTOCOL</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">UNIX Domain Socket</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">PROCESS MANAGER</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">pm = dynamic</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">OPCACHE STATUS</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">JIT Enabled</div>
          </div>
        </div>

        {/* 3 Concurrent FPM Pool Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PHP 7.4 Pool */}
          <div className={`p-4 border rounded transition-all ${
            activePool === "php74" ? "border-amber-500 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-[10px] font-mono mb-2">
              <span className="text-amber-400 font-bold">POOL 01: LEGACY</span>
              <span className="text-zinc-500">php7.4-fpm.sock</span>
            </div>
            <div className="font-display text-lg text-zinc-100">PHP 7.4 Engine</div>
            <div className="mt-2 text-[10px] font-mono text-zinc-400 space-y-1 bg-black/60 p-2 rounded border border-zinc-800">
              <div>Path: /var/www/legacy_app</div>
              <div>Memory: {poolMemory.php74}</div>
              <div>Workers: 5 active</div>
            </div>
          </div>

          {/* PHP 8.1 Pool */}
          <div className={`p-4 border rounded transition-all ${
            activePool === "php81" ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-[10px] font-mono mb-2">
              <span className="text-cyan-400 font-bold">POOL 02: STABLE</span>
              <span className="text-zinc-500">php8.1-fpm.sock</span>
            </div>
            <div className="font-display text-lg text-zinc-100">PHP 8.1 Engine</div>
            <div className="mt-2 text-[10px] font-mono text-zinc-400 space-y-1 bg-black/60 p-2 rounded border border-zinc-800">
              <div>Path: /var/www/api_service</div>
              <div>Memory: {poolMemory.php81}</div>
              <div>Workers: 12 active</div>
            </div>
          </div>

          {/* PHP 8.3 Pool */}
          <div className={`p-4 border rounded transition-all ${
            activePool === "php83" ? "border-indigo-500 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-[10px] font-mono mb-2">
              <span className="text-indigo-400 font-bold">POOL 03: NEXT-GEN</span>
              <span className="text-zinc-500">php8.3-fpm.sock</span>
            </div>
            <div className="font-display text-lg text-zinc-100">PHP 8.3 (JIT Active)</div>
            <div className="mt-2 text-[10px] font-mono text-zinc-400 space-y-1 bg-black/60 p-2 rounded border border-zinc-800">
              <div>Path: /var/www/modern_app</div>
              <div>Memory: {poolMemory.php83}</div>
              <div>Workers: 20 active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Scrubber */}
      <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto font-mono text-xs">
            {scenes.map((s, idx) => (
              <button
                key={s.title}
                onClick={() => setScene(idx)}
                className={`px-3 py-2 border rounded text-left transition-all ${
                  sceneIndex === idx
                    ? "border-[#FF5400] bg-zinc-900 text-amber-400 font-bold shadow-[0_0_10px_rgba(255,84,0,0.2)]"
                    : "border-zinc-800 bg-[#0d1117] text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase">SCENE 0{idx + 1}</div>
                <div className="truncate text-xs mt-0.5">{s.title}</div>
              </button>
            ))}
          </div>

          <div className="text-right font-mono text-xs text-zinc-400 hidden sm:block max-w-xs">
            <span className="text-[#FF5400] font-bold">// ACTIVE PHASE:</span> {scenes[sceneIndex].sub}
          </div>
        </div>
      </div>
    </div>
  );
}
