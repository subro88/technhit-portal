"use client";

import React from "react";
import { Layers, Network, Cpu, Shield, Database, Server } from "lucide-react";

interface ArchitectureDiagramProps {
  type?: "cluster" | "network" | "stem" | "reverse-proxy" | "php-fpm" | "kernel-firewall";
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

      {type === "reverse-proxy" && (
        <div className="py-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Node 1: Client Tier */}
            <div className="p-4 rounded-xl bg-cyber-900 border border-zinc-800 text-center font-mono relative group hover:border-zinc-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-cyan-400 flex items-center justify-center mx-auto mb-2 border border-zinc-700">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-100 block">CLIENT BROWSER</span>
              <span className="text-[10px] text-zinc-400 mt-1 block">Public Internet · TCP Socket</span>
              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>TLS 1.3 / Port 443</span>
              </div>
            </div>

            {/* Node 2: Nginx Edge Reverse Proxy */}
            <div className="p-4 rounded-xl bg-[#0d1117] border border-[#00f5d4]/60 text-center font-mono relative shadow-[0_0_20px_rgba(0,245,212,0.12)]">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#00f5d4] text-black font-bold text-[9px] tracking-wider uppercase">
                EDGE TERMINATION
              </div>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-[#00f5d4] flex items-center justify-center mx-auto mb-2 border border-[#00f5d4]/50">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block">NGINX REVERSE PROXY</span>
              <span className="text-[10px] text-cyan-400/90 mt-1 block">10.0.50.57 : 80 / 443</span>
              <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-1 text-left bg-zinc-950/60 p-2 rounded">
                <div className="text-[9px] text-[#00f5d4] font-bold">INJECTED PROXY HEADERS:</div>
                <div className="truncate text-zinc-300">X-Forwarded-For: $proxy_add...</div>
                <div className="truncate text-zinc-300">X-Real-IP: $remote_addr</div>
                <div className="truncate text-zinc-300">X-Forwarded-Proto: $scheme</div>
              </div>
            </div>

            {/* Node 3: Upstream Backends */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-cyber-900 border border-amber-500/50 font-mono text-left group hover:border-amber-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    DYNAMIC BACKEND
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Apache :8080
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Processes PHP / Python / MySQL logic via loopback socket.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-cyber-900 border border-emerald-500/50 font-mono text-left group hover:border-emerald-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    STATIC CACHE
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    /var/www/html
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Zero-copy direct sendfile() delivery (0.8ms TTFB).
                </p>
              </div>
            </div>
          </div>

          {/* Traffic Legend Banner */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2">
            <span className="text-zinc-300 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00f5d4]" />
              SECURITY ADVANTAGE:
            </span>
            <span>Origin Apache port 8080 is blocked from external WAN; only localhost socket accepted.</span>
          </div>
        </div>
      )}

      {type === "php-fpm" && (
        <div className="py-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Node 1: Ingress Apache */}
            <div className="p-4 rounded-xl bg-cyber-900 border border-zinc-800 text-center font-mono relative">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-zinc-700">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-100 block">APACHE 2.4 EVENT MPM</span>
              <span className="text-[10px] text-zinc-400 mt-1 block">VirtualHost Domain Dispatcher</span>
              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-500">
                <span>mod_proxy_fcgi Handler</span>
              </div>
            </div>

            {/* Node 2: FastCGI Dispatch Pipeline */}
            <div className="p-4 rounded-xl bg-[#0d1117] border border-cyan-500/50 text-center font-mono relative shadow-[0_0_20px_rgba(0,245,212,0.1)]">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-[#00f5d4] flex items-center justify-center mx-auto mb-2 border border-[#00f5d4]/40">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block">UNIX DOMAIN SOCKETS</span>
              <span className="text-[10px] text-cyan-400/90 mt-1 block">Zero TCP Loopback Overhead</span>
              <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[10px] text-zinc-400 text-left space-y-1 bg-zinc-950/60 p-2 rounded">
                <div className="truncate text-zinc-300">SetHandler &quot;proxy:unix:/run/...&quot;</div>
                <div className="truncate text-zinc-300">Isolated Process Trees</div>
              </div>
            </div>

            {/* Node 3: Multi-PHP Daemon Pools */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-cyber-900 border border-rose-500/40 font-mono text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-400">PHP 7.4-FPM</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
                    Legacy Core
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                  unix:/run/php/php7.4-fpm.sock
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyber-900 border border-cyan-500/40 font-mono text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-cyan-400">PHP 8.1-FPM</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Stable LTS
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                  unix:/run/php/php8.1-fpm.sock
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-cyber-900 border border-emerald-500/40 font-mono text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-400">PHP 8.3-FPM</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    JIT Next-Gen
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                  unix:/run/php/php8.3-fpm.sock
                </div>
              </div>
            </div>
          </div>

          {/* Isolation Banner */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2">
            <span className="text-zinc-300 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              PROCESS ISOLATION GUARANTEE:
            </span>
            <span>If a PHP 7.4 legacy script crashes or exhausts memory, PHP 8.1 and 8.3 daemons remain completely unaffected.</span>
          </div>
        </div>
      )}

      {type === "kernel-firewall" && (
        <div className="py-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            {/* Stage 1: NIC Packet Ingress */}
            <div className="p-3.5 rounded-xl bg-cyber-900 border border-zinc-800 text-center font-mono">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-zinc-700">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-100 block">NIC INGRESS</span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">WAN Ethernet Frame</span>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[9px] text-zinc-500">
                RX Ring Buffer
              </div>
            </div>

            {/* Stage 2: Netfilter / Nftables */}
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-cyan-500/60 text-center font-mono shadow-[0_0_15px_rgba(0,245,212,0.1)]">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-[#00f5d4] flex items-center justify-center mx-auto mb-2 border border-[#00f5d4]/40">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block">NFTABLES HOOK</span>
              <span className="text-[10px] text-cyan-400/90 mt-0.5 block">prerouting / input</span>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[9px] text-zinc-300">
                ct state invalid drop
              </div>
            </div>

            {/* Stage 3: Linux TCP Stack / Sysctl */}
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-emerald-500/60 text-center font-mono shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block">SYSCTL ENGINE</span>
              <span className="text-[10px] text-emerald-400/90 mt-0.5 block">Kernel Memory Layer</span>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[9px] text-zinc-300">
                tcp_syncookies = 1
              </div>
            </div>

            {/* Stage 4: Protected User Socket */}
            <div className="p-3.5 rounded-xl bg-cyber-900 border border-purple-500/50 text-center font-mono">
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-500/40">
                <Server className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-100 block">LOCAL SOCKET</span>
              <span className="text-[10px] text-purple-400/90 mt-0.5 block">Bound Service Ports</span>
              <div className="mt-2.5 pt-2 border-t border-zinc-800 text-[9px] text-zinc-500">
                SSH (22) / Nginx (443)
              </div>
            </div>
          </div>

          {/* Performance Legend */}
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex flex-wrap items-center justify-between gap-2">
            <span className="text-zinc-300 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#00f5d4]" />
              ATOMIC EVALUATION ADVANTAGE:
            </span>
            <span>Nftables uses an internal in-kernel bytecode virtual machine, evaluating stateful rules in &lt; 0.2 microseconds per packet.</span>
          </div>
        </div>
      )}
    </div>
  );
}
