"use client";

import React, { useState, useEffect } from "react";
import { Server, Cpu, Play, Pause, RotateCcw, ShieldCheck, Activity } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface Tomcat10ProductionVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function Tomcat10ProductionVisualizer({ onTimelineSync, externalStep }: Tomcat10ProductionVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [jvmHeap, setJvmHeap] = useState({ used: "512 MB", max: "2048 MB", gcState: "G1GC Young Gen" });
  const [sandboxed, setSandboxed] = useState(true);

  const scenes = [
    { title: "JVM Heap Allocation", sub: "-Xms1024M -Xmx2048M memory allocation with G1GC garbage collection" },
    { title: "Catalina Servlet Threads", sub: "Tomcat HTTP 8080 connector managing 200 concurrent worker threads" },
    { title: "systemd Hardening", sub: "User=tomcat, ProtectSystem=strict, ReadWritePaths=/opt/tomcat/logs" },
    { title: "Production WAR Deployment", sub: "Deploying enterprise WAR with zero-downtime hot redeployment" },
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
      setJvmHeap({ used: "410 MB", max: "2048 MB", gcState: "Eden Clean" });
      setSandboxed(true);
    } else if (idx === 1) {
      setJvmHeap({ used: "920 MB", max: "2048 MB", gcState: "G1 Concurrent Mark" });
      setSandboxed(true);
    } else if (idx === 2) {
      setJvmHeap({ used: "640 MB", max: "2048 MB", gcState: "Sandbox Active" });
      setSandboxed(true);
    } else if (idx === 3) {
      setJvmHeap({ used: "780 MB", max: "2048 MB", gcState: "WAR Loaded" });
      setSandboxed(true);
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
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Apache Tomcat 10 Production JVM &amp; Catalina Container
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            Jakarta EE 10 / OpenJDK 17
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">JVM HEAP MEMORY</div>
            <div className="text-lg font-bold text-orange-400 mt-0.5">{jvmHeap.used} / {jvmHeap.max}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">GARBAGE COLLECTOR</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{jvmHeap.gcState}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SYSTEMD SECURITY</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">ProtectSystem=Strict</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">HTTP CONNECTOR</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">Port 8080 (NIO)</div>
          </div>
        </div>

        {/* JVM Visualizer Grid */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* JVM Young/Old Gen */}
            <div className="p-4 border border-orange-500/30 rounded bg-orange-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-orange-400 font-bold">JVM HEAP POOL</span>
                <span className="text-zinc-500">G1GC</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Eden / Survivor / Old</div>
              <p className="text-xs text-zinc-400 font-body">Adaptive generational sizing to minimize stop-the-world pauses.</p>
              <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden mt-2">
                <div className="bg-orange-500 h-full w-[38%]" />
              </div>
            </div>

            {/* Catalina Engine */}
            <div className="p-4 border border-cyan-500/30 rounded bg-cyan-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">CATALINA ENGINE</span>
                <span className="text-zinc-500">Servlet 6.0</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Tomcat 10.1 Pipeline</div>
              <p className="text-xs text-zinc-400 font-body">Asynchronous I/O servlet handling non-blocking requests.</p>
              <div className="text-[10px] font-mono text-cyan-400 bg-black/60 p-2 rounded border border-zinc-800">
                maxThreads=200 minSpareThreads=25
              </div>
            </div>

            {/* Sandboxed Service */}
            <div className="p-4 border border-emerald-500/30 rounded bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">SYSTEMD SERVICE</span>
                <span className="text-emerald-400">UID: tomcat (998)</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Non-Root Execution</div>
              <p className="text-xs text-zinc-400 font-body">Read-only system directories preventing root privilege escalation.</p>
              <div className="text-[10px] font-mono text-emerald-400 bg-black/60 p-2 rounded border border-zinc-800">
                NoNewPrivileges=true
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
