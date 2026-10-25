"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  WifiOff,
  Radio,
  Cpu,
  Layers,
  HardDrive,
  Activity,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyber-audio";

interface K3sEdgeClusterVisualizerProps {
  onTimelineSync?: (timeSeconds: number, sceneIndex: number) => void;
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
    name: "Scene 1: Normal Edge Telemetry & WireGuard Mesh",
    shortName: "01 NORMAL MESH",
    start: 0,
    end: 10,
    statusBadge: "STATE: HEALTHY | WIREGUARD ENCRYPTED | RAM: 480MB",
    statusColor: "emerald",
  },
  {
    id: 2,
    name: "Scene 2: WAN Network Partition Severed",
    shortName: "02 WAN SEVERED",
    start: 10,
    end: 18,
    statusBadge: "CRITICAL: WAN DROPPED | CLOUD UNREACHABLE",
    statusColor: "rose",
  },
  {
    id: 3,
    name: "Scene 3: Autonomous Edge Survival & Local Spooling",
    shortName: "03 LOCAL SPOOL",
    start: 18,
    end: 28,
    statusBadge: "AUTONOMOUS SURVIVAL | ZERO EVICTION | NVMe BUFFERING",
    statusColor: "amber",
  },
  {
    id: 4,
    name: "Scene 4: Uplink Reconnection & Telemetry Drain",
    shortName: "04 RECONVERGE",
    start: 28,
    end: 40,
    statusBadge: "RECONVERGED | ZERO DATA LOSS | UPTIME 100%",
    statusColor: "cyan",
  },
];

const TOTAL_DURATION = 40;

