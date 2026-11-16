"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Play, Pause, RotateCcw, Activity, ArrowRightLeft, FileCode, Server, Laptop } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface SublimeRsubTunnelVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function SublimeRsubTunnelVisualizer({ onTimelineSync, externalStep }: SublimeRsubTunnelVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [tunnelActive, setTunnelActive] = useState(true);
  const [socketStatus, setSocketStatus] = useState<"LISTENING" | "CONNECTED" | "SYNCING" | "SAVED">("LISTENING");
  const [packetStream, setPacketStream] = useState<"idle" | "forward" | "save_back">("idle");

  const scenes = [
    { title: "Reverse SSH Port Forward", sub: "ssh -R 52698:localhost:52698 bridges remote socket to local workstation daemon" },
    { title: "Remote rsub / rmate Invocation", sub: "User invokes 'rsub /etc/nginx/nginx.conf'; ruby/bash client connects to remote 127.0.0.1:52698" },
    { title: "Encrypted Stream to GUI Buffer", sub: "Tunnel forwards payload; Sublime Text intercepts socket and opens file in local GUI editor" },
    { title: "Atomic Save & Remote Flush", sub: "Ctrl+S flushes edited buffer back through SSH tunnel; remote file written atomically with fsync" },
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
      setSocketStatus("LISTENING");
      setPacketStream("idle");
    } else if (idx === 1) {
      setSocketStatus("CONNECTED");
      setPacketStream("forward");
    } else if (idx === 2) {
      setSocketStatus("SYNCING");
      setPacketStream("forward");
    } else if (idx === 3) {
      setSocketStatus("SAVED");
      setPacketStream("save_back");
    }
    onTimelineSync?.(idx * 5, idx);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setSceneIndex((prev) => {
        const next = (prev + 1) % scenes.length;
        setScene(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#07090e] p-6 shadow-2xl overflow-hidden font-mono text-xs">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <ArrowRightLeft className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Sublime Text Remote rsub Tunnel</h3>
              <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                PORT 52698 REVERSE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Secure bidirectional socket pipe: Local GUI to Headless Cloud Server</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => setScene(0)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Local Client Workstation */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4 relative">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-3">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Laptop className="h-4 w-4" /> Workstation (Local)
              </span>
              <span className="text-[10px] text-slate-400">127.0.0.1</span>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <FileCode className="h-3 w-3 text-amber-400" /> Sublime Text 4
                </div>
                <div className="text-[10px] text-slate-300">Package: <span className="text-amber-300 font-mono">rsub daemon</span></div>
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Activity className="h-3 w-3" /> Listening on 127.0.0.1:52698
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">Buffer Status:</div>
                <div className="text-[11px] font-mono text-cyan-400">
                  {sceneIndex >= 2 ? "nginx.conf [ACTIVE BUFFER]" : "Awaiting Remote Stream"}
                </div>
              </div>
            </div>
          </div>

          {/* Reverse SSH Tunnel Conduit */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-900/40 relative">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-cyan-400" /> SSH Reverse Tunnel
            </span>
            <div className="w-full bg-slate-950 p-2.5 rounded border border-cyan-500/30 font-mono text-[10px] text-center mb-3">
              <span className="text-purple-400">ssh -R</span> <span className="text-amber-400">52698</span>:<span className="text-emerald-400">localhost:52698</span>
            </div>
            
            {/* Conduit Pipe Graphic */}
            <div className="w-full h-8 relative bg-slate-950 rounded-full border border-slate-800 flex items-center px-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-cyan-500/20 to-emerald-500/10" />
              <div
                className={`h-2 rounded-full w-12 transition-all duration-700 ${
                  packetStream === "forward"
                    ? "bg-cyan-400 shadow-[0_0_12px_#00f5d4] translate-x-32"
                    : packetStream === "save_back"
                    ? "bg-amber-400 shadow-[0_0_12px_#f59e0b] translate-x-2"
                    : "bg-slate-700 translate-x-16"
                }`}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 text-center">
              State: <span className="text-emerald-400 font-bold">{socketStatus}</span>
            </div>
          </div>

          {/* Remote Cloud Server */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4 relative">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Server className="h-4 w-4" /> Remote Host (Linux)
              </span>
              <span className="text-[10px] text-slate-400">production-node</span>
            </div>
            <div className="space-y-2">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Terminal className="h-3 w-3 text-emerald-400" /> CLI Invocation
                </div>
                <div className="text-[10px] font-mono text-slate-300">
                  $ <span className="text-cyan-300">rsub /etc/nginx/nginx.conf</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Socket target: <span className="text-amber-400 font-mono">127.0.0.1:52698</span>
                </div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[10px] text-slate-400">File Inode:</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {sceneIndex === 3 ? "fsync() 644 root:root [SYNCED]" : "Locked by rsub client"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              PHASE {sceneIndex + 1}/4
            </span>
            <span className="text-slate-200 font-bold">{scenes[sceneIndex].title}</span>
          </div>
          <p className="text-slate-400 text-[11px]">{scenes[sceneIndex].sub}</p>
        </div>
      </div>

      {/* Interactive Step Triggers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {scenes.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setScene(idx)}
            className={`p-2.5 rounded-xl border text-left transition ${
              sceneIndex === idx
                ? "border-amber-500/60 bg-amber-500/10 text-amber-200"
                : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700"
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Step {idx + 1}</div>
            <div className="text-[11px] font-semibold text-slate-200 truncate">{s.title}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
