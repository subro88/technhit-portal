"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Server,
  Zap,
  CheckCircle2,
  Sliders,
  Film,
  Video,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyber-audio";
import { playHapticSound } from "@/lib/operative-store";

// Dynamically import the Remotion player to avoid SSR issues
const ScalabilityRemotionPlayer = dynamic(
  () => import("@/components/remotion/ScalabilityRemotionPlayer"),
  { ssr: false, loading: () => <div className="h-64 bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">Loading Remotion Video Engine...</div> }
);

interface ScalabilityHybridVisualizerProps {
  onTimelineSync?: (timeSeconds: number, sceneIndex: number) => void;
  externalStep?: number;
  className?: string;
}

interface SceneInfo {
  id: number;
  name: string;
  shortName: string;
  start: number;
  end: number;
  statusBadge: string;
  statusColor: string;
}

const SCENES: SceneInfo[] = [
  {
    id: 1,
    name: "Scene 1: Baseline Monolith & Traffic Spike",
    shortName: "01 SURGE",
    start: 0,
    end: 10,
    statusBadge: "STATE: LOAD SATURATION 99% · 504 TIMEOUT RISK",
    statusColor: "rose",
  },
  {
    id: 2,
    name: "Scene 2: Vertical Scaling (Scale-Up)",
    shortName: "02 SCALE-UP",
    start: 10,
    end: 20,
    statusBadge: "EXPANDED: 16 vCPU / 64GB RAM · NUMA CEILING BOUND",
    statusColor: "amber",
  },
  {
    id: 3,
    name: "Scene 3: Single Point of Failure (SPOF) Crash",
    shortName: "03 SPOF FAULT",
    start: 20,
    end: 28,
    statusBadge: "CRITICAL: POWER/KERNEL PANIC · 100% OUTAGE",
    statusColor: "rose",
  },
  {
    id: 4,
    name: "Scene 4: Horizontal Scaling (Scale-Out) & Failover",
    shortName: "04 SCALE-OUT",
    start: 28,
    end: 40,
    statusBadge: "RECONVERGED: 4 NODES BEHIND HAPROXY · ZERO PACKET LOSS",
    statusColor: "emerald",
  },
];

const TOTAL_DURATION = 40;

