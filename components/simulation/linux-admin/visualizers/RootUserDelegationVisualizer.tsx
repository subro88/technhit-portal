"use client";

import React, { useState, useEffect } from "react";
import { Lock, Unlock, ShieldAlert, ShieldCheck, Play, Pause, RotateCcw } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface RootUserDelegationVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function RootUserDelegationVisualizer({ onTimelineSync, externalStep }: RootUserDelegationVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [shadowHash, setShadowHash] = useState("root:!:19840:0:99999:7:::");
  const [sudoDelegation, setSudoDelegation] = useState("%sudo ALL=(ALL:ALL) ALL");

  const scenes = [
    { title: "Locked Root Default", sub: "Ubuntu default: root password field contains '!' (Account locked / disabled)" },
    { title: "Sudo Elevation Path", sub: "Non-root admin user in sudo group invokes commands via transient ticket" },
    { title: "Unlocking Danger", sub: "sudo passwd root sets password hash; creates shared password security liability" },
    { title: "Granular Least Privilege", sub: "/etc/sudoers.d/dba: developer ALL=(ALL) /bin/systemctl restart mysql" },
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
      setShadowHash("root:!:19840:0:99999:7:::");
      setSudoDelegation("%sudo ALL=(ALL:ALL) ALL");
    } else if (idx === 1) {
      setShadowHash("root:!:19840:0:99999:7:::");
      setSudoDelegation("operator ALL=(ALL) /usr/bin/apt update");
    } else if (idx === 2) {
      setShadowHash("root:$6$vj8K...$Zq:19840:0:99999:7:::");
      setSudoDelegation("Shared Root Password (High Risk)");
    } else if (idx === 3) {
      setShadowHash("root:!:19840:0:99999:7:::");
      setSudoDelegation("dba ALL=(mysql) NOPASSWD: /usr/sbin/service mysql *");
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
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Ubuntu Root Account Locking &amp; Sudoers Policy Delegation
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            PAM / /etc/shadow / visudo
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ROOT SHADOW STATE</div>
            <div className={`text-sm font-bold mt-0.5 ${shadowHash.includes("!") ? "text-emerald-400" : "text-red-400"}`}>
              {shadowHash.includes("!") ? "LOCKED (!)" : "UNLOCKED (HASHED)"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SUDOERS VALIDATION</div>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">visudo -c (OK)</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DELEGATION LEVEL</div>
            <div className="text-sm font-bold text-amber-400 mt-0.5">Granular Sudoers</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">POLICY COMPLIANCE</div>
            <div className="text-sm font-bold text-cyan-400 mt-0.5">CIS Benchmark 5.3</div>
          </div>
        </div>

        {/* Shadow file & sudoers inspection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-zinc-800 rounded bg-black/70 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-zinc-500 uppercase">/ETC/SHADOW (ROOT ENTRY)</div>
            <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-cyan-400 truncate">
              {shadowHash}
            </div>
          </div>
          <div className="p-4 border border-zinc-800 rounded bg-black/70 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-zinc-500 uppercase">/ETC/SUDOERS.D/ (ACTIVE DELEGATION)</div>
            <div className="p-2.5 bg-zinc-950 rounded border border-zinc-800 text-[11px] text-emerald-400 truncate">
              {sudoDelegation}
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
