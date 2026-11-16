"use client";

import React, { useState, useEffect } from "react";
import { Server, Cpu, Play, Pause, RotateCcw, Activity, Layers, Network, CheckCircle, RefreshCw } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface VmwareToolsKernelVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function VmwareToolsKernelVisualizer({ onTimelineSync, externalStep }: VmwareToolsKernelVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [driverState, setDriverState] = useState<"EMULATED" | "PARAVIRTUALIZED">("PARAVIRTUALIZED");
  const [balloonSize, setBalloonSize] = useState("0 MB (Idle)");

  const scenes = [
    { title: "Legacy Emulated Hardware Traps", sub: "Guest runs on emulated e1000 NIC and legacy IDE; every I/O operation forces costly VM-exit CPU context traps" },
    { title: "open-vm-tools Daemon & Modules", sub: "Installs open-vm-tools and loads paravirtualized drivers (vmxnet3, vmw_pvscsi, vmw_balloon)" },
    { title: "Dynamic Memory Ballooning", sub: "Hypervisor reclaims idle RAM via vmw_balloon inflation without triggering guest swap degradation" },
    { title: "Hypervisor Backdoor & Quiescing", sub: "ESXi heartbeats, guest OS time sync, and VSS/LVM filesystem quiesced backups operate at line-rate" },
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
      setDriverState("EMULATED");
      setBalloonSize("0 MB (No Driver)");
    } else if (idx === 1) {
      setDriverState("PARAVIRTUALIZED");
      setBalloonSize("0 MB (Active)");
    } else if (idx === 2) {
      setDriverState("PARAVIRTUALIZED");
      setBalloonSize("2,048 MB (Inflated)");
    } else if (idx === 3) {
      setDriverState("PARAVIRTUALIZED");
      setBalloonSize("512 MB (Optimal)");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Server className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">open-vm-tools Hypervisor Subsystem</h3>
              <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                PARAVIRTUALIZED KERNEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">ESXi Host Backdoor: vmxnet3, vmw_balloon, PVSCSI, and Time Sync</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Visual Hypervisor-Guest Bridge */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Guest Ubuntu VM */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-cyan-400" /> Guest VM: Ubuntu 22.04 LTS
              </span>
              <span className="text-[10px] text-cyan-300">Kernel: 6.8 vmlinuz</span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Network Device Driver:</div>
                <div className="text-[11px] font-mono text-cyan-400">
                  {driverState === "PARAVIRTUALIZED" ? "vmxnet3 (10GbE Paravirtualized, Offloads)" : "e1000 (Emulated Intel 1GbE, High Traps)"}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Memory Balloon Driver:</div>
                <div className="text-[11px] font-mono text-amber-400">
                  vmw_balloon: {balloonSize}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Storage Controller:</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {driverState === "PARAVIRTUALIZED" ? "vmw_pvscsi (Direct Hypervisor DMA)" : "LSI Logic Parallel (Emulated)"}
                </div>
              </div>
            </div>
          </div>

          {/* Host Hypervisor ESXi */}
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Server className="h-4 w-4" /> VMware ESXi 8.0 Hypervisor
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">VMM ACTIVE</span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Guest Heartbeat Status:</div>
                <div className="text-[11px] text-emerald-300 flex items-center gap-1">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  {sceneIndex >= 1 ? "Green (Healthy, Guest Tools Running)" : "Gray (Unknown, Tools Not Detected)"}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">VM-Exit Context Switch Rate:</div>
                <div className="text-[11px] font-mono text-slate-200">
                  {driverState === "PARAVIRTUALIZED" ? "120 traps/sec (Ultra-Low Overhead)" : "24,800 traps/sec (Severe Overhead)"}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold mb-1">Snapshot Quiescing:</div>
                <div className="text-[11px] text-cyan-300">
                  {sceneIndex === 3 ? "LVM freeze/thaw hook enabled (Crash-Consistent)" : "Standard hypervisor checkpoint"}
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
