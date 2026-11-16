"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, Play, Pause, RotateCcw, Lock, HardDrive } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface ApacheVHostMultiTenantVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function ApacheVHostMultiTenantVisualizer({ onTimelineSync, externalStep }: ApacheVHostMultiTenantVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeTenant, setActiveTenant] = useState<"tenant1" | "tenant2">("tenant1");
  const [isolationActive, setIsolationActive] = useState(true);
  const [mpmEventWorkers, setMpmEventWorkers] = useState("150 threads");

  const scenes = [
    { title: "Multi-Tenant Ingress", sub: "Dispatched client traffic to tenant1.example vs tenant2.example" },
    { title: "POSIX User Isolation", sub: "Enforcing strict chroot and separate system users per virtual host" },
    { title: "Cross-Site Leak Attack", sub: "Malicious symlink attack simulated; locked down via SymLinksIfOwnerMatch" },
    { title: "MPM Event Optimization", sub: "Non-blocking keep-alive workers serving 10,000 concurrent multi-tenant sockets" },
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
      setActiveTenant("tenant1");
      setIsolationActive(true);
      setMpmEventWorkers("150 threads");
    } else if (idx === 1) {
      setActiveTenant("tenant2");
      setIsolationActive(true);
      setMpmEventWorkers("200 threads");
    } else if (idx === 2) {
      setActiveTenant("tenant1");
      setIsolationActive(false);
      setMpmEventWorkers("250 threads");
    } else if (idx === 3) {
      setActiveTenant("tenant2");
      setIsolationActive(true);
      setMpmEventWorkers("400 threads (Event MPM)");
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
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Apache Multi-Tenant Shared Hosting &amp; Security Isolation Architecture
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            POSIX Sandbox / MPM Event
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

      {/* Main Interactive Diagram */}
      <div className="p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#07090e] to-[#07090e]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">HOST TENANT</div>
            <div className="text-lg font-bold text-blue-400 mt-0.5">{activeTenant}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SYMLINK ATTACK TRAP</div>
            <div className={`text-lg font-bold mt-0.5 ${isolationActive ? "text-emerald-400" : "text-red-400"}`}>
              {isolationActive ? "BLOCKED" : "EXPOSURE RISK"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">CONCURRENCY POOL</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{mpmEventWorkers}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ACCESS LOG AUDIT</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">Isolated (.log)</div>
          </div>
        </div>

        {/* Tenant Boxes */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant 1 */}
            <div className={`p-4 border rounded transition-all ${
              activeTenant === "tenant1" ? "border-blue-500 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                <span className="text-blue-400 font-bold">UID: 1001 (tenant1)</span>
                <span className="text-zinc-500">/home/tenant1/public_html</span>
              </div>
              <div className="font-display text-lg text-zinc-100">tenant1.example.com</div>
              <div className="mt-3 p-2.5 bg-black/70 rounded text-[10px] font-mono text-zinc-400 space-y-1 border border-zinc-800">
                <div>AllowOverride None (Overrides disabled)</div>
                <div>Options -Indexes +SymLinksIfOwnerMatch</div>
                <div>CustomLog /var/log/apache2/tenant1_access.log combined</div>
              </div>
            </div>

            {/* Tenant 2 */}
            <div className={`p-4 border rounded transition-all ${
              activeTenant === "tenant2" ? "border-purple-500 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                <span className="text-purple-400 font-bold">UID: 1002 (tenant2)</span>
                <span className="text-zinc-500">/home/tenant2/public_html</span>
              </div>
              <div className="font-display text-lg text-zinc-100">tenant2.example.com</div>
              <div className="mt-3 p-2.5 bg-black/70 rounded text-[10px] font-mono text-zinc-400 space-y-1 border border-zinc-800">
                <div>AllowOverride None (Overrides disabled)</div>
                <div>Options -Indexes +SymLinksIfOwnerMatch</div>
                <div>CustomLog /var/log/apache2/tenant2_access.log combined</div>
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
