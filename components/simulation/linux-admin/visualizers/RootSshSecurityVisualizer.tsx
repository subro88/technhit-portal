"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, UserCheck, Play, Pause, RotateCcw, Lock } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface RootSshSecurityVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function RootSshSecurityVisualizer({ onTimelineSync, externalStep }: RootSshSecurityVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [rootLoginStatus, setRootLoginStatus] = useState<"PermitRootLogin yes" | "prohibit-password" | "PermitRootLogin no">("PermitRootLogin no");
  const [authLogStream, setAuthLogStream] = useState("sshd[1042]: Disconnected authenticating user root [preauth]");

  const scenes = [
    { title: "Direct Root Attack", sub: "Bots attacking root@server directly on port 22; zero individual accountability" },
    { title: "Prohibit Password", sub: "PermitRootLogin prohibit-password locks out password attacks but allows key access" },
    { title: "Strict Root Lockout", sub: "PermitRootLogin no: Root access completely disabled over WAN" },
    { title: "Sudoer Audit Logging", sub: "Named user logins (operator1) elevate via sudo with full auth.log accountability" },
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
      setRootLoginStatus("PermitRootLogin yes");
      setAuthLogStream("sshd[812]: Failed password for root from 198.51.100.2 port 48210 ssh2");
    } else if (idx === 1) {
      setRootLoginStatus("prohibit-password");
      setAuthLogStream("sshd[940]: Connection closed by authenticating user root (publickey required)");
    } else if (idx === 2) {
      setRootLoginStatus("PermitRootLogin no");
      setAuthLogStream("sshd[1042]: User root not allowed because not listed in AllowUsers");
    } else if (idx === 3) {
      setRootLoginStatus("PermitRootLogin no");
      setAuthLogStream("sudo: operator1 : TTY=pts/0 ; PWD=/home/operator1 ; USER=root ; COMMAND=/usr/bin/systemctl restart nginx");
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
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Root SSH Vulnerability Mitigation &amp; Sudoers Accountability
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            /etc/ssh/sshd_config
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ROOT LOGIN POLICY</div>
            <div className={`text-lg font-bold mt-0.5 ${rootLoginStatus === "PermitRootLogin yes" ? "text-red-400" : "text-emerald-400"}`}>
              {rootLoginStatus}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SUDO AUDIT LOGS</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">/var/log/auth.log</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SESSION ACCOUNTABILITY</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">Named POSIX User</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SUDO TICKET TIMEOUT</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">15 Minutes</div>
          </div>
        </div>

        {/* Console Log Terminal */}
        <div className="p-4 border border-zinc-800 rounded bg-black/80 font-mono text-xs text-zinc-300 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-2">
            <span>TAIL -F /VAR/LOG/AUTH.LOG (LIVE AUDIT)</span>
            <span className="text-emerald-400">ACTIVE LOG STREAM</span>
          </div>
          <div className="p-2.5 bg-zinc-950/80 rounded border border-zinc-800 text-[11px] text-amber-400/90 leading-relaxed font-mono">
            {authLogStream}
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
