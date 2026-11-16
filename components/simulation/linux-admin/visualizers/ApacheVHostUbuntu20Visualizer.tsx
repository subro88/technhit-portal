"use client";

import React, { useState, useEffect } from "react";
import { Globe, FolderCheck, Play, Pause, RotateCcw, CheckCircle2, ShieldAlert } from "lucide-react";
import { playHapticSound } from "@/lib/operative-store";

interface ApacheVHostUbuntu20VisualizerProps {
  onTimelineSync?: (time: number, sceneIndex: number) => void;
  externalStep?: number;
}

export function ApacheVHostUbuntu20Visualizer({ onTimelineSync, externalStep }: ApacheVHostUbuntu20VisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [activeHost, setActiveHost] = useState<"site1" | "site2">("site1");
  const [permissionState, setPermissionState] = useState<"755 www-data" | "403 Forbidden" | "Hardened">("755 www-data");
  const [syntaxVerified, setSyntaxVerified] = useState(true);

  const scenes = [
    { title: "VirtualHost Routing", sub: "Incoming Host: site-alpha.com routed to /var/www/alpha/html" },
    { title: "Multi-Domain SNI", sub: "Resolving site-beta.com on same IP (192.168.1.50) without port conflicts" },
    { title: "403 Permission Triage", sub: "Detecting root:root 700 directory trap; applying chown www-data:www-data" },
    { title: "Production Hardened", sub: "apache2ctl configtest Syntax OK; ServerTokens Prod, indexes disabled" },
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
      setActiveHost("site1");
      setPermissionState("755 www-data");
      setSyntaxVerified(true);
    } else if (idx === 1) {
      setActiveHost("site2");
      setPermissionState("755 www-data");
      setSyntaxVerified(true);
    } else if (idx === 2) {
      setActiveHost("site1");
      setPermissionState("403 Forbidden");
      setSyntaxVerified(false);
    } else if (idx === 3) {
      setActiveHost("site2");
      setPermissionState("Hardened");
      setSyntaxVerified(true);
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
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Apache 2.4 VirtualHost Resolution &amp; DocumentRoot Isolation
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px]">
            Ubuntu 20.04/24.04 LTS
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
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">ACTIVE VHOST</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">
              {activeHost === "site1" ? "alpha.nhit.in" : "beta.nhit.in"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">FS PERMISSIONS</div>
            <div className={`text-lg font-bold mt-0.5 ${permissionState === "403 Forbidden" ? "text-red-400" : "text-emerald-400"}`}>
              {permissionState}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">SYNTAX VALIDATION</div>
            <div className="text-lg font-bold text-zinc-200 mt-0.5">
              {syntaxVerified ? "Syntax OK (200)" : "Config Warning"}
            </div>
          </div>
          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest">MPM WORKER THREADS</div>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">64 Active / 400 Max</div>
          </div>
        </div>

        {/* Pipeline Layout */}
        <div className="py-6 px-4 border border-zinc-800/80 rounded-lg bg-black/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* VHost Config 1 */}
            <div className={`p-4 border rounded transition-all ${
              activeHost === "site1" ? "border-amber-500 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-amber-400 font-bold">VHOST 01: ALPHA</span>
                <span className="text-zinc-500">Port 80/443</span>
              </div>
              <div className="font-mono text-xs text-zinc-200">ServerName alpha.nhit.in</div>
              <div className="mt-2 p-2 bg-black/70 rounded text-[10px] font-mono text-zinc-400 border border-zinc-800">
                <div>DocumentRoot /var/www/alpha/html</div>
                <div>CustomLog alpha_access.log</div>
              </div>
            </div>

            {/* Apache Core Daemon Routing Engine */}
            <div className="p-4 border border-zinc-700 bg-zinc-900/60 rounded text-center space-y-2">
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">APACHE 2.4 DAEMON</div>
              <div className="font-display text-xl text-zinc-100">SNI Host Dispatcher</div>
              <p className="text-xs text-zinc-400 font-body">
                Matches HTTP/1.1 `Host:` header to loaded sites in `/etc/apache2/sites-enabled/`.
              </p>
              <div className="inline-block px-3 py-1 bg-emerald-950/60 border border-emerald-800 rounded font-mono text-[10px] text-emerald-400">
                systemd: apache2.service active (running)
              </div>
            </div>

            {/* VHost Config 2 */}
            <div className={`p-4 border rounded transition-all ${
              activeHost === "site2" ? "border-cyan-500 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]" : "border-zinc-800 bg-zinc-950/60"
            }`}>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-cyan-400 font-bold">VHOST 02: BETA</span>
                <span className="text-zinc-500">Port 80/443</span>
              </div>
              <div className="font-mono text-xs text-zinc-200">ServerName beta.nhit.in</div>
              <div className="mt-2 p-2 bg-black/70 rounded text-[10px] font-mono text-zinc-400 border border-zinc-800">
                <div>DocumentRoot /var/www/beta/html</div>
                <div>CustomLog beta_access.log</div>
              </div>
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
