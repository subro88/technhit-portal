"use client";

import React, { useState, useEffect } from "react";
import { Activity, Cpu, HardDrive, Network, Play, Pause, RotateCcw, AlertTriangle, Layers, BarChart3 } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface SystemMonitoringTriageVisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function SystemMonitoringTriageVisualizer({ onTimelineSync, externalStep }: SystemMonitoringTriageVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<"htop" | "vmstat" | "iostat" | "ss" | "glances">("htop");
  const [bottleneck, setBottleneck] = useState<"none" | "cpu_spike" | "io_wait" | "swap_storm">("none");

  const scenes = [
    { tool: "htop", title: "CPU & Process Scheduling", sub: "Inspect multi-core thread load, nice priorities, load averages, and runaway PIDs" },
    { tool: "vmstat", title: "Virtual Memory & Context Switching", sub: "Monitor free/buff/cache, swap in/out (si/so), system interrupts (in), and context switches (cs)" },
    { tool: "iostat", title: "Disk I/O Subsystem & %util", sub: "Track await latency, read/write IOPS, discard metrics, and disk saturation (%util > 85%)" },
    { tool: "ss", title: "Socket Statistics & Network Buffers", sub: "Analyze TCP connection states (ESTAB, TIME-WAIT), send/recv socket queue backlogs, and dropped frames" },
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
    if (idx === 0) { setActiveTool("htop"); setBottleneck("none"); }
    else if (idx === 1) { setActiveTool("vmstat"); setBottleneck("swap_storm"); }
    else if (idx === 2) { setActiveTool("iostat"); setBottleneck("io_wait"); }
    else if (idx === 3) { setActiveTool("ss"); setBottleneck("cpu_spike"); }
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">Linux Performance & Observability Suite</h3>
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                KERNEL METRICS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Triage CPU, Virtual Memory, Block Device Saturation, and TCP Sockets</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-emerald-400" /> : <Play className="h-3.5 w-3.5 text-cyan-400" />}
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

      {/* Live Tool Dashboard */}
      <div className="relative rounded-xl border border-slate-800/80 bg-[#0a0d14] p-5 mb-5">
        {/* Metric Gauges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-cyan-400" /> CPU Load</span>
              <span className="font-bold text-cyan-400">{bottleneck === "cpu_spike" ? "94.2%" : "23.4%"}</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  bottleneck === "cpu_spike" ? "bg-red-500 w-[94%]" : "bg-cyan-400 w-[23%]"
                }`}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1"><Layers className="h-3 w-3 text-purple-400" /> RAM Usage</span>
              <span className="font-bold text-purple-400">{bottleneck === "swap_storm" ? "91.8%" : "44.1%"}</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  bottleneck === "swap_storm" ? "bg-amber-500 w-[91%]" : "bg-purple-400 w-[44%]"
                }`}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1"><HardDrive className="h-3 w-3 text-amber-400" /> Disk %util</span>
              <span className="font-bold text-amber-400">{bottleneck === "io_wait" ? "99.2%" : "8.7%"}</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  bottleneck === "io_wait" ? "bg-red-500 w-[99%]" : "bg-amber-400 w-[8%]"
                }`}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span className="flex items-center gap-1"><Network className="h-3 w-3 text-emerald-400" /> TCP Conns</span>
              <span className="font-bold text-emerald-400">1,420 ESTAB</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[42%]" />
            </div>
          </div>
        </div>

        {/* Console Output Terminal */}
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> ACTIVE VIEW: {activeTool.toUpperCase()}
            </span>
            <span className="text-[10px] text-slate-500">Kernel: Linux 6.8.0-45-generic</span>
          </div>

          {activeTool === "htop" && (
            <div className="space-y-1 text-slate-300">
              <div className="text-emerald-400">PID  USER     PR  NI  VIRT   RES   SHR  S %CPU  %MEM    TIME+   COMMAND</div>
              <div> 841 mysql    20   0 1.2G  480M  24M  S 18.2  12.0  14:32.18 /usr/sbin/mysqld</div>
              <div>1204 nginx    20   0  140M   42M  12M  S  7.4   1.2   4:12.89 nginx: worker process</div>
              <div>2049 php-fpm  20   0  210M   68M  18M  S  6.1   1.8   2:05.12 php-fpm: pool www</div>
              <div className="text-slate-500">Tasks: 142 total, 2 running, 140 sleeping | Load average: 0.42 0.38 0.31</div>
            </div>
          )}

          {activeTool === "vmstat" && (
            <div className="space-y-1 text-slate-300">
              <div className="text-purple-400">procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----</div>
              <div className="text-slate-400"> r  b   swpd   free   buff  cache   si   so    bi    bo   in    cs  us sy id wa st</div>
              <div> 1  0      0 812940  48200 1204900    0    0    12    45  180   420   4  2 94  0  0</div>
              <div> 2  1   4200 412000  12000  840000   12   48   240   890 1420  3890  18  8 68  6  0</div>
              <div className="text-emerald-400">Zero paging storm detected; memory pressure within healthy threshold.</div>
            </div>
          )}

          {activeTool === "iostat" && (
            <div className="space-y-1 text-slate-300">
              <div className="text-amber-400">Device             r/s     w/s     rkB/s     wkB/s   await  r_await  w_await  %util</div>
              <div>nvme0n1          42.0   180.5    1280.0    9420.0    1.12     0.84     1.24   8.70</div>
              <div>sda               0.0     0.0       0.0       0.0    0.00     0.00     0.00   0.00</div>
              <div className="text-cyan-400">Queue latency await &lt; 2.0ms | NVMe I/O subsystem operating at peak efficiency</div>
            </div>
          )}

          {activeTool === "ss" && (
            <div className="space-y-1 text-slate-300">
              <div className="text-cyan-400">Netid  State      Recv-Q Send-Q Local Address:Port  Peer Address:Port</div>
              <div>tcp    ESTAB      0      0      10.0.0.4:443   198.51.100.22:54210</div>
              <div>tcp    ESTAB      0      0      10.0.0.4:80    203.0.113.84:61902</div>
              <div>tcp    LISTEN     0      511    0.0.0.0:443    0.0.0.0:*</div>
              <div className="text-emerald-400">Socket Recv-Q = 0; no network application backlog or buffer starvation.</div>
            </div>
          )}
        </div>

        {/* Scene HUD */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
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
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
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
