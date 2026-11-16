"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, HardDrive, Play, Pause, RotateCcw, Activity } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface SshfsFuseVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function SshfsFuseVisualizer({ onTimelineSync, externalStep }: SshfsFuseVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [fuseState, setFuseState] = useState<"direct" | "cached" | "reconnecting" | "unmounted">("cached");
  const [readdirLatency, setReaddirLatency] = useState("0.2ms (Cached)");

  const scenes = [
    { title: "POSIX System Call", sub: "User executes ls /mnt/remote; kernel routes call to /dev/fuse userspace driver" },
    { title: "SSHFS SFTP Translation", sub: "Userspace sshfs daemon packages readdir into encrypted SFTP request over SSH" },
    { title: "Directory Cache Hit", sub: "cache_dir=yes & cache_stat=yes answers subsequent reads locally in 0.2ms" },
    { title: "Auto-Reconnect & Fusermount", sub: "reconnect,ServerAliveInterval=15 survives wifi drops; fusermount -u clean exit" },
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
      setFuseState("direct");
      setReaddirLatency("45.0ms (Network Round-Trip)");
    } else if (idx === 1) {
      setFuseState("direct");
      setReaddirLatency("38.0ms (SFTP Read)");
    } else if (idx === 2) {
      setFuseState("cached");
      setReaddirLatency("0.2ms (Local FUSE Cache)");
    } else if (idx === 3) {
      setFuseState("reconnecting");
      setReaddirLatency("1.1ms (Reconnected)");
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
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Linux FUSE /dev/fuse Kernel Driver &amp; SSHFS Remote Mount
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            POSIX VFS Bridge
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">MOUNT TARGET</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">/mnt/remote_data</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">READDIR LATENCY</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{readdirLatency}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">FUSE CACHE STATUS</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {fuseState === "cached" ? "CACHE HIT (ACTIVE)" : "DIRECT SFTP"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">KERNEL INTERFACE</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">/dev/fuse (r/w)</div>
          </div>
        </div>

        {/* FUSE Pipeline Architecture */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Step 1: Local POSIX Call */}
            <div className="p-4 border border-cyan-500/30 rounded bg-cyan-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">1. POSIX VFS</span>
                <span className="text-zinc-500">Kernel Space</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Application Syscall</div>
              <p className="text-xs text-zinc-400 font-body">App calls open() or readdir(); VFS routes to /dev/fuse.</p>
              <div className="text-[10px] font-mono text-zinc-400 bg-black/60 p-2 rounded border border-zinc-800">
                ls -la /mnt/remote_data
              </div>
            </div>

            {/* Step 2: Userspace sshfs Daemon */}
            <div className="p-4 border border-zinc-700 bg-zinc-900/60 rounded text-center space-y-2">
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">2. FUSE USERSPACE BRIDGE</div>
              <div className="font-display text-xl text-zinc-100">sshfs Daemon</div>
              <p className="text-xs text-zinc-400 font-body">Translates filesystem nodes into SFTP commands.</p>
              <div className="inline-block px-3 py-1 bg-emerald-950/60 border border-emerald-800 rounded font-mono text-[10px] text-emerald-400">
                options: reconnect,cache=yes
              </div>
            </div>

            {/* Step 3: Remote Linux Host */}
            <div className="p-4 border border-emerald-500/30 rounded bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">3. REMOTE SERVER</span>
                <span className="text-emerald-400">Port 22 SSHD</span>
              </div>
              <div className="font-display text-lg text-zinc-100">OpenSSH SFTP Subsystem</div>
              <p className="text-xs text-zinc-400 font-body">Streams raw remote disk blocks over encrypted tunnel.</p>
              <div className="text-[10px] font-mono text-emerald-400 bg-black/60 p-2 rounded border border-zinc-800">
                internal-sftp sub-service
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
