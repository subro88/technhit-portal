"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Server, Shield, Send, RefreshCw, Cpu, Database, CheckCircle2 } from "lucide-react";

export default function PacketRoutingDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<anime.AnimeInstance | null>(null);
  const [routedCount, setRoutedCount] = useState(1420);
  const [avgLatency, setAvgLatency] = useState(0.42);

  const initPacketAnimation = () => {
    if (!containerRef.current) return;
    if (animRef.current) animRef.current.pause();

    animRef.current = anime({
      targets: containerRef.current.querySelectorAll(".packet-dot"),
      translateX: [
        { value: 120, duration: 600, easing: "easeInOutQuad" },
        { value: 320, duration: 800, easing: "easeInOutSine" },
        { value: 540, duration: 600, easing: "easeOutQuad" },
      ],
      opacity: [
        { value: 0, duration: 100 },
        { value: 1, duration: 400 },
        { value: 1, duration: 1200 },
        { value: 0, duration: 300 },
      ],
      delay: anime.stagger(350),
      loop: true,
      update: () => {
        setRoutedCount((prev) => prev + 1);
      },
    });
  };

  useEffect(() => {
    initPacketAnimation();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && animRef.current) {
            animRef.current.pause();
          } else if (entry.isIntersecting && animRef.current) {
            animRef.current.play();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (animRef.current) animRef.current.pause();
    };
  }, []);

  const triggerTrafficBurst = () => {
    setAvgLatency(0.89);
    setTimeout(() => setAvgLatency(0.42), 2000);
    anime({
      targets: ".node-card",
      scale: [1, 1.05, 1],
      duration: 300,
      easing: "easeInOutQuad",
      delay: anime.stagger(100),
    });
  };

  return (
    <div className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-6 shadow-2xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cyber-border">
        <div>
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-cyber-emerald" />
            <h3 className="font-mono text-base font-semibold text-zinc-100">
              Cluster Ingress & Packet Mesh Routing
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
              eBPF / WireGuard
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Simulated BGP Anycast routing through nftables ingress proxies to backend Proxmox VE worker nodes.
          </p>
        </div>

        <button
          onClick={triggerTrafficBurst}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-750 border border-cyber-border text-xs font-mono text-zinc-200 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>BURST TRAFFIC</span>
        </button>
      </div>

      {/* SVG Canvas Area */}
      <div
        ref={containerRef}
        className="relative my-6 aspect-[16/9] md:aspect-[21/9] max-h-[380px] bg-cyber-950 border border-cyber-border/70 rounded-xl p-6 flex items-center justify-between overflow-x-auto"
      >
        {/* Node 1: Edge Proxy */}
        <div className="node-card shrink-0 flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-cyan/40 w-32 text-center shadow-lg">
          <Shield className="w-6 h-6 text-cyber-cyan mb-1" />
          <span className="text-xs font-mono font-semibold text-zinc-200">EDGE_GW</span>
          <span className="text-[10px] font-mono text-cyber-cyan mt-0.5">BGP Anycast</span>
          <span className="text-[9px] font-mono text-zinc-500 mt-1">IP 194.26.29.1</span>
        </div>

        {/* Dynamic Animated Packet Stream */}
        <div className="relative flex-1 h-12 mx-4 flex items-center">
          <div className="w-full h-0.5 bg-zinc-800 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-emerald to-cyber-purple opacity-30" />
          </div>
          {/* Moving Dots */}
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className="packet-dot absolute w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_12px_#00f5d4] top-1/2 -translate-y-1/2 will-change-transform"
            />
          ))}
        </div>

        {/* Node 2: Ingress Balancer */}
        <div className="node-card shrink-0 flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-emerald/40 w-32 text-center shadow-lg">
          <Server className="w-6 h-6 text-cyber-emerald mb-1" />
          <span className="text-xs font-mono font-semibold text-zinc-200">INGRESS_LB</span>
          <span className="text-[10px] font-mono text-cyber-emerald mt-0.5">Keepalived</span>
          <span className="text-[9px] font-mono text-zinc-500 mt-1">HA Virtual IP</span>
        </div>

        <div className="relative flex-1 h-12 mx-4 flex items-center">
          <div className="w-full h-0.5 bg-zinc-800" />
        </div>

        {/* Node 3: Worker Node */}
        <div className="node-card shrink-0 flex flex-col items-center p-3 rounded-lg bg-cyber-900 border border-cyber-purple/40 w-32 text-center shadow-lg">
          <Cpu className="w-6 h-6 text-cyber-purple mb-1" />
          <span className="text-xs font-mono font-semibold text-zinc-200">WORKER_01</span>
          <span className="text-[10px] font-mono text-cyber-purple mt-0.5">KVM / Ceph</span>
          <span className="text-[9px] font-mono text-zinc-500 mt-1">10GbE Mesh</span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-cyber-border text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-cyber-850 border border-cyber-border/40">
          <span className="text-zinc-500 block text-[10px]">PACKETS ROUTED</span>
          <span className="text-cyber-cyan font-semibold text-sm">{routedCount.toLocaleString()}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-cyber-850 border border-cyber-border/40">
          <span className="text-zinc-500 block text-[10px]">INTERNAL LATENCY</span>
          <span className="text-cyber-emerald font-semibold text-sm">{avgLatency} ms</span>
        </div>
        <div className="p-2.5 rounded-lg bg-cyber-850 border border-cyber-border/40">
          <span className="text-zinc-500 block text-[10px]">COROSYNC QUORUM</span>
          <span className="text-zinc-200 font-semibold text-sm">3/3 NODES</span>
        </div>
        <div className="p-2.5 rounded-lg bg-cyber-850 border border-cyber-border/40">
          <span className="text-zinc-500 block text-[10px]">DROPPED FRAMES</span>
          <span className="text-zinc-400 font-semibold text-sm">0.000%</span>
        </div>
      </div>
    </div>
  );
}
