"use client";

import React, { useState, useEffect } from "react";
import { Film, Cpu, HardDrive, Play, Pause, RotateCcw, Zap, Sparkles, Smartphone, Server } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface PlexTranscodingVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function PlexTranscodingVisualizer({ onTimelineSync, externalStep }: PlexTranscodingVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [transcodeMode, setTranscodeMode] = useState<"direct_play" | "hw_transcode" | "sw_cpu">("hw_transcode");
  const [cpuUsage, setCpuUsage] = useState("4.2% (Intel QuickSync VAAPI)");

  const scenes = [
    { title: "Direct Play Zero-Overhead", sub: "Client supports container & codecs (H.264/AAC); stream served direct from disk with zero CPU load" },
    { title: "4K HDR Dynamic Tonemapping", sub: "Remote client requires 1080p 8Mbps SDR; Plex triggers real-time color matrix tonemapping" },
    { title: "Hardware Offload (/dev/dri/renderD128)", sub: "ASIC decoding/encoding via QuickSync / NVENC handles 4K HEVC stream; CPU remains idle" },
    { title: "RAM-Backed /dev/shm Transcode", sub: "Chunked HLS segments write directly to tmpfs in RAM, saving SSD TBW write endurance" },
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
      setTranscodeMode("direct_play");
      setCpuUsage("0.8% (Direct I/O)");
    } else if (idx === 1) {
      setTranscodeMode("sw_cpu");
      setCpuUsage("92.4% (Software x264 Transcode)");
    } else if (idx === 2) {
      setTranscodeMode("hw_transcode");
      setCpuUsage("3.8% (Intel QuickSync /dev/dri)");
    } else if (idx === 3) {
      setTranscodeMode("hw_transcode");
      setCpuUsage("4.1% (Hardware + RAM /dev/shm)");
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Film className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Plex Media Server Transcoding Engine</h3>
              <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                VAAPI /dev/dri OFF-LOAD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Hardware Tonemapping, RAM Tmpfs Chunks, and Systemd Isolation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
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

      {/* Visual Transcode Pipeline */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Media Storage Vault */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <HardDrive className="h-4 w-4 text-cyan-400" /> Storage Subsystem
              </span>
              <span className="text-[10px] text-slate-400">/mnt/media</span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Master Source File:</div>
                <div className="text-[11px] font-bold text-slate-200">Dune.2024.2160p.UHD.mkv</div>
                <div className="text-[10px] text-amber-400 mt-0.5">HEVC Main10 | HDR10 | TrueHD 7.1</div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Disk Read Rate:</div>
                <div className="text-[11px] font-mono text-cyan-400">12.4 MB/s (Sequential DMA)</div>
              </div>
            </div>
          </div>

          {/* Transcode Engine */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-4">
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-3">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Cpu className="h-4 w-4" /> Transcoding Core
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {sceneIndex === 0 ? "PASSTHROUGH" : sceneIndex === 1 ? "SOFTWARE CPU" : "HARDWARE HW (VAAPI)"}
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">GPU Device Driver:</div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {sceneIndex >= 2 ? "/dev/dri/renderD128 (QuickSync)" : "None (CPU Software fallback)"}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">CPU Core Utilization:</div>
                <div className="text-[11px] font-bold text-slate-100 flex items-center gap-1.5">
                  <Zap className={`h-3 w-3 ${sceneIndex === 1 ? "text-red-400" : "text-emerald-400"}`} />
                  {cpuUsage}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Transcode Cache Target:</div>
                <div className="text-[10px] font-mono text-cyan-300">
                  {sceneIndex === 3 ? "/dev/shm (RAM tmpfs 8GB)" : "/var/lib/plexmediaserver/Transcode"}
                </div>
              </div>
            </div>
          </div>

          {/* Target Client Stream */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" /> Client Presentation
              </span>
              <span className="text-[10px] text-slate-400">Mobile HLS</span>
            </div>
            <div className="space-y-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Delivered Stream:</div>
                <div className="text-[11px] font-bold text-emerald-300">
                  {sceneIndex === 0 ? "4K Direct Play (Original)" : "1080p SDR 8.0 Mbps (Tonemapped)"}
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">Playback Buffer:</div>
                <div className="text-[11px] font-mono text-cyan-400">60s Healthy (Zero Stutters)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
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
                ? "border-amber-500/60 bg-amber-500/10 text-amber-200"
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