export function K3sEdgeClusterVisualizer({
  onTimelineSync,
  className = "",
}: K3sEdgeClusterVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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
    if (time < 18) return 1;
    if (time < 28) return 2;
    return 3;
  }, []);

  const currentScene = SCENES[getCurrentSceneIndex(currentTime)];

  useEffect(() => {
    if (soundEnabled && isPlaying) {
      cyberAudio.startDatacenterHum(true);
    } else {
      cyberAudio.stopDatacenterHum();
    }
    return () => {
      cyberAudio.stopDatacenterHum();
    };
  }, [soundEnabled, isPlaying]);

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION, time));
    setCurrentTime(clamped);
    currentTimeRef.current = clamped;
    onTimelineSync?.(clamped, getCurrentSceneIndex(clamped));
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    soundTriggerFlags.current = {};
    handleSeek(0);
    setIsPlaying(true);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (!isVisible) {
        cyberAudio.stopDatacenterHum();
      } else if (soundEnabledRef.current && isPlayingRef.current) {
        cyberAudio.startDatacenterHum(true);
      }
    });
    observer.observe(canvas);

    // Isometric projection helpers
    const toIso = (x: number, y: number, z: number, originX: number, originY: number) => {
      const isoX = originX + (x - y) * Math.cos(Math.PI / 6);
      const isoY = originY + (x + y) * Math.sin(Math.PI / 6) - z;
      return { x: isoX, y: isoY };
    };

    // Draw Isometric Floor Grid
    const drawIsoGrid = (originX: number, originY: number, width: number, height: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 245, 212, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      const range = 18;

      for (let i = -range; i <= range; i++) {
        const p1 = toIso(i * gridSize, -range * gridSize, 0, originX, originY);
        const p2 = toIso(i * gridSize, range * gridSize, 0, originX, originY);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = toIso(-range * gridSize, i * gridSize, 0, originX, originY);
        const p4 = toIso(range * gridSize, i * gridSize, 0, originX, originY);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Draw ARM SBC Micro-Node Enclosure
    const drawSbcNode = (
      cx: number,
      cy: number,
      title: string,
      subtitle: string,
      ip: string,
      role: "master" | "worker1" | "worker2",
      t: number,
      isPartitioned: boolean
    ) => {
      const w = 150;
      const h = 100;
      const boardH = 18;

      ctx.save();

      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + h / 2 + 15, w / 2 + 20, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer PCB Enclosure
      const strokeColor = isPartitioned
        ? "rgba(244, 63, 94, 0.7)"
        : role === "master"
        ? "rgba(0, 245, 212, 0.7)"
        : "rgba(16, 185, 129, 0.7)";
      const bgGrad = ctx.createLinearGradient(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2);
      bgGrad.addColorStop(0, "#0c1322");
      bgGrad.addColorStop(1, "#070b14");

      ctx.fillStyle = bgGrad;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // Top PCB Surface Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - w / 2 + 10, cy - h / 2 + (h / 4) * i);
        ctx.lineTo(cx + w / 2 - 10, cy - h / 2 + (h / 4) * i);
        ctx.stroke();
      }

      // Simulated SoC / CPU Heatsink
      const cpuSize = 34;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = role === "master" ? "#00f5d4" : "#10b981";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx - cpuSize / 2, cy - 10, cpuSize, cpuSize, 4);
      ctx.fill();
      ctx.stroke();

      // CPU Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.textAlign = "center";
      ctx.fillText(role === "master" ? "ARM64" : role === "worker1" ? "BCM2712" : "RK3588", cx, cy + 4);
      ctx.fillText(role === "master" ? "4GB" : role === "worker1" ? "8GB" : "16GB", cx, cy + 14);

      // Blinking GPIO / Activity LEDs
      const ledY = cy - h / 2 + 14;
      const pwrLed = isPartitioned ? (Math.floor(t * 4) % 2 === 0 ? "#f43f5e" : "#881337") : "#10b981";
      const actLed = Math.floor(t * 6) % 2 === 0 ? "#00f5d4" : "rgba(0, 245, 212, 0.2)";

      // Power LED
      ctx.fillStyle = pwrLed;
      ctx.shadowColor = pwrLed;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(cx - w / 2 + 16, ledY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Activity LED
      ctx.fillStyle = actLed;
      ctx.shadowColor = actLed;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(cx - w / 2 + 26, ledY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node Labels & Role
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.fillText(title, cx, cy - h / 2 - 12);

      ctx.font = "9px monospace";
      ctx.fillStyle = isPartitioned ? "#f43f5e" : "#00f5d4";
      ctx.fillText(subtitle, cx, cy - h / 2 - 2);

      ctx.font = "9px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText(ip, cx, cy + h / 2 + 14);

      // Status pill inside node
      const statusPill = isPartitioned ? "AUTONOMOUS (LOCAL)" : "K3S READY";
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = isPartitioned ? "#f43f5e" : "#10b981";
      ctx.fillText(statusPill, cx, cy + h / 2 - 10);

      ctx.restore();
    };

    // Draw Cylindrical Storage / Database
    const drawStorageCylinder = (
      cx: number,
      cy: number,
      label: string,
      sublabel: string,
      t: number,
      fillRatio: number,
      isSpooling: boolean
    ) => {
      const rx = 44;
      const ry = 14;
      const h = 26;

      ctx.save();

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + h + 8, rx + 10, ry + 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body Gradient
      const bodyGrad = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy);
      if (isSpooling) {
        bodyGrad.addColorStop(0, "#78350f");
        bodyGrad.addColorStop(0.5, "#d97706");
        bodyGrad.addColorStop(1, "#451a03");
      } else {
        bodyGrad.addColorStop(0, "#064e3b");
        bodyGrad.addColorStop(0.5, "#10b981");
        bodyGrad.addColorStop(1, "#022c22");
      }

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + h, rx, ry, 0, 0, Math.PI);
      ctx.lineTo(cx - rx, cy);
      ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(cx + rx, cy + h);
      ctx.fill();

      // Top Lid
      ctx.fillStyle = isSpooling ? "#f59e0b" : "#34d399";
      ctx.strokeStyle = isSpooling ? "#fbbf24" : "#6ee7b7";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spinning platter line
      const angle = (t * 2) % (Math.PI * 2);
      const px = cx + Math.cos(angle) * (rx * 0.7);
      const py = cy + Math.sin(angle) * (ry * 0.7);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Disk Label & Buffer gauge
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#e2e8f0";
      ctx.textAlign = "center";
      ctx.fillText(label, cx, cy + h + 24);

      ctx.font = "8px monospace";
      ctx.fillStyle = isSpooling ? "#fbbf24" : "#10b981";
      ctx.fillText(sublabel, cx, cy + h + 35);

      if (fillRatio > 0) {
        // Render buffer fill meter bar
        const barW = 60;
        const barH = 5;
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(cx - barW / 2, cy + h + 42, barW, barH);
        ctx.fillStyle = isSpooling ? "#f59e0b" : "#10b981";
        ctx.fillRect(cx - barW / 2, cy + h + 42, barW * fillRatio, barH);
      }

      ctx.restore();
    };

    // Draw WireGuard Mesh Conduit between two points with pulse particles
    const drawWireGuardConduit = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      label: string,
      t: number,
      isCut: boolean
    ) => {
      ctx.save();

      if (isCut) {
        // Dashed gray link with red cross
        ctx.strokeStyle = "rgba(100, 116, 139, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#f43f5e";
        ctx.textAlign = "center";
        ctx.fillText("✖", midX, midY + 4);

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = "#f43f5e";
        ctx.fillText("DISCONNECTED", midX, midY - 6);
      } else {
        // Glowing cyan WireGuard conduit
        ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.strokeStyle = "#00f5d4";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Animated particles along the conduit
        const particleCount = 4;
        for (let i = 0; i < particleCount; i++) {
          const prog = (t * 0.8 + i / particleCount) % 1;
          const currX = p1.x + (p2.x - p1.x) * prog;
          const currY = p1.y + (p2.y - p1.y) * prog;

          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#00f5d4";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        ctx.font = "bold 8px monospace";
        ctx.fillStyle = "#00f5d4";
        ctx.textAlign = "center";
        ctx.fillText(label, midX, midY - 6);
      }

      ctx.restore();
    };

    // Animation Tick
    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlayingRef.current) {
        let nextTime = currentTimeRef.current + deltaSec * speedRef.current;
        if (nextTime >= TOTAL_DURATION) {
          nextTime = 0;
          soundTriggerFlags.current = {};
        }
        currentTimeRef.current = nextTime;
        setCurrentTime(nextTime);
        onTimelineSync?.(nextTime, getCurrentSceneIndex(nextTime));
      }

      const t = currentTimeRef.current;
      const isPartitioned = t >= 10 && t < 28;

      // Handle sound triggers
      if (soundEnabledRef.current) {
        if (t >= 10.0 && t < 10.2 && !soundTriggerFlags.current["wan_cut"]) {
          cyberAudio.playWarningAlert(true);
          soundTriggerFlags.current["wan_cut"] = true;
        }
        if (t >= 28.0 && t < 28.2 && !soundTriggerFlags.current["reconnect"]) {
          cyberAudio.playDockingChime(true);
          soundTriggerFlags.current["reconnect"] = true;
        }
      }

      // Resize Canvas for High-DPI
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const expectedW = Math.round(rect.width * dpr);
      const expectedH = Math.round(rect.height * dpr);

      if (canvas.width !== expectedW || canvas.height !== expectedH) {
        canvas.width = expectedW;
        canvas.height = expectedH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Clear Slate Background
      ctx.fillStyle = "#0b0f19";
      ctx.fillRect(0, 0, width, height);

      // Draw Floor Grid
      drawIsoGrid(width * 0.48, height * 0.52, width, height);

      // Node Positions
      const nodeMaster = { x: width * 0.22, y: height * 0.5 };
      const nodeWorker1 = { x: width * 0.65, y: height * 0.32 };
      const nodeWorker2 = { x: width * 0.72, y: height * 0.72 };
      const cloudCenter = { x: width * 0.65, y: height * 0.08 };

      // Storage Cylinder Positions
      const sqlitePos = { x: nodeMaster.x, y: nodeMaster.y + 75 };
      const vectorSpoolPos = { x: nodeWorker1.x, y: nodeWorker1.y + 75 };

      // 1. Draw WireGuard Mesh Conduits between ARM Nodes
      drawWireGuardConduit(
        { x: nodeMaster.x + 75, y: nodeMaster.y },
        { x: nodeWorker1.x - 75, y: nodeWorker1.y },
        "flannel-wg: WireGuard Mesh (UDP:51820)",
        t,
        false // Internal edge mesh stays connected!
      );

      drawWireGuardConduit(
        { x: nodeMaster.x + 75, y: nodeMaster.y + 20 },
        { x: nodeWorker2.x - 75, y: nodeWorker2.y },
        "flannel-wg: Peer Mesh (10.42.2.x)",
        t,
        false
      );

      drawWireGuardConduit(
        { x: nodeWorker1.x, y: nodeWorker1.y + 50 },
        { x: nodeWorker2.x - 20, y: nodeWorker2.y - 50 },
        "Cross-Worker Sync",
        t,
        false
      );

      // 2. Draw Upstream WAN Conduit to Cloud
      drawWireGuardConduit(
        { x: nodeWorker1.x, y: nodeWorker1.y - 50 },
        { x: cloudCenter.x, y: cloudCenter.y + 20 },
        "WAN Uplink (VictoriaMetrics TSDB)",
        t,
        isPartitioned
      );

      // 3. Draw Central Cloud Emblem
      ctx.save();
      ctx.fillStyle = isPartitioned ? "rgba(244, 63, 94, 0.15)" : "rgba(0, 245, 212, 0.15)";
      ctx.strokeStyle = isPartitioned ? "#f43f5e" : "#00f5d4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cloudCenter.x - 110, cloudCenter.y - 18, 220, 36, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = isPartitioned ? "#f43f5e" : "#00f5d4";
      ctx.textAlign = "center";
      ctx.fillText(
        isPartitioned ? "☁ CENTRAL CLOUD: UNREACHABLE (PARTITIONED)" : "☁ CENTRAL CLOUD: STREAMING 4.2K EVT/S",
        cloudCenter.x,
        cloudCenter.y + 4
      );
      ctx.restore();

      // 4. Draw Datastores (SQLite under Master & Vector NVMe Spool under Worker 1)
      drawStorageCylinder(
        sqlitePos.x,
        sqlitePos.y,
        "Embedded SQLite (Kine)",
        "state.db (WAL Mode)",
        t,
        0,
        false
      );

      const bufferFill = isPartitioned ? Math.min(1.0, (t - 10) / 18) : t >= 28 ? Math.max(0, 1 - (t - 28) / 8) : 0;
      const spoolLabel = isPartitioned
        ? `SPOOLING: ${(bufferFill * 6.4).toFixed(1)}GB / 10GB`
        : t >= 28 && bufferFill > 0
        ? `DRAINING: ${(bufferFill * 6.4).toFixed(1)}GB -> CLOUD`
        : "BUFFER READY (IDLE)";

      drawStorageCylinder(
        vectorSpoolPos.x,
        vectorSpoolPos.y,
        "Vector NVMe Spool",
        spoolLabel,
        t,
        bufferFill,
        isPartitioned || (t >= 28 && bufferFill > 0)
      );

      // 5. Draw ARM SBC Micro-Nodes
      drawSbcNode(
        nodeMaster.x,
        nodeMaster.y,
        "CONTROL NODE (K3S SERVER)",
        "SQLite + Kine | WireGuard",
        "10.10.10.11",
        "master",
        t,
        false
      );

      drawSbcNode(
        nodeWorker1.x,
        nodeWorker1.y,
        "WORKER 01: RPi 5 (ARM64)",
        "MQTT Broker + Vector Telemetry",
        "10.10.10.12",
        "worker1",
        t,
        isPartitioned
      );

      drawSbcNode(
        nodeWorker2.x,
        nodeWorker2.y,
        "WORKER 02: RK3588 (ARM64)",
        "Edge AI Sensor Inference (NPU)",
        "10.10.10.13",
        "worker2",
        t,
        isPartitioned
      );

      // 6. Partition Alert Overlay if in Scene 2 or 3
      if (isPartitioned) {
        ctx.save();
        const alertX = width * 0.48;
        const alertY = height * 0.22;

        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(alertX - 160, alertY - 20, 320, 44, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#f43f5e";
        ctx.textAlign = "center";
        ctx.fillText("⚠ WAN NETWORK PARTITION DETECTED", alertX, alertY - 4);

        ctx.font = "9px monospace";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("Local containerd pods active | Vector spooling to disk", alertX, alertY + 12);
        ctx.restore();
      }

      // 7. Reconnection Flush Flare in Scene 4
      if (t >= 28 && t < 34) {
        ctx.save();
        const flareX = width * 0.48;
        const flareY = height * 0.22;

        ctx.fillStyle = "rgba(6, 78, 59, 0.9)";
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(flareX - 160, flareY - 20, 320, 44, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#34d399";
        ctx.textAlign = "center";
        ctx.fillText("✓ WAN UPLINK RESTORED — ZERO DATA LOSS", flareX, flareY - 4);

        ctx.font = "9px monospace";
        ctx.fillStyle = "#cbd5e1";
        ctx.fillText("WireGuard re-established | Catchup drain: 18.5k evt/s", flareX, flareY + 12);
        ctx.restore();
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [getCurrentSceneIndex, onTimelineSync]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${ms}`;
  };

  return (
    <div
      id="k3s-edge-theater"
      ref={containerRef}
      className={`relative w-full bg-[#0b0f19] border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Top Header Ribbon */}
      <div className="px-4 py-2.5 bg-[#07090e]/90 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#00f5d4] animate-pulse" />
            <span className="font-bold text-zinc-100 tracking-wider">
              K3S EDGE CLUSTER 3D MOTION GRAPHICS // PARTITION DRILL
            </span>
          </div>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-[11px] text-zinc-400">
            K3s ARM64 + Kine/SQLite + WireGuard + Vector Disk Spool
          </span>
        </div>

        {/* Live Status Overlay Tag */}
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-1.5 ${
              currentScene.statusColor === "emerald"
                ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-300"
                : currentScene.statusColor === "rose"
                ? "bg-rose-950/80 border border-rose-500/60 text-rose-300 animate-pulse"
                : currentScene.statusColor === "amber"
                ? "bg-amber-950/80 border border-amber-500/60 text-amber-300 animate-pulse"
                : "bg-cyan-950/80 border border-cyan-500/60 text-cyan-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span>{currentScene.statusBadge}</span>
          </span>

          <button
            onClick={toggleSound}
            className={`p-1.5 rounded border transition-colors ${
              soundEnabled
                ? "bg-zinc-800 text-cyan-400 border-cyan-500/50 hover:bg-zinc-700"
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
            }`}
            title={soundEnabled ? "Mute Cyber-Audio" : "Enable Cyber-Audio"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[380px] bg-[#0b0f19]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Live Coordinates Readout in Top Right */}
        <div className="absolute top-4 right-4 pointer-events-none hidden md:block font-mono text-[10px] text-zinc-500 bg-black/60 px-3 py-1.5 rounded border border-zinc-800 backdrop-blur-sm">
          <div>DATASTORE: KINE / SQLITE 3.45 (WAL)</div>
          <div>WIREGUARD MESH: flannel-wg (ACTIVE)</div>
          <div>WAN STATUS: {currentTime >= 10 && currentTime < 28 ? "SEVERED (OFFLINE)" : "ONLINE (STREAMING)"}</div>
          <div>POD REPLICATION: 100% (AUTONOMOUS)</div>
        </div>
      </div>

      {/* Interactive Playback Control Bar */}
      <div className="p-3 sm:p-4 bg-[#07090e] border-t border-zinc-800/80 space-y-3">
        {/* Scrubber Track with 4 Scene Partition Markers */}
        <div className="space-y-1.5 font-mono">
          <div
            className="relative w-full h-3 bg-zinc-900 rounded-sm overflow-hidden cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickProg = (e.clientX - rect.left) / rect.width;
              handleSeek(clickProg * TOTAL_DURATION);
            }}
          >
            <div className="absolute inset-y-0 left-[25%] w-px bg-zinc-700 z-10" />
            <div className="absolute inset-y-0 left-[45%] w-px bg-zinc-700 z-10" />
            <div className="absolute inset-y-0 left-[70%] w-px bg-zinc-700 z-10" />

            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 transition-[width] duration-75 relative"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-zinc-600">TOTAL RUNTIME: {formatTime(TOTAL_DURATION)}</span>
          </div>
        </div>

        {/* Controls and Scene Navigation Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="px-3.5 py-1.5 rounded bg-[#00f5d4] hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-[0_0_12px_rgba(0,245,212,0.3)]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
              title="Restart Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex border border-zinc-800 rounded bg-zinc-950 p-0.5 text-[10px]">
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-xs transition-colors ${
                    playbackSpeed === spd
                      ? "bg-zinc-800 text-cyan-300 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {SCENES.map((sc) => {
              const isCurrent = currentScene.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSeek(sc.start)}
                  className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 ${
                    isCurrent
                      ? "border-cyan-500/80 bg-cyan-950/70 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-cyan-400 animate-ping" : "bg-zinc-600"}`} />
                  <span>{sc.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default K3sEdgeClusterVisualizer;
