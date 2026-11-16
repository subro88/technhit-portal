"use client";

import React, { useState, useEffect } from "react";
import { Layers, Shield, Play, Pause, RotateCcw, CheckCircle, Disc, GitBranch, Terminal } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface ManjaroArchRollingVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function ManjaroArchRollingVisualizer({ onTimelineSync, externalStep }: ManjaroArchRollingVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [branchStage, setBranchStage] = useState<"unstable" | "testing" | "stable">("stable");
  const [checksumStatus, setChecksumStatus] = useState("SHA-256 MATCH");

  const scenes = [
    { title: "Arch Upstream Sync (Unstable)", sub: "Raw bleeding-edge packages pull directly from Arch Linux Core/Extra into Manjaro Unstable" },
    { title: "MHWD & Kernel Testing Staging", sub: "Packages undergo 1-2 weeks regression testing; MHWD auto-driver scripts verified across GPU/WiFi chips" },
    { title: "Stable Snapshot & GPG Release Sign", sub: "Release engineers freeze validated tree; sign release ISOs and package repositories with official GPG keys" },
    { title: "Client Checksum & Signature Verify", sub: "User validates sha256sum and gpg --verify signature before flashing hybrid ISO to boot media" },
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
      setBranchStage("unstable");
      setChecksumStatus("SYNCING UPSTREAM");
    } else if (idx === 1) {
      setBranchStage("testing");
      setChecksumStatus("MHWD VALIDATION");
    } else if (idx === 2) {
      setBranchStage("stable");
      setChecksumStatus("GPG SIGNED");
    } else if (idx === 3) {
      setBranchStage("stable");
      setChecksumStatus("VERIFIED SHA-256 MATCH");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <GitBranch className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Manjaro Rolling Release & ISO Integrity</h3>
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                ARCH DERIVATIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">3-Tier Staging Buffer, MHWD Hardware Detection, and GPG Signature Audits</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-emerald-400" /> : <Play className="h-3.5 w-3.5 text-cyan-400" />}
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

      {/* Visual Staging Pipeline */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Branch 1: Unstable */}
          <div className={`p-3.5 rounded-xl border transition ${
            branchStage === "unstable" ? "border-amber-500/50 bg-amber-950/15" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-300 text-[11px]">1. Unstable Branch</span>
              <span className="text-[10px] text-slate-400">Bleeding Edge</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">Syncs 1:1 with Arch Linux Core/Extra upstream</p>
            <div className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
              pacman -Syu --raw
            </div>
          </div>

          {/* Branch 2: Testing */}
          <div className={`p-3.5 rounded-xl border transition ${
            branchStage === "testing" ? "border-cyan-500/50 bg-cyan-950/15" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 text-[11px]">2. Testing Branch</span>
              <span className="text-[10px] text-slate-400">QA Staging</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">MHWD driver detection & desktop regression tests</p>
            <div className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800">
              mhwd -a pci nonfree 0300
            </div>
          </div>

          {/* Branch 3: Stable */}
          <div className={`p-3.5 rounded-xl border transition ${
            branchStage === "stable" ? "border-emerald-500/50 bg-emerald-950/15" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-300 text-[11px]">3. Stable Snapshots</span>
              <span className="text-[10px] text-slate-400">Production ISO</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-2">Signed releases published to official global mirrors</p>
            <div className="text-[10px] font-mono text-emerald-300 bg-slate-950 p-2 rounded border border-slate-800">
              manjaro-xfce-x86_64.iso
            </div>
          </div>
        </div>

        {/* Verification Terminal */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Terminal className="h-3.5 w-3.5" /> ISO Cryptographic Integrity Verification
            </span>
            <span className="text-emerald-400 font-bold">{checksumStatus}</span>
          </div>
          <div className="space-y-1 text-slate-300">
            <div>$ sha256sum -c manjaro-xfce-17.0.iso.sha256</div>
            <div className="text-emerald-400">manjaro-xfce-17.0-stable-x86_64.iso: OK</div>
            <div className="text-slate-400 mt-1">$ gpg --verify manjaro-xfce-17.0.iso.sig</div>
            <div className="text-cyan-400">gpg: Good signature from &quot;Manjaro Build Server &lt;build@manjaro.org&gt;&quot; [ultimate]</div>
            <div className="text-slate-500 text-[10px]">Primary key fingerprint: CAA6 3C84 0797 B61C D7D8 584C FC52 F0FE 9CE3 ED01</div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
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
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
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
