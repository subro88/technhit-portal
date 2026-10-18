"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Server, ArrowRight, VolumeX, Volume2, Shield, Terminal, Cpu, BookOpen } from "lucide-react";
import ServerRackWrapper from "@/components/3d/ServerRackWrapper";

const REEL_FRAMES = [
  {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80",
    label: "ENTERPRISE HYPERVISOR RACKS",
  },
  {
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1920&q=80",
    label: "CEPH DISTRIBUTED STORAGE FABRIC",
  },
  {
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80",
    label: "LOCAL AI GPU INFERENCE RIGS",
  },
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1920&q=80",
    label: "10+2 MULTIVARIABLE VECTOR FIELDS",
  },
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    label: "HARDENED LINUX TERMINALS",
  },
];

export function HeroReelWithRack() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [viewMode, setViewMode] = useState<"reel" | "3d">("reel");

  // Cycle frames
  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFrame((c) => (c + 1) % REEL_FRAMES.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[820px] lg:h-[92vh] w-full overflow-hidden border-b border-zinc-800 bg-[#07090e]">
      {/* Background Frame Reel */}
      <div className="absolute inset-0">
        {REEL_FRAMES.map((frame, idx) => (
          <div
            key={frame.url}
            className={`reel-frame ${idx === currentFrame ? "active" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.url} alt={frame.label} />
          </div>
        ))}
      </div>

      {/* Cyber Overlay Gradients & Scanlines */}
      <div className="hero-overlay" />
      <div className="scan-line" />

      {/* Hero Content Container */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 lg:px-10 flex flex-col justify-between pt-24 pb-16">
        {/* Top Control Bar: Reel Live Status & Sound Toggle */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-zinc-300 tracking-[0.2em]">LAB FEED // LIVE</span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[11px] text-zinc-500 tracking-wider">
              {REEL_FRAMES[currentFrame].label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher (Reel vs 3D Server Rack) */}
            <div className="flex items-center bg-black/70 backdrop-blur-md border border-zinc-800 p-1 rounded font-heading text-xs tracking-wider uppercase">
              <button
                onClick={() => setViewMode("reel")}
                className={`px-3 py-1 rounded transition-colors ${
                  viewMode === "reel" ? "bg-amber-500 text-black font-bold" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Cinematic Reel
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                  viewMode === "3d" ? "bg-cyber-cyan text-black font-bold" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Server className="w-3 h-3" />
                <span>3D Cluster</span>
              </button>
            </div>

            {/* Mute/Sound Simulation Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 border border-white/10 hover:border-amber-500 bg-black/60 backdrop-blur-md transition-colors text-xs font-mono text-zinc-300"
            >
              <div className={`flex items-end gap-[2px] h-3.5 ${!isMuted ? "unmuted" : ""}`}>
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>
              <span className="hidden md:inline uppercase text-[10px] tracking-widest">
                {isMuted ? "Muted" : "Telemetry"}
              </span>
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
              )}
            </button>
          </div>
        </div>

        {/* Center Grid: Giant Headline or 3D Stage */}
        <div className="grid lg:grid-cols-12 gap-8 items-center my-auto py-8">
          <div className={`${viewMode === "3d" ? "lg:col-span-6" : "lg:col-span-8"} space-y-6`}>
            <div className="section-marker">
              <span>EST. 2026 // OPEN LAB</span>
            </div>

            <h1 className="font-display text-[15vw] sm:text-[11vw] lg:text-[7.8vw] leading-[0.84] text-zinc-100 tracking-tight">
              BUILT BY <br />
              <span className="text-stroke">DISCIPLINE.</span> <br />
              FORGED IN <span className="text-[#FF5400]">CODE.</span>
            </h1>

            <p className="max-w-2xl text-zinc-300 text-base sm:text-lg leading-relaxed font-body">
              An elite developer publication and interactive systems lab for engineers who refuse fragile architectures. Enterprise Linux kernel tuning, Proxmox/Ceph virtualization, local AI clusters, and 10+2 multivariable mathematics.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/linux-server-admin"
                className="pulse-btn font-heading text-sm tracking-[0.2em] uppercase text-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-7 py-4 transition-all flex items-center gap-3 font-bold shadow-lg"
              >
                <span>EXPLORE TRACKS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/visual-lab"
                className="font-heading text-sm tracking-[0.2em] uppercase text-zinc-200 border border-zinc-700 hover:border-cyber-cyan hover:text-cyber-cyan bg-black/40 backdrop-blur-sm px-6 py-4 transition-colors flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-cyber-cyan" />
                <span>VISUAL LAB</span>
              </Link>

              <Link
                href="/stem-10-plus-2"
                className="font-heading text-sm tracking-[0.2em] uppercase text-zinc-400 hover:text-amber-400 px-4 py-4 transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>10+2 STEM MATH</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Server Rack or Hardware Spec Card */}
          <div className={`${viewMode === "3d" ? "lg:col-span-6" : "lg:col-span-4"} flex justify-center`}>
            {viewMode === "3d" ? (
              <div className="w-full h-[450px] lg:h-[520px] rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 shadow-2xl relative">
                <div className="absolute top-3 left-4 z-20 font-mono text-[10px] text-cyber-cyan tracking-[0.2em] uppercase">
                  // R3F 3D CLUSTER RACK — INTERACTIVE
                </div>
                <ServerRackWrapper />
              </div>
            ) : (
              <div className="w-full max-w-md p-6 bg-black/70 backdrop-blur-md border border-zinc-800 notch-corner space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase">
                    / RACK-NODE-ALPHA
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    HEALTH: OPTIMAL
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>KERNEL VERSION</span>
                    <span className="text-zinc-200 font-bold">Linux 6.6-LTS</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>STORAGE FABRIC</span>
                    <span className="text-zinc-200 font-bold">Ceph Reef NVMe</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>LOCAL LLM ENGINE</span>
                    <span className="text-zinc-200 font-bold">vLLM 0.6.2 (AWQ)</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>10+2 MATH LAB</span>
                    <span className="text-zinc-200 font-bold">Vector Field Dynamics</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => setViewMode("3d")}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-700 hover:border-amber-500 font-heading text-xs tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2"
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>LAUNCH 3D RACK VIEW</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Hero Strip: Frame Progress Bar & Chapter Numbers */}
        <div className="w-full pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-1 max-w-lg">
            <div className="font-mono text-xs text-zinc-400 tracking-widest">
              <span className="text-amber-400 font-bold">0{currentFrame + 1}</span> / 0{REEL_FRAMES.length}
            </div>
            <div className="flex-1 h-[2px] bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              REEL ROTATION
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
            <span className="text-amber-500">▶</span>
            <span>PAIRED WITH YOUTUBE: @TECHBLOGTUTORIAL</span>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Tape Strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/80 backdrop-blur-md py-2.5 overflow-hidden z-20">
        <div className="marquee-track font-display text-sm tracking-[0.25em] text-zinc-400">
          <span className="px-8 text-zinc-200">BUILT BY DISCIPLINE</span><span className="text-amber-500">/</span>
          <span className="px-8 text-zinc-200">POWERED BY KERNEL</span><span className="text-cyber-cyan">/</span>
          <span className="px-8 text-zinc-200">ZERO SHORTCUTS</span><span className="text-amber-500">/</span>
          <span className="px-8 text-zinc-200">10+2 MULTIVARIABLE CALCULUS</span><span className="text-cyber-emerald">/</span>
          <span className="px-8 text-zinc-200">FORGED IN CODE</span><span className="text-amber-500">/</span>
          <span className="px-8 text-zinc-200">CEPH REEF SDS</span><span className="text-cyber-purple">/</span>
          <span className="px-8 text-zinc-200">LOCAL LLM COMPUTE</span><span className="text-cyber-cyan">/</span>
          <span className="px-8 text-zinc-200">BUILT BY DISCIPLINE</span><span className="text-amber-500">/</span>
          <span className="px-8 text-zinc-200">POWERED BY KERNEL</span><span className="text-cyber-cyan">/</span>
          <span className="px-8 text-zinc-200">ZERO SHORTCUTS</span><span className="text-amber-500">/</span>
          <span className="px-8 text-zinc-200">10+2 MULTIVARIABLE CALCULUS</span><span className="text-cyber-emerald">/</span>
          <span className="px-8 text-zinc-200">FORGED IN CODE</span><span className="text-amber-500">/</span>
        </div>
      </div>
    </section>
  );
}
export default HeroReelWithRack;
