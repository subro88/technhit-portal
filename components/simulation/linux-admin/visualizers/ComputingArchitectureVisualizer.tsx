"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Layers, HardDrive, Shield, Play, Pause, RotateCcw, Activity, Zap, Binary } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface ComputingArchitectureVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function ComputingArchitectureVisualizer({ onTimelineSync, externalStep }: ComputingArchitectureVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"registers" | "cache" | "ram" | "disk">("registers");

  const scenes = [
    { title: "Von Neumann CPU Cycle", sub: "Fetch instruction via Program Counter (PC); Decode in Instruction Register (IR); Execute in ALU" },
    { title: "Hardware Latency Pyramid", sub: "Registers (1ns) to L1/L2/L3 Cache (2-20ns) to Main RAM (80ns) to NVMe SSD (25,000ns)" },
    { title: "Kernel Ring 0 vs User Ring 3", sub: "User processes run in restricted Ring 3; trap into Ring 0 Kernel Space via syscall assembly instruction" },
    { title: "Virtual Memory & TLB Paging", sub: "CPU MMU translates 48-bit Virtual Addresses to Physical DRAM frames via multi-level Page Tables & TLB" },
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
    if (idx === 0) setActiveLayer("registers");
    else if (idx === 1) setActiveLayer("cache");
    else if (idx === 2) setActiveLayer("ram");
    else if (idx === 3) setActiveLayer("disk");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Binary className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Computer Architecture & Kernel Fundamentals</h3>
              <span className="rounded bg-purple-400/10 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                VON NEUMANN & X86_64
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">CPU Instruction Pipelining, Memory Hierarchy Latencies, and Ring 0 Protection</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-purple-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
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

      {/* Visual Computer Architecture Canvas */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* CPU Registers & Core */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/10">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-2 mb-3">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <Cpu className="h-4 w-4" /> CPU Registers & ALU
              </span>
              <span className="text-[10px] text-purple-400 font-bold">&lt; 1 ns Latency</span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">RAX (Accumulator):</span>
                <span className="text-cyan-400">0x0000000000000001</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">RIP (Prog Counter):</span>
                <span className="text-emerald-400">0x00007fff84210a40</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">RSP (Stack Pointer):</span>
                <span className="text-amber-400">0x00007fffffffe4b0</span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">CR3 (Page Table Base):</span>
                <span className="text-purple-300">0x0000000109a20000</span>
              </div>
            </div>
          </div>

          {/* Memory Hierarchy Pyramid */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-cyan-400" /> Latency Hierarchy
              </span>
              <span className="text-[10px] text-cyan-400">Speed vs Size</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="p-1 rounded bg-purple-950/40 border border-purple-500/30 flex justify-between">
                <span className="text-purple-300">L1 Cache (32KB):</span>
                <span className="text-slate-300 font-bold">1.2 ns (4 cycles)</span>
              </div>
              <div className="p-1 rounded bg-blue-950/40 border border-blue-500/30 flex justify-between">
                <span className="text-blue-300">L2 Cache (1MB):</span>
                <span className="text-slate-300 font-bold">3.5 ns (12 cycles)</span>
              </div>
              <div className="p-1 rounded bg-cyan-950/40 border border-cyan-500/30 flex justify-between">
                <span className="text-cyan-300">L3 Cache (32MB):</span>
                <span className="text-slate-300 font-bold">12.0 ns (40 cycles)</span>
              </div>
              <div className="p-1 rounded bg-emerald-950/40 border border-emerald-500/30 flex justify-between">
                <span className="text-emerald-300">Main DRAM (32GB):</span>
                <span className="text-slate-300 font-bold">85.0 ns (250 cycles)</span>
              </div>
              <div className="p-1 rounded bg-amber-950/40 border border-amber-500/30 flex justify-between">
                <span className="text-amber-300">NVMe SSD (1TB):</span>
                <span className="text-slate-300 font-bold">25,000 ns (Wait!)</span>
              </div>
            </div>
          </div>

          {/* Privilege Rings & Protection */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Shield className="h-4 w-4" /> x86 Privilege Rings
              </span>
              <span className="text-[10px] text-emerald-300 font-bold">HARDWARE FENCED</span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-red-500/30">
                <div className="flex justify-between items-center text-[10px] font-bold text-red-400">
                  <span>RING 0: KERNEL SPACE</span>
                  <span>Supervisor</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Full I/O port access, interrupt handling, page table management (CR0/CR3/CR4)
                </div>
              </div>

              <div className="p-2 rounded bg-slate-950 border border-emerald-500/30">
                <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400">
                  <span>RING 3: USER SPACE</span>
                  <span>Unprivileged</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Isolated virtual memory. Hardware operations trigger General Protection Fault unless requested via <span className="text-cyan-300 font-bold font-mono">syscall</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
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
                ? "border-purple-500/60 bg-purple-500/10 text-purple-200"
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
