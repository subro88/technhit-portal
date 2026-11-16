"use client";

import React, { useState, useEffect } from "react";
import { Server, Database, Code2, Play, Pause, RotateCcw, Activity } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface LampStackMasterclassVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function LampStackMasterclassVisualizer({ onTimelineSync, externalStep }: LampStackMasterclassVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [dbLatency, setDbLatency] = useState("0.8ms");
  const [innoDbHitRate, setInnoDbHitRate] = useState("99.2%");

  const scenes = [
    { title: "3-Tier Request Flow", sub: "HTTP ingress -> Apache MPM -> PHP-FPM UDS -> MariaDB InnoDB buffer pool" },
    { title: "InnoDB Buffer Cache", sub: "99.2% memory hit ratio eliminates physical disk I/O bottlenecks" },
    { title: "Slow Query Triage", sub: "Slow query log catches unindexed table scans; EXPLAIN query optimization" },
    { title: "Production Hardened", sub: "mysql_secure_installation + systemd sandboxing across all 3 tiers" },
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
    if (idx === 0) {
      setDbLatency("1.2ms");
      setInnoDbHitRate("98.4%");
    } else if (idx === 1) {
      setDbLatency("0.4ms");
      setInnoDbHitRate("99.8%");
    } else if (idx === 2) {
      setDbLatency("45.0ms (Slow Query)");
      setInnoDbHitRate("62.1%");
    } else if (idx === 3) {
      setDbLatency("0.8ms");
      setInnoDbHitRate("99.2%");
    }
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
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Enterprise LAMP Stack 3-Tier Execution Pipeline
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            Linux + Apache + MySQL + PHP
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">WEB TIER (APACHE)</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">Event MPM</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">APP TIER (PHP)</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">PHP-FPM UDS</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DB LATENCY (MARIADB)</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{dbLatency}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">BUFFER POOL HIT</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{innoDbHitRate}</div>
          </div>
        </div>

        {/* 3-Tier Architecture Diagram */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Tier 1: Apache */}
            <div className="p-4 border border-cyan-500/30 rounded bg-cyan-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">TIER 1: WEB SERVER</span>
                <span className="text-zinc-500">Port 80/443</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Apache 2.4 HTTPD</div>
              <p className="text-xs text-zinc-400 font-body">Handles TLS termination, static files, and proxy_fcgi pass.</p>
              <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-2 rounded border border-zinc-800">
                systemctl status apache2
              </div>
            </div>

            {/* Tier 2: PHP-FPM */}
            <div className="p-4 border border-indigo-500/30 rounded bg-indigo-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-indigo-400 font-bold">TIER 2: RUNTIME</span>
                <span className="text-zinc-500">Unix Domain Socket</span>
              </div>
              <div className="font-display text-lg text-zinc-100">PHP 8.2 FastCGI</div>
              <p className="text-xs text-zinc-400 font-body">Worker process pools executing dynamic application code.</p>
              <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-2 rounded border border-zinc-800">
                /run/php/php8.2-fpm.sock
              </div>
            </div>

            {/* Tier 3: MariaDB */}
            <div className="p-4 border border-emerald-500/30 rounded bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">TIER 3: DATABASE</span>
                <span className="text-zinc-500">Port 3306</span>
              </div>
              <div className="font-display text-lg text-zinc-100">MariaDB 10.11 InnoDB</div>
              <p className="text-xs text-zinc-400 font-body">ACID transactional persistence with InnoDB buffer caching.</p>
              <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-2 rounded border border-zinc-800">
                innodb_buffer_pool_size = 2G
              </div>
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
