"use client";

import React from "react";
import { Layers, Network, Cpu, Shield, Database, Server } from "lucide-react";

interface ArchitectureDiagramProps {
  type?: "cluster" | "network" | "stem";
  title?: string;
}

export default function ArchitectureDiagram({
  type = "cluster",
  title = "Architecture Topology",
}: ArchitectureDiagramProps) {
  return (
    <div className="my-6 rounded-xl bg-cyber-950 border border-cyber-border overflow-hidden shadow-2xl p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyber-border font-mono text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyber-cyan" />
          <span className="font-semibold text-zinc-100">{title}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-800 text-zinc-400 border border-cyber-border">
          SVG // HIGH-AVAILABILITY TOPOLOGY
        </span>
      </div>

      {type === "cluster" && (
        <div className="flex flex-col md:flex-row items-center justify-around gap-4 py-4">
          <div className="flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-cyan/50 w-36 text-center">
            <Shield className="w-6 h-6 text-cyber-cyan mb-1" />
            <span className="font-mono text-xs font-semibold text-zinc-200">HAProxy VIP</span>
            <span className="font-mono text-[10px] text-zinc-400">10.10.10.100</span>
          </div>

          <div className="text-zinc-600 font-mono text-xs">── 10GbE ──▶</div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-purple/50 w-36 text-center">
              <Cpu className="w-6 h-6 text-cyber-purple mb-1" />
              <span className="font-mono text-xs font-semibold text-zinc-200">Ollama-01</span>
              <span className="font-mono text-[10px] text-zinc-400">RTX 3090 #1</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-purple/50 w-36 text-center">
              <Cpu className="w-6 h-6 text-cyber-purple mb-1" />
              <span className="font-mono text-xs font-semibold text-zinc-200">Ollama-02</span>
              <span className="font-mono text-[10px] text-zinc-400">RTX 3090 #2</span>
            </div>
          </div>

          <div className="text-zinc-600 font-mono text-xs">── NVMe-oF ──▶</div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-emerald/50 w-36 text-center">
            <Database className="w-6 h-6 text-cyber-emerald mb-1" />
            <span className="font-mono text-xs font-semibold text-zinc-200">ZFS Pool</span>
            <span className="font-mono text-[10px] text-zinc-400">RAIDZ2 8TB</span>
          </div>
        </div>
      )}

      {type === "network" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {["PVE-Node-01 (10.10.10.1)", "PVE-Node-02 (10.10.10.2)", "PVE-Node-03 (10.10.10.3)"].map((node, i) => (
            <div key={i} className="p-4 rounded-lg bg-cyber-900 border border-cyber-emerald/40 text-center font-mono">
              <Server className="w-6 h-6 text-cyber-emerald mx-auto mb-2" />
              <span className="text-xs font-semibold text-zinc-200 block">{node}</span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Corosync Link0 + Ceph OSD</span>
            </div>
          ))}
        </div>
      )}

      {type === "stem" && (
        <div className="flex flex-col items-center justify-center p-6 bg-cyber-900 rounded-lg border border-cyber-amber/40 font-mono text-xs text-zinc-300">
          <div className="text-cyber-amber font-semibold text-sm mb-2">Phase Space Differential Map</div>
          <p className="text-center text-zinc-400 max-w-md">
            Trajectories in state space $(x(t), \dot{"{"}x{"}"}(t))$ showing convergence to equilibrium limit cycles.
          </p>
        </div>
      )}
    </div>
  );
}
