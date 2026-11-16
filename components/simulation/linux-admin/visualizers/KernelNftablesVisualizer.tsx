"use client";

import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, ShieldAlert, Zap, Activity, Cpu, Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface KernelNftablesVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function KernelNftablesVisualizer({ onTimelineSync, externalStep }: KernelNftablesVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [synFloodActive, setSynFloodActive] = useState(false);
  const [sysctlHardened, setSysctlHardened] = useState(false);
  const [nftablesLoaded, setNftablesLoaded] = useState(false);
  const [packetStats, setPacketStats] = useState({ incoming: 120, dropped: 0, accepted: 120, synCookies: 0 });

  const scenes = [
    { title: "Normal Traffic", sub: "Standard TCP connection handshakes (SYN -> SYN-ACK -> ACK)" },
    { title: "SYN Flood Attack", sub: "Simulated distributed botnet SYN flood (45,000 pps) targeting port 443" },
    { title: "sysctl Hardening", sub: "Activating syncookies=1, tcp_max_syn_backlog=8192, rp_filter=1" },
    { title: "nftables Filtering", sub: "Rate-limiting TCP SYN with eBPF/nftables stateful connection tracking" },
  ];

  // Sync with external SRE step if supplied
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
      setSynFloodActive(false);
      setSysctlHardened(false);
      setNftablesLoaded(false);
      setPacketStats({ incoming: 120, dropped: 0, accepted: 120, synCookies: 0 });
    } else if (idx === 1) {
      setSynFloodActive(true);
      setSysctlHardened(false);
      setNftablesLoaded(false);
      setPacketStats({ incoming: 45000, dropped: 0, accepted: 45000, synCookies: 0 });
    } else if (idx === 2) {
      setSynFloodActive(true);
      setSysctlHardened(true);
      setNftablesLoaded(false);
      setPacketStats({ incoming: 45000, dropped: 12000, accepted: 8200, synCookies: 24800 });
    } else if (idx === 3) {
      setSynFloodActive(true);
      setSysctlHardened(true);
      setNftablesLoaded(true);
      setPacketStats({ incoming: 45000, dropped: 43800, accepted: 1200, synCookies: 0 });
    }
    onTimelineSync?.(idx * 5, idx);
  };

  // Auto-play timer
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
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Linux Kernel Network Stack &amp; nftables Packet Pipeline
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            sysctl v6.8-LTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            title={isPlaying ? "Pause Timeline" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setScene(0)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas / SVG Motion Graphic */}
      <div className="p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#07090e] to-[#07090e]">
        {/* Dynamic Status HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">INGRESS PACKETS</div>
            <div className="text-lg font-bold text-zinc-100 mt-0.5">{packetStats.incoming.toLocaleString()} pps</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SYN COOKIES ISSUED</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{packetStats.synCookies.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">NFTABLES DROPPED</div>
            <div className="text-lg font-bold text-red-400 mt-0.5">{packetStats.dropped.toLocaleString()}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">CLEAN TCP SOCKETS</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{packetStats.accepted.toLocaleString()} est.</div>
          </div>
        </div>

        {/* Technical Architecture Conduit Flow */}
        <div className="relative py-8 px-4 border border-zinc-800/80 rounded-lg bg-black/40 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Stage 1: Ingress WAN */}
            <div className={`p-4 border rounded transition-all ${
              synFloodActive ? "border-red-500/60 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-cyan-500/40 bg-cyan-950/20"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-zinc-400">LAYER 1: NIC</span>
                <span className={synFloodActive ? "text-red-400 font-bold" : "text-cyan-400"}>eth0 (10GbE)</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Ring Buffer Ingress</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-body">
                {synFloodActive ? "⚠️ High SYN rate detected (45k pps)" : "Normal TCP/UDP packet stream"}
              </p>
              <div className="mt-3 flex gap-1">
                <div className={`h-1.5 flex-1 rounded ${synFloodActive ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`} />
                <div className={`h-1.5 flex-1 rounded ${synFloodActive ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`} />
                <div className={`h-1.5 flex-1 rounded ${synFloodActive ? "bg-red-500 animate-pulse" : "bg-cyan-500"}`} />
              </div>
            </div>

            {/* Stage 2: Netfilter / nftables Hook */}
            <div className={`p-4 border rounded transition-all ${
              nftablesLoaded ? "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-zinc-400">LAYER 2: NETFILTER</span>
                <span className={nftablesLoaded ? "text-emerald-400 font-bold" : "text-zinc-500"}>
                  {nftablesLoaded ? "nftables ACTIVE" : "BYPASSED"}
                </span>
              </div>
              <div className="font-display text-lg text-zinc-100">eBPF / State Tracker</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-body">
                {nftablesLoaded ? "Drop invalid states & rate-limit SYN bursts" : "Unfiltered kernel traversal"}
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-1 rounded">
                table inet filter {nftablesLoaded ? "{ rate 25/second drop }" : "{ accept all }"}
              </div>
            </div>

            {/* Stage 3: sysctl Kernel TCP Stack */}
            <div className={`p-4 border rounded transition-all ${
              sysctlHardened ? "border-amber-500/60 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-zinc-400">LAYER 3: TCP STACK</span>
                <span className={sysctlHardened ? "text-amber-400 font-bold" : "text-zinc-500"}>
                  {sysctlHardened ? "SYN COOKIES ON" : "DEFAULT (OFF)"}
                </span>
              </div>
              <div className="font-display text-lg text-zinc-100">Kernel Backlog Memory</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-body">
                {sysctlHardened ? "tcp_max_syn_backlog=8192 & zero memory leak" : "Exhausts RAM table under flood"}
              </p>
              <div className="mt-3 text-[10px] font-mono text-zinc-400 bg-black/60 px-2 py-1 rounded">
                net.ipv4.tcp_syncookies = {sysctlHardened ? "1" : "0"}
              </div>
            </div>

            {/* Stage 4: User Space Application Socket */}
            <div className="p-4 border border-zinc-800 rounded bg-zinc-950/80">
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-zinc-400">LAYER 4: USERSPACE</span>
                <span className="text-emerald-400 font-bold">PORT 443</span>
              </div>
              <div className="font-display text-lg text-zinc-100">Nginx / App Sockets</div>
              <p className="text-[11px] text-zinc-400 mt-1 font-body">
                {nftablesLoaded || sysctlHardened ? "CPU < 5%, 0 dropped valid requests" : "High CPU load, dropped valid clients"}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">CONN STATUS:</span>
                <span className={nftablesLoaded || sysctlHardened ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {nftablesLoaded || sysctlHardened ? "PROTECTED" : "SATURATED"}
                </span>
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
