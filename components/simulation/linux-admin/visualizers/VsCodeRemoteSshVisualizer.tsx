"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, Play, Pause, RotateCcw, Cpu, Code2, Server, Laptop, Layers } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface VsCodeRemoteSshVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function VsCodeRemoteSshVisualizer({ onTimelineSync, externalStep }: VsCodeRemoteSshVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [mode, setMode] = useState<"remote_ssh" | "legacy_sftp">("remote_ssh");
  const [serverState, setServerState] = useState("RUNNING");

  const scenes = [
    { title: "SSH Handshake & Bootstrap", sub: "VS Code initiates SSH session to remote host; validates glibc and architecture compatibility" },
    { title: "Headless Server Daemon", sub: "Spawns ~/.vscode-server daemon on remote host with Node.js runtime and IPC channels" },
    { title: "Native Remote Language Server", sub: "LSP (tsserver, pyright, rust-analyzer) indexes files natively in remote RAM with zero client file downloads" },
    { title: "Seamless Port & Process Forwarding", sub: "Dynamic reverse socket forwards remote ports (e.g. 3000, 8080) to workstation browser instantly" },
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
    if (idx === 0) setServerState("INITIALIZING");
    else if (idx === 1) setServerState("BOOTSTRAPPING");
    else if (idx === 2) setServerState("LSP ACTIVE");
    else if (idx === 3) setServerState("PORT FORWARDED: 8080");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Code2 className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">VS Code Remote-SSH vs Legacy SFTP</h3>
              <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                HEADLESS RPC ARCHITECTURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Native Remote Execution vs Out-of-band File Polling & Sync Drift</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 mr-2">
            <button
              onClick={() => { setMode("remote_ssh"); playHapticSound("click"); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                mode === "remote_ssh" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              Remote-SSH (IPC)
            </button>
            <button
              onClick={() => { setMode("legacy_sftp"); playHapticSound("click"); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                mode === "legacy_sftp" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              Legacy SFTP Sync
            </button>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-cyan-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
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

      {/* Visual Workspace Canvas */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Client: Local Workstation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Laptop className="h-4 w-4 text-cyan-400" /> Local Workstation (Thin UI Client)
              </span>
              <span className="text-[10px] text-cyan-400">VS Code Frontend</span>
            </div>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Local Responsibilities:</div>
                <ul className="text-[10px] space-y-1 text-slate-300 list-disc list-inside">
                  <li>Electron UI rendering & keybinding capture</li>
                  <li>Theme styling, Monaco editor cursor painting</li>
                  <li className="text-emerald-400 font-semibold">Zero local source code copies or git repository downloads</li>
                </ul>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-cyan-500/20">
                <div className="text-[10px] text-cyan-400 font-semibold mb-1">Communication Channel:</div>
                <div className="text-[10px] font-mono text-slate-300">
                  Multiplexed JSON-RPC over SSH Pipe (Port 22)
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Latency: <span className="text-emerald-400 font-bold">14ms ping</span> | Encryption: <span className="text-cyan-300">ChaCha20-Poly1305</span>
                </div>
              </div>
            </div>
          </div>

          {/* Server: Remote Linux Host */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Server className="h-4 w-4" /> Remote Host (Headless Server)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                {serverState}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Cpu className="h-3 w-3 text-cyan-400" /> Headless Node Process (~/.vscode-server)
                </div>
                <div className="text-[10px] font-mono text-slate-300">
                  PID: <span className="text-emerald-400">14209</span> | RSS: <span className="text-amber-400">128MB</span> | Arch: <span className="text-purple-400">x86_64 Linux</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Terminal className="h-3 w-3 text-emerald-400" /> Remote Execution Engines
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] mt-1">
                  <div className="p-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    <span className="text-emerald-400">●</span> LSP: pyright / gopls
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    <span className="text-cyan-400">●</span> PTY: /bin/bash daemon
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    <span className="text-amber-400">●</span> Debug: GDB / Delve
                  </div>
                  <div className="p-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    <span className="text-purple-400">●</span> Forward: 0.0.0.0:8080
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
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
                ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-200"
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
