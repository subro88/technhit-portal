"use client";

import React, { useState, useEffect } from "react";
import { ArrowRightLeft, FastForward, Play, Pause, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface SftpScpRsyncVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function SftpScpRsyncVisualizer({ onTimelineSync, externalStep }: SftpScpRsyncVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeProtocol, setActiveProtocol] = useState<"scp" | "sftp" | "rsync">("rsync");
  const [bytesTransferred, setBytesTransferred] = useState("4.2 MB (Delta)");
  const [resumeCapability, setResumeCapability] = useState("Native Partial Transfer");

  const scenes = [
    { title: "Legacy SCP Pipeline", sub: "SCP transmits entire 500 MB file over SSH without resuming capability" },
    { title: "SFTP Subsystem", sub: "SFTP subsystem allows interactive packetized navigation and permission chroot" },
    { title: "Rsync Delta Algorithm", sub: "Rolling checksum identifies modified 4.2 MB delta; skips 495.8 MB unmodified data" },
    { title: "Network Interruption Test", sub: "Rsync --partial --append-verify resumes precisely from dropped byte offset" },
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
      setActiveProtocol("scp");
      setBytesTransferred("500 MB (100% Full)");
      setResumeCapability("No Resume (Restarts from 0)");
    } else if (idx === 1) {
      setActiveProtocol("sftp");
      setBytesTransferred("500 MB (100% Full)");
      setResumeCapability("Subsystem Supported");
    } else if (idx === 2) {
      setActiveProtocol("rsync");
      setBytesTransferred("4.2 MB (0.8% Delta)");
      setResumeCapability("Delta Checksum Skip");
    } else if (idx === 3) {
      setActiveProtocol("rsync");
      setBytesTransferred("12.4 MB (Resumed)");
      setResumeCapability("--partial --append-verify");
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
            SSH File Transfer Protocols Comparison: SCP vs SFTP vs Rsync
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            Port 22 SSH Tunnel
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ACTIVE ENGINE</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{activeProtocol.toUpperCase()}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">BYTES ON THE WIRE</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{bytesTransferred}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">RESUME CAPABILITY</div>
            <div className="text-sm font-bold text-amber-400 mt-1">{resumeCapability}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SECURITY TRANSPORT</div>
            <div className="text-sm font-bold text-zinc-200 mt-1">ChaCha20-Poly1305</div>
          </div>
        </div>

        {/* Comparison Stream Pipes */}
        <div className="space-y-4 py-4 px-2">
          {/* SCP */}
          <div className={`p-4 border rounded transition-all ${
            activeProtocol === "scp" ? "border-amber-500 bg-amber-950/20" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="font-bold text-zinc-200">1. Legacy SCP (rcp protocol over SSH)</span>
              <span className="text-red-400">Restarts on disconnect</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Command: scp -P 22 archive.tar.gz user@remote:/var/backups/
            </div>
          </div>

          {/* SFTP */}
          <div className={`p-4 border rounded transition-all ${
            activeProtocol === "sftp" ? "border-blue-500 bg-blue-950/20" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-1">
              <span className="font-bold text-zinc-200">2. OpenSSH SFTP Subsystem</span>
              <span className="text-cyan-400">Interactive packet stream</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">
              Command: sftp -P 22 user@remote (Supports chroot / ForceCommand internal-sftp)
            </div>
          </div>

          {/* Rsync */}
          <div className={`p-4 border rounded transition-all ${
            activeProtocol === "rsync" ? "border-emerald-500 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-zinc-800 bg-zinc-950/60"
          }`}>
            <div className="flex justify-between items-center text-xs font-mono mb-1 font-bold">
              <span className="text-emerald-400">3. Rsync Delta Algorithm (Recommended)</span>
              <span className="text-emerald-400">99% Bandwidth Saved</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-300">
              Command: rsync -avzP -e &quot;ssh -p 22&quot; --delete ./dist/ user@remote:/var/www/html/
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
