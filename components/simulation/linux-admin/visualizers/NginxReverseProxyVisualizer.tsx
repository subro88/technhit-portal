"use client";

import React, { useState, useEffect } from "react";
import { Server, ArrowRight, Play, Pause, RotateCcw, ShieldCheck, Zap, HardDrive } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface NginxReverseProxyVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function NginxReverseProxyVisualizer({ onTimelineSync, externalStep }: NginxReverseProxyVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeNode, setActiveNode] = useState<number>(0);
  const [cacheHitRate, setCacheHitRate] = useState("12%");
  const [rateLimitTriggered, setRateLimitTriggered] = useState(false);
  const [failedNode, setFailedNode] = useState<number | null>(null);

  const scenes = [
    { title: "Round-Robin Ingress", sub: "Evenly balancing incoming HTTPS traffic across upstream app pool" },
    { title: "Upstream Node Failover", sub: "Backend srv-02 crashes; Nginx max_fails drops it and redirects traffic" },
    { title: "Cache Acceleration", sub: "Proxy cache hit serves 365d immutable static assets with 0 backend load" },
    { title: "Rate Limit Defense", sub: "Leaky bucket zone throttles abusive bursts above 30 req/sec" },
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
      setFailedNode(null);
      setRateLimitTriggered(false);
      setCacheHitRate("15%");
    } else if (idx === 1) {
      setFailedNode(1);
      setRateLimitTriggered(false);
      setCacheHitRate("18%");
    } else if (idx === 2) {
      setFailedNode(null);
      setRateLimitTriggered(false);
      setCacheHitRate("88%");
    } else if (idx === 3) {
      setFailedNode(null);
      setRateLimitTriggered(true);
      setCacheHitRate("45%");
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

  // Simulated packet routing animation
  useEffect(() => {
    const packetInterval = setInterval(() => {
      setActiveNode((prev) => {
        const next = (prev + 1) % 3;
        return next === failedNode ? (next + 1) % 3 : next;
      });
    }, 900);
    return () => clearInterval(packetInterval);
  }, [failedNode]);

  return (
    <div className="w-full bg-[#07090e] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Nginx High-Performance Reverse Proxy &amp; Upstream Conductor
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            nginx/1.24.0 (Event MPM)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            title={isPlaying ? "Pause Timeline" : "Play Timeline"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setScene(0)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas / Diagram */}
      <div className="p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#07090e] to-[#07090e]">
        {/* Status Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">INGRESS REQUESTS</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">2,450 req/s</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">CACHE HIT RATIO</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{cacheHitRate}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">LEAKY BUCKET</div>
            <div className={`text-lg font-bold mt-0.5 ${rateLimitTriggered ? "text-red-400" : "text-zinc-300"}`}>
              {rateLimitTriggered ? "THROTTLING" : "HEALTHY"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">UPSTREAM QUORUM</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{failedNode !== null ? "2/3 ONLINE" : "3/3 ONLINE"}</div>
          </div>
        </div>

        {/* Visual Architecture Topology */}
        <div className="relative py-8 px-4 border border-zinc-800/80 rounded-lg bg-black/40 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left: Client Ingress */}
            <div className="p-5 border border-cyan-500/30 rounded bg-cyan-950/10 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">CLIENT INGRESS</span>
                <span className="text-zinc-500">TLS 1.3 HTTP/2</span>
              </div>
              <div className="font-display text-xl text-zinc-100">Public Users</div>
              <p className="text-xs text-zinc-400 font-body">
                Browsers connecting via HTTPS port 443 with SNI header technhit.in.
              </p>
              <div className="font-mono text-[11px] text-zinc-300 bg-black/60 p-2 rounded border border-zinc-800">
                GET /api/v1/posts HTTP/2.0
              </div>
            </div>

            {/* Center: Nginx Master/Worker Engine */}
            <div className="p-5 border border-emerald-500/40 rounded bg-emerald-950/15 space-y-3 relative shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">NGINX REVERSE PROXY</span>
                <span className="text-emerald-400">epoll event loop</span>
              </div>
              <div className="font-display text-xl text-zinc-100">Proxy Engine &amp; Cache</div>
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-300 bg-black/70 p-2.5 rounded border border-zinc-800">
                <div className="flex justify-between">
                  <span>SSL Termination:</span>
                  <span className="text-emerald-400">Active (Certbot)</span>
                </div>
                <div className="flex justify-between">
                  <span>Microcache:</span>
                  <span className="text-amber-400">/var/cache/nginx</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate Limiting:</span>
                  <span className={rateLimitTriggered ? "text-red-400 font-bold" : "text-zinc-400"}>
                    {rateLimitTriggered ? "limit_req burst=10" : "30r/s nominal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Upstream Nodes */}
            <div className="space-y-2.5 font-mono text-xs">
              {[0, 1, 2].map((idx) => {
                const isDown = failedNode === idx;
                const isActive = activeNode === idx && !isDown;
                return (
                  <div
                    key={idx}
                    className={`p-3 border rounded transition-all flex items-center justify-between ${
                      isDown
                        ? "border-red-500/50 bg-red-950/20 opacity-60"
                        : isActive
                        ? "border-[#FF5400] bg-zinc-900 shadow-[0_0_12px_rgba(255,84,0,0.25)]"
                        : "border-zinc-800 bg-zinc-950/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Server className={`w-4 h-4 ${isDown ? "text-red-400" : isActive ? "text-[#FF5400]" : "text-zinc-500"}`} />
                      <div>
                        <div className="text-zinc-200 font-bold">upstream_node_0{idx + 1}</div>
                        <div className="text-[10px] text-zinc-500">127.0.0.1:300{idx}</div>
                      </div>
                    </div>
                    <div>
                      {isDown ? (
                        <span className="px-2 py-0.5 rounded bg-red-900/60 text-red-300 text-[9px] font-bold">DOWN</span>
                      ) : isActive ? (
                        <span className="px-2 py-0.5 rounded bg-[#FF5400] text-black text-[9px] font-bold">ROUTING</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px]">READY</span>
                      )}
                    </div>
                  </div>
                );
              })}
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