export function ScalabilityHybridVisualizer({
  onTimelineSync,
  externalStep,
  className = "",
}: ScalabilityHybridVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Top Tab: Interactive Canvas vs Remotion Video
  const [activeTab, setActiveTab] = useState<"interactive" | "remotion">("interactive");
  // Canvas Sub-mode: Narrative Film vs Interactive Playground
  const [subMode, setSubMode] = useState<"narrative" | "playground">("narrative");

  // Narrative Timeline State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Playground Sandbox State
  const [ingressRps, setIngressRps] = useState<number>(5000);
  const [verticalCpu, setVerticalCpu] = useState<number>(4);
  const [verticalRam, setVerticalRam] = useState<number>(16);
  const [horizontalNodes, setHorizontalNodes] = useState<number>(4);
  const [killedNodeId, setKilledNodeId] = useState<number | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const soundEnabledRef = useRef<boolean>(true);
  const speedRef = useRef<number>(1);
  const soundTriggerFlags = useRef<{ [key: string]: boolean }>({});

  currentTimeRef.current = currentTime;
  isPlayingRef.current = isPlaying;
  soundEnabledRef.current = soundEnabled;
  speedRef.current = playbackSpeed;

  const getCurrentSceneIndex = useCallback((time: number): number => {
    if (time < 10) return 0;
    if (time < 20) return 1;
    if (time < 28) return 2;
    return 3;
  }, []);

  const currentScene = SCENES[getCurrentSceneIndex(currentTime)];

  // Audio background management
  useEffect(() => {
    if (soundEnabled && isPlaying && activeTab === "interactive") {
      cyberAudio.startDatacenterHum(true);
    } else {
      cyberAudio.stopDatacenterHum();
    }
    return () => {
      cyberAudio.stopDatacenterHum();
    };
  }, [soundEnabled, isPlaying, activeTab]);

  // Sync external step from SRE orchestrator
  useEffect(() => {
    if (externalStep !== undefined && subMode === "narrative") {
      if (externalStep <= 1) seekToTime(0);
      else if (externalStep === 2) seekToTime(11);
      else if (externalStep === 3) seekToTime(21);
      else if (externalStep >= 4) seekToTime(29);
    }
  }, [externalStep]);

  const seekToTime = (time: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, time));
    setCurrentTime(clamped);
    currentTimeRef.current = clamped;
    onTimelineSync?.(clamped, getCurrentSceneIndex(clamped));
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    if (activeTab !== "interactive") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particleOffset = 0;

    const render = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const dt = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // Advance timeline in narrative mode
      if (isPlayingRef.current && subMode === "narrative") {
        let nextTime = currentTimeRef.current + dt * speedRef.current;
        if (nextTime >= TOTAL_DURATION) {
          nextTime = 0;
          soundTriggerFlags.current = {};
        }
        currentTimeRef.current = nextTime;
        setCurrentTime(nextTime);
        onTimelineSync?.(nextTime, getCurrentSceneIndex(nextTime));
      }

      particleOffset = (particleOffset + dt * 100) % 1000;

      // Resize canvas to match display DPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayW = Math.floor(rect.width);
      const displayH = Math.floor(rect.height);

      if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayW, displayH);

      // Render Background Grid
      renderGrid(ctx, displayW, displayH);

      // Render Scene based on subMode
      if (subMode === "narrative") {
        renderNarrativeScene(ctx, displayW, displayH, currentTimeRef.current, particleOffset);
      } else {
        renderPlaygroundScene(ctx, displayW, displayH, particleOffset);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
    };
  }, [activeTab, subMode, ingressRps, verticalCpu, verticalRam, horizontalNodes, killedNodeId]);

  // ── RENDER GRID ─────────────────────────────────────────────────────────────
  const renderGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
    ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  // ── RENDER NARRATIVE SCENE ──────────────────────────────────────────────────
  const renderNarrativeScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    time: number,
    pOffset: number
  ) => {
    const sceneIdx = getCurrentSceneIndex(time);

    if (sceneIdx === 0) {
      // SCENE 1: Baseline Single Server & Ingress Surge
      const progress = Math.min(1, Math.max(0, (time - 1) / 8));
      const load = Math.round(18 + progress * 81); // 18% -> 99%
      const isCritical = load > 85;

      // Ingress Packet Stream
      drawPacketStream(ctx, w / 2, 60, w / 2, h / 2 - 80, isCritical ? "#ef4444" : "#00f5d4", pOffset, 4);

      // Ingress Client Badge
      drawBadge(ctx, w / 2, 45, "CLIENT TRAFFIC: 12,500 RPS", isCritical ? "#ef4444" : "#00f5d4");

      // Single Server Rack Box
      drawServerNode(ctx, w / 2 - 130, h / 2 - 70, 260, 160, {
        title: "Server 01 (Monolith)",
        ip: "192.168.10.100",
        cpu: "4 vCPU (Xeon E3)",
        ram: "16 GB DDR4",
        load: `${load}%`,
        isError: isCritical,
        status: isCritical ? "SATURATED 99%" : "ONLINE 18%",
        color: isCritical ? "#ef4444" : "#00f5d4",
      });

      if (isCritical) {
        drawAlertBanner(ctx, w / 2, h - 50, "TCP SYN BACKLOG EXHAUSTED · QUEUE LATENCY 2,850ms · 504 GATEWAY TIMEOUT");
      }
    } else if (sceneIdx === 1) {
      // SCENE 2: Vertical Scaling (Scale-Up)
      const progress = Math.min(1, Math.max(0, (time - 10) / 8));
      const cpu = Math.round(4 + progress * 12); // 4 -> 16
      const ram = Math.round(16 + progress * 48); // 16 -> 64
      const load = Math.round(99 - progress * 57); // 99% -> 42%

      // Ingress Stream
      drawPacketStream(ctx, w / 2, 60, w / 2, h / 2 - 90, "#f59e0b", pOffset, 5);
      drawBadge(ctx, w / 2, 45, "CLIENT TRAFFIC: 25,000 RPS (SCALED-UP)", "#f59e0b");

      // Upgraded Mega-Server
      drawServerNode(ctx, w / 2 - 160, h / 2 - 80, 320, 180, {
        title: "Server 01 (Scaled-Up)",
        ip: "192.168.10.100",
        cpu: `${cpu} vCPU (Dual Socket Xeon)`,
        ram: `${ram} GB ECC DDR5`,
        load: `${load}%`,
        isError: false,
        status: "VERTICAL UPGRADE ACTIVE",
        color: "#f59e0b",
      });

      drawAlertBanner(ctx, w / 2, h - 50, "HARDWARE CEILING: SINGLE SOCKET NUMA BOUNDARY REACHED · 100% SPOF VULNERABILITY");
    } else if (sceneIdx === 2) {
      // SCENE 3: Single Point of Failure Catastrophe
      const isFlicker = Math.floor(time * 8) % 2 === 0;

      // Broken broken packet stream
      drawDashedLink(ctx, w / 2, 60, w / 2, h / 2 - 80, "#ef4444");
      drawBadge(ctx, w / 2, 45, "CLIENT TRAFFIC: 25,000 RPS (DROPPED 100%)", "#ef4444");

      // Dead Server Rack
      drawServerNode(ctx, w / 2 - 160, h / 2 - 80, 320, 180, {
        title: "Server 01 (CRASHED)",
        ip: "192.168.10.100",
        cpu: "OFFLINE / UNPOWERED",
        ram: "OFFLINE",
        load: "N/A",
        isError: true,
        status: isFlicker ? "HARDWARE FAULT" : "KERNEL PANIC",
        color: "#ef4444",
      });

      drawAlertBanner(ctx, w / 2, h - 50, "CATASTROPHIC FAILURE: MOTHERBOARD / PDU FAULT · ZERO REDUNDANCY · 100% OUTAGE");
    } else {
      // SCENE 4: Horizontal Scaling (Scale-Out) & Failover
      const isFailover = time > 34;

      // Ingress to Load Balancer
      drawPacketStream(ctx, w / 2, 50, w / 2, 100, "#a855f7", pOffset, 4);
      drawBadge(ctx, w / 2, 35, "CLIENT TRAFFIC: 50,000 RPS", "#a855f7");

      // HAProxy Box in center top
      drawLoadBalancer(ctx, w / 2 - 140, 95, 280, 55, "HAProxy L7 Ingress Balancer", "VIP: 192.168.10.100");

      // 4 Worker Node Targets
      const nodeW = 160;
      const nodeH = 120;
      const totalW = 4 * nodeW + 3 * 20;
      const startX = (w - totalW) / 2;
      const targetY = h / 2 + 30;

      const nodes = [
        { id: "Node 01", ip: ".101", load: isFailover ? "42%" : "31%", down: false },
        { id: "Node 02", ip: ".102", load: isFailover ? "0%" : "33%", down: isFailover },
        { id: "Node 03", ip: ".103", load: isFailover ? "44%" : "32%", down: false },
        { id: "Node 04", ip: ".104", load: isFailover ? "43%" : "31%", down: false },
      ];

      nodes.forEach((n, idx) => {
        const nx = startX + idx * (nodeW + 20);

        // Branching stream from LB to node
        if (n.down) {
          drawDashedLink(ctx, w / 2, 150, nx + nodeW / 2, targetY, "#ef4444");
        } else {
          drawPacketStream(ctx, w / 2, 150, nx + nodeW / 2, targetY, "#10b981", pOffset + idx * 100, 3);
        }

        drawServerNode(ctx, nx, targetY, nodeW, nodeH, {
          title: n.id,
          ip: n.ip,
          cpu: "2 vCPU",
          ram: "4 GB",
          load: n.load,
          isError: n.down,
          status: n.down ? "DRAINED / DOWN" : "ONLINE",
          color: n.down ? "#ef4444" : "#10b981",
        });
      });

      if (isFailover) {
        drawAlertBanner(ctx, w / 2, h - 45, "CHAOS INJECTION: NODE 02 KILLED · HEALTH CHECK DETECTED · ZERO PACKET LOSS");
      } else {
        drawAlertBanner(ctx, w / 2, h - 45, "HORIZONTAL SCALE-OUT: 4 NODES ACTIVE · ROUND ROBIN MESH · N+1 RESILIENCE");
      }
    }
  };

  // ── RENDER PLAYGROUND SCENE ─────────────────────────────────────────────────
  const renderPlaygroundScene = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    pOffset: number
  ) => {
    // Ingress to Load Balancer
    drawPacketStream(ctx, w / 2, 45, w / 2, 95, "#00f5d4", pOffset, Math.min(8, Math.max(2, ingressRps / 5000)));
    drawBadge(ctx, w / 2, 30, `LIVE TRAFFIC INGRESS: ${ingressRps.toLocaleString()} RPS`, "#00f5d4");

    // Load Balancer
    drawLoadBalancer(ctx, w / 2 - 140, 95, 280, 50, "HAProxy Elastic Distributor", "Dynamic Active Health Checks");

    // Dynamic horizontal nodes
    const nodeCount = horizontalNodes;
    const nodeW = Math.min(180, Math.floor((w - 60 - (nodeCount - 1) * 16) / nodeCount));
    const nodeH = 125;
    const totalW = nodeCount * nodeW + (nodeCount - 1) * 16;
    const startX = (w - totalW) / 2;
    const targetY = h / 2 + 25;

    // Active nodes calculation
    const activeNodes = killedNodeId !== null && killedNodeId < nodeCount ? nodeCount - 1 : nodeCount;
    const rpsPerNode = activeNodes > 0 ? Math.round(ingressRps / activeNodes) : 0;
    const capacityPerNode = verticalCpu * 2500;
    const loadPercent = Math.min(100, Math.round((rpsPerNode / capacityPerNode) * 100));

    for (let i = 0; i < nodeCount; i++) {
      const nx = startX + i * (nodeW + 16);
      const isDead = killedNodeId === i;
      const color = isDead ? "#ef4444" : loadPercent > 85 ? "#ef4444" : loadPercent > 65 ? "#f59e0b" : "#10b981";

      if (isDead) {
        drawDashedLink(ctx, w / 2, 145, nx + nodeW / 2, targetY, "#ef4444");
      } else {
        drawPacketStream(ctx, w / 2, 145, nx + nodeW / 2, targetY, color, pOffset + i * 150, 3);
      }

      drawServerNode(ctx, nx, targetY, nodeW, nodeH, {
        title: `Node 0${i + 1}`,
        ip: `192.168.10.${101 + i}`,
        cpu: `${verticalCpu} vCPU`,
        ram: `${verticalRam} GB`,
        load: isDead ? "0%" : `${loadPercent}%`,
        isError: isDead,
        status: isDead ? "OFFLINE (DRAINED)" : `${rpsPerNode.toLocaleString()} RPS`,
        color,
      });
    }

    // Telemetry summary footer
    const isClusterHealthy = activeNodes > 0 && loadPercent < 90;
    drawAlertBanner(
      ctx,
      w / 2,
      h - 40,
      `CLUSTER METRICS: ${activeNodes}/${nodeCount} ONLINE · LOAD: ${loadPercent}% · P99: ${Math.round(15 + loadPercent * 1.5)}ms · ${
        isClusterHealthy ? "HEALTHY" : "CRITICAL OVERLOAD"
      }`
    );
  };

  // ── DRAWING UTILITIES ───────────────────────────────────────────────────────
  const drawPacketStream = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    offset: number,
    speed: number
  ) => {
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Moving glowing particles along the line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const particleCount = Math.max(3, Math.floor(len / 45));

    for (let i = 0; i < particleCount; i++) {
      const t = ((offset * speed * 0.001 + i / particleCount) % 1);
      const px = x1 + dx * t;
      const py = y1 + dy * t;

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawDashedLink = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string
  ) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };

  const drawBadge = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) => {
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    const textW = ctx.measureText(text).width;
    const pad = 12;

    ctx.fillStyle = "#07090e";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - textW / 2 - pad, y - 12, textW + pad * 2, 24, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  };

  const drawLoadBalancer = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    sub: string
  ) => {
    ctx.fillStyle = "#0d1117";
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "rgba(168, 85, 247, 0.25)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.textAlign = "left";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(title, x + 14, y + 20);

    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#c084fc";
    ctx.fillText(sub, x + 14, y + 36);

    // Indicator Dot
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(x + w - 16, y + 24, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawServerNode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    data: {
      title: string;
      ip: string;
      cpu: string;
      ram: string;
      load: string;
      isError: boolean;
      status: string;
      color: string;
    }
  ) => {
    ctx.fillStyle = data.isError ? "#180a0a" : "#0d1117";
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.isError ? 2 : 1.5;
    ctx.shadowColor = `${data.color}33`;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Header title
    ctx.textAlign = "left";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#f8fafc";
    ctx.fillText(data.title, x + 12, y + 20);

    // Status Badge
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    const stW = ctx.measureText(data.status).width;
    ctx.fillStyle = `${data.color}22`;
    ctx.beginPath();
    ctx.roundRect(x + w - stW - 18, y + 10, stW + 10, 16, 3);
    ctx.fill();
    ctx.fillStyle = data.color;
    ctx.fillText(data.status, x + w - stW - 13, y + 21);

    // Specs
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(`IP: ${data.ip}`, x + 12, y + 42);
    ctx.fillText(`CPU: ${data.cpu}`, x + 12, y + 60);
    ctx.fillText(`RAM: ${data.ram}`, x + 12, y + 78);

    // Load gauge bar
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(x + 12, y + 94, w - 24, 8, 3);
    ctx.fill();

    const loadNum = parseInt(data.load) || 0;
    if (loadNum > 0) {
      ctx.fillStyle = data.color;
      ctx.beginPath();
      ctx.roundRect(x + 12, y + 94, ((w - 24) * loadNum) / 100, 8, 3);
      ctx.fill();
    }
  };

  const drawAlertBanner = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    const textW = ctx.measureText(text).width;
    const pad = 16;

    ctx.fillStyle = "rgba(7, 9, 14, 0.95)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - textW / 2 - pad, y - 12, textW + pad * 2, 26, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#07090e] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs ${className}`}
    >
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3.5 bg-zinc-950/90 border-b border-zinc-800 gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-zinc-100 uppercase tracking-wider text-xs sm:text-sm">
            Scalability Architecture Lab · Vertical vs. Horizontal
          </span>
          <span className="hidden md:inline-block px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold">
            USL &amp; HAPROXY L7
          </span>
        </div>

        {/* Primary View Switcher: Interactive Canvas vs Remotion Cinema */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-zinc-800 bg-zinc-900 p-0.5">
            <button
              onClick={() => {
                playHapticSound("click");
                setActiveTab("interactive");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                activeTab === "interactive"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,245,212,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive Engine</span>
            </button>

            <button
              onClick={() => {
                playHapticSound("click");
                setActiveTab("remotion");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                activeTab === "remotion"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-purple-400" />
              <span>Remotion Cinema</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "remotion" ? (
        /* ================= REMOTION VIDEO PLAYER VIEW ================= */
        <div className="p-4 sm:p-6 animate-fadeIn">
          <ScalabilityRemotionPlayer />
        </div>
      ) : (
        /* ================= INTERACTIVE ENGINE VIEW ================= */
        <div className="p-4 sm:p-6 space-y-4">
          {/* Sub-mode Toggle (Narrative vs Playground) & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl">
            {/* Mode selection buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playHapticSound("click");
                  setSubMode("narrative");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                  subMode === "narrative"
                    ? "bg-[#FF5400] text-black font-bold shadow-[0_0_12px_rgba(255,84,0,0.3)]"
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>4-Scene Story</span>
              </button>

              <button
                onClick={() => {
                  playHapticSound("click");
                  setSubMode("playground");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                  subMode === "playground"
                    ? "bg-cyan-400 text-black font-bold shadow-[0_0_12px_rgba(0,245,212,0.3)]"
                    : "text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Sandbox Playground</span>
              </button>
            </div>

            {/* Narrative playback controls */}
            {subMode === "narrative" ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:border-cyan-400 transition"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => seekToTime(0)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition"
                  title="Reset to 00:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition"
                  title={soundEnabled ? "Mute Cyber Audio" : "Enable Cyber Audio"}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                  <span className="text-zinc-200 font-bold">{currentTime.toFixed(1)}s</span>
                  <span>/ {TOTAL_DURATION}s</span>
                </div>
              </div>
            ) : (
              /* Playground quick actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playHapticSound("click");
                    setKilledNodeId(killedNodeId === null ? 1 : null);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                    killedNodeId !== null
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{killedNodeId !== null ? "Recover Node 02" : "Chaos: Kill Node 02"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Canvas Viewport */}
          <div className="relative w-full h-[400px] sm:h-[480px] bg-[#050609] border border-zinc-800 rounded-xl overflow-hidden shadow-inner">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Narrative Scene Bar / Playground Sliders */}
          {subMode === "narrative" ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SCENES.map((sc, idx) => {
                  const isActive = currentScene.id === sc.id;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => seekToTime(sc.start)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isActive
                          ? "bg-zinc-900 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-zinc-300">SCENE 0{idx + 1}</span>
                        <span className="text-zinc-500">{sc.start}s</span>
                      </div>
                      <div className="font-bold truncate text-[11px]">{sc.shortName}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Interactive Sandbox Controls */
            <div className="grid sm:grid-cols-3 gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <div>
                <label className="flex justify-between text-[11px] text-zinc-400 mb-1.5 font-bold">
                  <span>INGRESS TRAFFIC:</span>
                  <span className="text-cyan-400">{ingressRps.toLocaleString()} RPS</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={ingressRps}
                  onChange={(e) => setIngressRps(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-[11px] text-zinc-400 mb-1.5 font-bold">
                  <span>VERTICAL HARDWARE:</span>
                  <span className="text-amber-400">{verticalCpu} vCPU / {verticalRam} GB</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setVerticalCpu(4);
                      setVerticalRam(16);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                      verticalCpu === 4 ? "bg-amber-500/20 text-amber-300 border-amber-500" : "border-zinc-800 text-zinc-400"
                    }`}
                  >
                    4C / 16G
                  </button>
                  <button
                    onClick={() => {
                      setVerticalCpu(16);
                      setVerticalRam(64);
                    }}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                      verticalCpu === 16 ? "bg-amber-500/20 text-amber-300 border-amber-500" : "border-zinc-800 text-zinc-400"
                    }`}
                  >
                    16C / 64G
                  </button>
                </div>
              </div>

              <div>
                <label className="flex justify-between text-[11px] text-zinc-400 mb-1.5 font-bold">
                  <span>HORIZONTAL NODES:</span>
                  <span className="text-emerald-400">{horizontalNodes} NODES (HAPROXY)</span>
                </label>
                <div className="flex gap-2">
                  {[2, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setHorizontalNodes(num)}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border ${
                        horizontalNodes === num ? "bg-emerald-500/20 text-emerald-300 border-emerald-500" : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {num} Nodes
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ScalabilityHybridVisualizer;
