"use client";

import React from "react";
import { Server, Activity } from "lucide-react";

interface CanvasLoaderProps {
  label?: string;
}

export default function CanvasLoader({ label = "Initializing Cluster WebGL Engine..." }: CanvasLoaderProps) {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[560px] bg-cyber-900 border border-cyber-border rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
      {/* Background terminal grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1623_1px,transparent_1px),linear-gradient(to_bottom,#0f1623_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Cyber pulse circle */}
      <div className="relative flex items-center justify-center mb-4">
        <div className="absolute w-16 h-16 rounded-full border border-cyber-cyan/30 animate-ping" />
        <div className="w-12 h-12 rounded-lg bg-cyber-800 border border-cyber-cyan/50 flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,245,212,0.3)]">
          <Server className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Status telemetry */}
      <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-800/90 border border-cyber-border text-xs text-zinc-300 font-mono">
        <Activity className="w-3.5 h-3.5 text-cyber-emerald animate-spin" />
        <span>{label}</span>
      </div>

      {/* Bottom rack simulated indicator bar */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-cyber-border/40 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
          RACK_U42 TELEMETRY: READY
        </span>
        <span>SHADERS: COMPILED</span>
      </div>
    </div>
  );
}
