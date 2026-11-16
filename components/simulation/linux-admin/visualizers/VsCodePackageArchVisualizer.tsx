"use client";

import React, { useState, useEffect } from "react";
import { Shield, Key, PackageCheck, Play, Pause, RotateCcw, CheckCircle, Terminal, HardDrive } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface VsCodePackageArchVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function VsCodePackageArchVisualizer({ onTimelineSync, externalStep }: VsCodePackageArchVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [installMethod, setInstallMethod] = useState<"apt" | "snap">("apt");
  const [validationState, setValidationState] = useState<"GPG_VERIFIED" | "FETCHING" | "EXTRACTING" | "INSTALLED">("GPG_VERIFIED");

  const scenes = [
    { title: "GPG Armored Key Import", sub: "Import Microsoft public key into /etc/apt/keyrings/packages.microsoft.gpg via gpg --dearmor" },
    { title: "Scoped Repository Pinning", sub: "Configure /etc/apt/sources.list.d/vscode.list with strict [signed-by=...] to defeat repo spoofing" },
    { title: "APT Index Verification", sub: "apt update downloads InRelease; verifies SHA256 integrity hashes against imported GPG key" },
    { title: "Atomic Dpkg Unpack & Binlink", sub: "Installs binary payload to /usr/share/code; links /usr/bin/code and configures MIME desktop hooks" },
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
    if (idx === 0) setValidationState("GPG_VERIFIED");
    else if (idx === 1) setValidationState("FETCHING");
    else if (idx === 2) setValidationState("EXTRACTING");
    else if (idx === 3) setValidationState("INSTALLED");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <PackageCheck className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">VS Code Package Architecture & Verification</h3>
              <span className="rounded bg-blue-400/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30">
                APT KEYRING SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Modern Debian / Ubuntu Packaging Pipeline: GPG Armor to Binary Execution</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 mr-2">
            <button
              onClick={() => { setInstallMethod("apt"); playHapticSound("click"); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                installMethod === "apt" ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              APT (Keyring)
            </button>
            <button
              onClick={() => { setInstallMethod("snap"); playHapticSound("click"); }}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                installMethod === "snap" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-white"
              }`}
            >
              Snap (--classic)
            </button>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-blue-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
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

      {/* Visual Pipeline */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Step 1: Keyring */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            sceneIndex >= 0 ? "border-emerald-500/40 bg-emerald-950/10" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-slate-200 text-[11px]">1. GPG Keyring</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>Path: <span className="text-slate-200">/etc/apt/keyrings/</span></div>
              <div>File: <span className="text-emerald-400">msft.gpg</span></div>
              <div className="text-emerald-400 flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3" /> Signed & Dearmored
              </div>
            </div>
          </div>

          {/* Step 2: Source List Pinning */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            sceneIndex >= 1 ? "border-blue-500/40 bg-blue-950/10" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="font-bold text-slate-200 text-[11px]">2. Source Scoping</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>Type: <span className="text-blue-300">deb [arch=amd64]</span></div>
              <div>Pin: <span className="text-cyan-300">signed-by key</span></div>
              <div className="text-blue-400 flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3" /> Zero Cross-Repo Tampering
              </div>
            </div>
          </div>

          {/* Step 3: InRelease Check */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            sceneIndex >= 2 ? "border-cyan-500/40 bg-cyan-950/10" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-slate-200 text-[11px]">3. apt update</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>Target: <span className="text-slate-300">packages.microsoft.com</span></div>
              <div>Digest: <span className="text-cyan-300">SHA-256 Valid</span></div>
              <div className="text-cyan-400 flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3" /> InRelease Verified
              </div>
            </div>
          </div>

          {/* Step 4: Installation Payload */}
          <div className={`p-3.5 rounded-xl border transition-all ${
            sceneIndex >= 3 ? "border-amber-500/40 bg-amber-950/10" : "border-slate-800 bg-slate-900/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span className="font-bold text-slate-200 text-[11px]">4. Binary Exec</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>Bin: <span className="text-slate-300">/usr/bin/code</span></div>
              <div>Payload: <span className="text-amber-300">/usr/share/code</span></div>
              <div className="text-amber-400 flex items-center gap-1 mt-2">
                <CheckCircle className="h-3 w-3" /> Desktop Entry Ready
              </div>
            </div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">
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
                ? "border-blue-500/60 bg-blue-500/10 text-blue-200"
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
