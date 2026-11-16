"use client";

import React, { useState, useEffect } from "react";
import { Zap, Play, Pause, RotateCcw, Activity, ArrowRight, Gauge } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface ApacheBrotliVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function ApacheBrotliVisualizer({ onTimelineSync, externalStep }: ApacheBrotliVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [compressionMode, setCompressionMode] = useState<"none" | "gzip" | "brotli4" | "brotli11">("brotli4");
  const [payloadSize, setPayloadSize] = useState({ raw: 148, compressed: 28, ratio: "-81%" });
  const [cpuUsage, setCpuUsage] = useState("2.4%");

  const scenes = [
    { title: "Raw Uncompressed", sub: "148 KB payload transmitted over WAN with zero compression overhead" },
    { title: "Standard Gzip Deflate", sub: "mod_deflate reduces payload to 46 KB (68% savings), higher CPU than Brotli" },
    { title: "Brotli Dynamic (L4)", sub: "mod_brotli level 4 dynamic compression: 28 KB payload (81% savings)" },
    { title: "Brotli Pre-Compressed (L11)", sub: "Static assets pre-compressed at Level 11: 19 KB (87% reduction) with 0ms CPU" },
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
      setCompressionMode("none");
      setPayloadSize({ raw: 148, compressed: 148, ratio: "0%" });
      setCpuUsage("0.1%");
    } else if (idx === 1) {
      setCompressionMode("gzip");
      setPayloadSize({ raw: 148, compressed: 46, ratio: "-68%" });
      setCpuUsage("4.2%");
    } else if (idx === 2) {
      setCompressionMode("brotli4");
      setPayloadSize({ raw: 148, compressed: 28, ratio: "-81%" });
      setCpuUsage("2.4%");
    } else if (idx === 3) {
      setCompressionMode("brotli11");
      setPayloadSize({ raw: 148, compressed: 19, ratio: "-87%" });
      setCpuUsage("0.2% (Pre-baked)");
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

  return (
    <div className="w-full bg-[#07090e] border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Apache mod_brotli vs Gzip Compression Stream &amp; Network Ingress
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            RFC 7932 / Content-Encoding: br
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setScene(0)}
            className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram */}
      <div className="p-6 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#07090e] to-[#07090e]">
        {/* Status HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono text-xs">
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ORIGINAL PAYLOAD</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">{payloadSize.raw} KB</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ON-THE-WIRE SIZE</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{payloadSize.compressed} KB</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">BANDWIDTH SAVED</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{payloadSize.ratio}</div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">CPU COMPRESSION LOAD</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{cpuUsage}</div>
          </div>
        </div>

        {/* Compression Comparison Pipes */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40 space-y-4">
          {/* Uncompressed Stream */}
          <div>
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>Raw Application Payload (HTML/CSS/JS)</span>
              <span>148 KB (100%)</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded overflow-hidden">
              <div className="h-full bg-zinc-600 w-full" />
            </div>
          </div>

          {/* Gzip Stream */}
          <div>
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
              <span>Standard Gzip (mod_deflate)</span>
              <span>46 KB (31% of wire)</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded overflow-hidden">
              <div className={`h-full transition-all duration-700 ${compressionMode === "gzip" ? "bg-amber-500" : "bg-zinc-700"}`} style={{ width: "31%" }} />
            </div>
          </div>

          {/* Brotli Stream */}
          <div>
            <div className="flex justify-between text-xs font-mono text-cyan-400 mb-1 font-bold">
              <span>Brotli Stream (mod_brotli)</span>
              <span>{payloadSize.compressed} KB ({Math.round((payloadSize.compressed / 148) * 100)}% of wire)</span>
            </div>
            <div className="h-3.5 w-full bg-zinc-900 rounded overflow-hidden border border-cyan-500/40">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                style={{ width: `${Math.round((payloadSize.compressed / 148) * 100)}%` }}
              />
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
