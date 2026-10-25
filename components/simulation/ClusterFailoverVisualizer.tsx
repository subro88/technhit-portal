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
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Server,
  Database,
  ArrowRight,
  Radio,
  Lock,
} from "lucide-react";
import { cyberAudio } from "@/lib/cyber-audio";

interface ClusterFailoverVisualizerProps {
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
    name: "Scene 1: Normal State & Synchronous Replication",
    shortName: "01 NORMAL & SYNC",
    start: 0,
    end: 10,
    statusBadge: "STATE: HEALTHY | RPO = 0 (PROTOCOL C)",
    statusColor: "emerald",
  },
  {
    id: 2,
    name: "Scene 2: Catastrophic Hardware Failure",
    shortName: "02 POWER OUTAGE",
    start: 10,
    end: 18,
    statusBadge: "CRITICAL: HEARTBEAT LOST | SPLIT-BRAIN RISK",
    statusColor: "rose",
  },
  {
    id: 3,
    name: "Scene 3: STONITH Fencing Execution",
    shortName: "03 STONITH FENCING",
    start: 18,
    end: 28,
    statusBadge: "STONITH ARMED: IPMI FENCE LOCK-ON",
    statusColor: "amber",
  },
  {
    id: 4,
    name: "Scene 4: Automated Promotion & VIP Failover",
    shortName: "04 VIP FAILOVER",
    start: 28,
    end: 40,
    statusBadge: "FAILOVER COMPLETE | ZERO DATA LOSS | UPTIME 100%",
    statusColor: "cyan",
  },
];

const TOTAL_DURATION = 40; // 40 seconds

export function ClusterFailoverVisualizer({ onTimelineSync, className = "" }: ClusterFailoverVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // References for animation frame
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const soundEnabledRef = useRef<boolean>(true);
  const speedRef = useRef<number>(1);
  const prevSceneRef = useRef<number>(1);

  // Sync ref values
  currentTimeRef.current = currentTime;
  isPlayingRef.current = isPlaying;
  soundEnabledRef.current = soundEnabled;
  speedRef.current = playbackSpeed;

  // Sound triggers state tracking to avoid repeating sound on every frame
  const soundTriggerFlags = useRef<{ [key: string]: boolean }>({});

  const getCurrentSceneIndex = useCallback((time: number): number => {
    if (time < 10) return 0;
    if (time < 18) return 1;
    if (time < 28) return 2;
    return 3;
  }, []);

  const currentScene = SCENES[getCurrentSceneIndex(currentTime)];

  // Audio start/stop on soundEnabled change
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

  // Jump to specific time / scene
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

    // Particle state buffers
    const particles = {
      heartbeatRings: Array.from({ length: 8 }, (_, i) => ({ offset: i * 0.125 })),
      drbdBlocks: Array.from({ length: 12 }, (_, i) => ({ offset: i * (1 / 12) })),
      clientPackets: Array.from({ length: 10 }, (_, i) => ({ offset: i * 0.1 })),
      lightningSparks: [] as { x: number; y: number; life: number }[],
    };

    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // Advance time if playing
      if (isPlayingRef.current && isVisible) {
        let nextTime = currentTimeRef.current + deltaTime * speedRef.current;
        if (nextTime >= TOTAL_DURATION) {
          nextTime = 0; // Loop
          soundTriggerFlags.current = {};
        }
        currentTimeRef.current = nextTime;
        setCurrentTime(nextTime);

        // Sound triggers per scene events
        const t = nextTime;
        const soundOn = soundEnabledRef.current;

        // Scene 1: Heartbeats
        if (t >= 0 && t < 10) {
          if (Math.floor(t * 3) !== Math.floor((t - deltaTime) * 3)) {
            cyberAudio.playHeartbeat(soundOn);
          }
        }

        // Scene 2: Lightning Strike at 10.0s
        if (t >= 10 && t < 10.3 && !soundTriggerFlags.current["lightning"]) {
          soundTriggerFlags.current["lightning"] = true;
          cyberAudio.playLightningCrash(soundOn);
        }
        if (t >= 11.2 && !soundTriggerFlags.current["alarm"]) {
          soundTriggerFlags.current["alarm"] = true;
          cyberAudio.playWarningAlert(soundOn);
        }

        // Scene 3: STONITH Laser at 18.2s
        if (t >= 18.2 && !soundTriggerFlags.current["laser"]) {
          soundTriggerFlags.current["laser"] = true;
          cyberAudio.playStonithLaser(soundOn);
        }

        // Scene 4: Promotion & Spin up at 28.5s
        if (t >= 28.5 && !soundTriggerFlags.current["spinup"]) {
          soundTriggerFlags.current["spinup"] = true;
          cyberAudio.playServiceSpinUp(soundOn);
        }
        // VIP Docked at 32.5s
        if (t >= 32.5 && !soundTriggerFlags.current["docking"]) {
          soundTriggerFlags.current["docking"] = true;
          cyberAudio.playDockingChime(soundOn);
        }

        // Notify parent if scene changed
        const currentSceneIdx = getCurrentSceneIndex(nextTime);
        if (currentSceneIdx !== prevSceneRef.current) {
          prevSceneRef.current = currentSceneIdx;
          onTimelineSync?.(nextTime, currentSceneIdx);
        }
      }

      // Responsive High-DPI Canvas Resizing
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const t = currentTimeRef.current;

      // ==========================================
      // 1. BACKGROUND & DATACENTER SLATE FLOOR
      // ==========================================
      ctx.fillStyle = "#0b0f19"; // Sleek dark blue slate
      ctx.fillRect(0, 0, width, height);

      // Radial ambient lighting
      const ambientGrd = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.75);
      ambientGrd.addColorStop(0, "rgba(15, 23, 42, 0.7)");
      ambientGrd.addColorStop(1, "rgba(11, 15, 25, 1)");
      ctx.fillStyle = ambientGrd;
      ctx.fillRect(0, 0, width, height);

      // Isometric Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(30, 58, 138, 0.22)"; // Deep blue fiber conduit lines
      const gridSpacing = 42;
      const isoYOffset = height * 0.58;

      for (let x = -width; x < width * 2; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, isoYOffset);
        ctx.lineTo(x + width * 0.5, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, isoYOffset);
        ctx.lineTo(x - width * 0.5, height);
        ctx.stroke();
      }

      // Origin Center Coordinates for Cluster Nodes
      const centerX = width / 2;
      const nodeDistance = Math.min(260, width * 0.28);
      const nodeAY = height * 0.56;
      const nodeBY = height * 0.56;
      const nodeAX = centerX - nodeDistance;
      const nodeBX = centerX + nodeDistance;

      // Cluster State Calculations
      const isScene1 = t < 10;
      const isScene2 = t >= 10 && t < 18;
      const isScene3 = t >= 18 && t < 28;
      const isScene4 = t >= 28;

      // Node A Health (Dies violently at 10.0s, fenced at 18.0s)
      const isNodeAAlive = isScene1;
      const isNodeAFlickering = isScene2 && t < 12.5;
      const isNodeAFenced = isScene3 || isScene4;

      // Node B State (Standby in Scene 1-3, Promoted in Scene 4)
      const isNodeBPromoted = isScene4;

      // ==========================================
      // 2. ISOMETRIC SERVER RACK DRAWING HELPER
      // ==========================================
      const drawServerRack = (
        rx: number,
        ry: number,
        label: string,
        subLabel: string,
        isPrimary: boolean,
        isPowered: boolean,
        alertState: boolean,
        fenced: boolean
      ) => {
        ctx.save();
        ctx.translate(rx, ry);

        const rw = 120;
        const rh = 160;
        const rd = 46; // Isometric depth

        // Ground Drop Shadow
        ctx.beginPath();
        ctx.ellipse(0, rd + 22, rw * 0.85, rd * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = isPowered
          ? isPrimary
            ? "rgba(0, 245, 212, 0.16)"
            : "rgba(16, 185, 129, 0.12)"
          : "rgba(0, 0, 0, 0.6)";
        ctx.fill();

        // Left Face (Shadowed)
        ctx.beginPath();
        ctx.moveTo(-rw / 2, 0);
        ctx.lineTo(-rw / 2, -rh);
        ctx.lineTo(-rw / 2 + rd * 0.5, -rh - rd * 0.5);
        ctx.lineTo(-rw / 2 + rd * 0.5, -rd * 0.5);
        ctx.closePath();
        ctx.fillStyle = isPowered ? "#0f172a" : "#05070c";
        ctx.fill();
        ctx.strokeStyle = "rgba(51, 65, 85, 0.6)";
        ctx.stroke();

        // Right / Front Face (Front Glass Panel)
        ctx.beginPath();
        ctx.rect(-rw / 2, -rh, rw, rh);
        ctx.fillStyle = isPowered ? "rgba(15, 23, 42, 0.95)" : "rgba(8, 12, 20, 0.98)";
        ctx.fill();
        ctx.strokeStyle = alertState
          ? "rgba(239, 68, 68, 0.8)"
          : isPrimary
          ? "rgba(0, 245, 212, 0.8)"
          : isNodeBPromoted
          ? "rgba(16, 185, 129, 0.9)"
          : "rgba(71, 85, 105, 0.8)";
        ctx.lineWidth = alertState || isPrimary || isNodeBPromoted ? 2 : 1;
        ctx.stroke();

        // Top Isometric Face
        ctx.beginPath();
        ctx.moveTo(-rw / 2, -rh);
        ctx.lineTo(-rw / 2 + rd * 0.5, -rh - rd * 0.5);
        ctx.lineTo(rw / 2 + rd * 0.5, -rh - rd * 0.5);
        ctx.lineTo(rw / 2, -rh);
        ctx.closePath();
        ctx.fillStyle = isPowered ? "#1e293b" : "#090d16";
        ctx.fill();
        ctx.strokeStyle = "rgba(71, 85, 105, 0.6)";
        ctx.stroke();

        // Rack Unit Trays (4 Server Blades inside enclosure)
        const bladeCount = 4;
        const bladeHeight = 24;
        const bladeSpacing = 32;

        for (let b = 0; b < bladeCount; b++) {
          const by = -rh + 18 + b * bladeSpacing;

          // Blade chassis background
          ctx.fillStyle = isPowered ? "#020617" : "#030712";
          ctx.fillRect(-rw / 2 + 10, by, rw - 20, bladeHeight);
          ctx.strokeStyle = "rgba(30, 41, 59, 0.8)";
          ctx.strokeRect(-rw / 2 + 10, by, rw - 20, bladeHeight);

          // Ventilation Grilles
          ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
          for (let g = 0; g < 6; g++) {
            ctx.fillRect(-rw / 2 + 16 + g * 6, by + 6, 2, bladeHeight - 12);
          }

          // Blinking Activity LEDs
          if (isPowered) {
            const ledColor = alertState
              ? "#ef4444"
              : isPrimary
              ? "#00f5d4"
              : isNodeBPromoted
              ? "#10b981"
              : "#64748b";

            // LED 1 (Power)
            ctx.fillStyle = alertState ? "#ef4444" : "#10b981";
            ctx.beginPath();
            ctx.arc(rw / 2 - 20, by + 8, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // LED 2 (Traffic blink)
            const blink = Math.sin(t * 8 + b * 2) > 0;
            ctx.fillStyle = blink ? ledColor : "rgba(100, 116, 139, 0.3)";
            ctx.beginPath();
            ctx.arc(rw / 2 - 30, by + 8, 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (isNodeAFlickering) {
            // Electrical flicker red
            if (Math.random() > 0.4) {
              ctx.fillStyle = "#ef4444";
              ctx.beginPath();
              ctx.arc(rw / 2 - 20, by + 8, 3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Node Top Badge Tag
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = alertState
          ? "#ef4444"
          : isPrimary
          ? "#00f5d4"
          : isNodeBPromoted
          ? "#10b981"
          : "#94a3b8";
        ctx.fillText(label, 0, -rh - 18);

        ctx.font = "9px monospace";
        ctx.fillStyle = "#64748b";
        ctx.fillText(subLabel, 0, -rh - 6);

        // Fenced / Fencing Overlay
        if (fenced) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
          ctx.fillRect(-rw / 2, -rh, rw, rh);

          ctx.strokeStyle = "#ef4444";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-rw / 2 + 8, -rh + 8, rw - 16, rh - 16);

          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 10px monospace";
          ctx.fillText("⚡ FENCED / ISOLATED", 0, -rh / 2 - 4);
          ctx.font = "8px monospace";
          ctx.fillStyle = "#fca5a5";
          ctx.fillText("STONITH CUTOFF CONFIRMED", 0, -rh / 2 + 10);
        }

        ctx.restore();
      };

      // ==========================================
      // 3. STORAGE CYLINDERS (DRBD DISKS)
      // ==========================================
      const drawStorageCylinder = (cx: number, cy: number, isActive: boolean, isPrimary: boolean, label: string) => {
        ctx.save();
        ctx.translate(cx, cy + 46);

        const r = 38;
        const h = 18;

        // Bottom ellipse
        ctx.beginPath();
        ctx.ellipse(0, h, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? (isPrimary ? "#0f766e" : "#065f46") : "#1e293b";
        ctx.fill();

        // Cylinder Body
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(-r, h);
        ctx.ellipse(0, h, r, r * 0.45, 0, Math.PI, 0, true);
        ctx.lineTo(r, 0);
        ctx.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI, false);
        ctx.fillStyle = isActive
          ? isPrimary
            ? "rgba(13, 148, 136, 0.7)"
            : "rgba(5, 150, 105, 0.7)"
          : "rgba(30, 41, 59, 0.8)";
        ctx.fill();
        ctx.strokeStyle = isActive ? (isPrimary ? "#00f5d4" : "#10b981") : "#475569";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Top Ellipse (Spinning Platter)
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? (isPrimary ? "#14b8a6" : "#10b981") : "#334155";
        ctx.fill();
        ctx.stroke();

        // Spinning Head line if active
        if (isActive) {
          const angle = (t * 6) % (Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * (r * 0.75), Math.sin(angle) * (r * 0.35));
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Disk Label
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = isActive ? "#5eead4" : "#64748b";
        ctx.fillText(label, 0, h + 18);

        ctx.restore();
      };

      // Draw Storage Disks
      const nodeADiskActive = isNodeAAlive;
      const nodeBDiskActive = isNodeBPromoted;
      drawStorageCylinder(nodeAX, nodeAY, nodeADiskActive, true, "DRBD /dev/drbd0 (Master)");
      drawStorageCylinder(
        nodeBX,
        nodeBY,
        nodeBDiskActive || isScene1,
        nodeBDiskActive,
        isNodeBPromoted ? "DRBD /dev/drbd0 (PROMOTED)" : "DRBD /dev/drbd0 (Standby)"
      );

      // ==========================================
      // 4. DRBD REPLICATION LINK & DATA BLOCKS
      // ==========================================
      const drbdLinkY = nodeAY + 46;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(nodeAX + 42, drbdLinkY);
      ctx.lineTo(nodeBX - 42, drbdLinkY);

      if (isScene1) {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Streaming Emerald Block Particles
        particles.drbdBlocks.forEach((block) => {
          const prog = (block.offset + t * 0.4) % 1;
          const px = nodeAX + 42 + prog * (nodeBX - nodeAX - 84);
          ctx.fillStyle = "#10b981";
          ctx.fillRect(px - 4, drbdLinkY - 3, 8, 6);
          ctx.strokeStyle = "#a7f3d0";
          ctx.lineWidth = 1;
          ctx.strokeRect(px - 4, drbdLinkY - 3, 8, 6);
        });

        // Replication Banner Label
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#10b981";
        ctx.fillText("DRBD Synchronous Block Replication (Protocol C)", centerX, drbdLinkY - 10);
      } else {
        // Disconnected Link
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText("DRBD SYNC DISCONNECTED", centerX, drbdLinkY - 8);
      }
      ctx.restore();

      // ==========================================
      // 5. COROSYNC HEARTBEAT PULSES (RING 0 & 1)
      // ==========================================
      const ring0Y = nodeAY - 90;
      const ring1Y = nodeAY - 65;

      const drawHeartbeatConduit = (y: number, label: string, color: string, active: boolean) => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodeAX + 60, y);
        ctx.lineTo(nodeBX - 60, y);

        if (active) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Continuous rhythmic pulse particles
          particles.heartbeatRings.forEach((p) => {
            const pProg = (p.offset + t * 0.6) % 1;
            const px = nodeAX + 60 + pProg * (nodeBX - nodeAX - 120);
            ctx.beginPath();
            ctx.arc(px, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          });
        } else {
          // Flatline Dashed Gray Lines
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.setLineDash([]);

          // Center severed icon
          ctx.fillStyle = "#ef4444";
          ctx.font = "bold 9px monospace";
          ctx.textAlign = "center";
          ctx.fillText("✖", centerX, y + 3);
        }

        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = active ? color : "#64748b";
        ctx.fillText(label, centerX, y - 6);

        ctx.restore();
      };

      const heartbeatsActive = isScene1;
      drawHeartbeatConduit(ring0Y, "Corosync Heartbeat: ring0 (Primary 10.10.10.x)", "#00f5d4", heartbeatsActive);
      drawHeartbeatConduit(ring1Y, "Corosync Heartbeat: ring1 (Redundant 10.20.20.x)", "#38bdf8", heartbeatsActive);

      // ==========================================
      // 6. SCENE 2: LIGHTNING SPARK CRASH ANIMATION
      // ==========================================
      if (isScene2) {
        // Dramatic lightning strike over Node A at t >= 10 && t < 12.5
        if (t < 12.5) {
          const boltProgress = (t - 10) / 2.5;
          ctx.save();
          ctx.strokeStyle = Math.random() > 0.3 ? "#ffffff" : "#f59e0b";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 18;

          // Lightning bolt path from clouds onto Node A PDU
          ctx.beginPath();
          let lx = nodeAX + (Math.random() * 20 - 10);
          let ly = 40;
          ctx.moveTo(lx, ly);

          const segments = 6;
          for (let s = 1; s <= segments; s++) {
            lx += (Math.random() * 30 - 15);
            ly += (nodeAY - 180) / segments;
            ctx.lineTo(lx, ly);
          }
          ctx.lineTo(nodeAX, nodeAY - 160);
          ctx.stroke();

          // Impact Flash Arc
          ctx.beginPath();
          ctx.arc(nodeAX, nodeAY - 160, 28 * Math.sin(boltProgress * Math.PI), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
          ctx.fill();
          ctx.restore();
        }

        // Warning Alert Box over Node B
        ctx.save();
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1.5;
        const alertW = 260;
        const alertH = 34;
        ctx.fillRect(nodeBX - alertW / 2, nodeBY - 240, alertW, alertH);
        ctx.strokeRect(nodeBX - alertW / 2, nodeBY - 240, alertW, alertH);

        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ef4444";
        ctx.fillText("⚠️ HEARTBEAT LOST — SPLIT-BRAIN RISK DETECTED", nodeBX, nodeBY - 222);
        ctx.font = "8px monospace";
        ctx.fillStyle = "#fca5a5";
        ctx.fillText("Pacemaker Corosync: Node A Unreachable | Quorum Standby", nodeBX, nodeBY - 210);
        ctx.restore();
      }

      // ==========================================
      // 7. SCENE 3: STONITH FENCING EXECUTION
      // ==========================================
      if (isScene3) {
        ctx.save();
        // Out-of-band IPMI Pathway from Node B to Node A
        const ipmiY = nodeAY + 105;
        ctx.beginPath();
        ctx.moveTo(nodeBX, nodeBY + 30);
        ctx.lineTo(nodeBX, ipmiY);
        ctx.lineTo(nodeAX, ipmiY);
        ctx.lineTo(nodeAX, nodeAY + 30);

        ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Fencing Command Stream
        const fenceProg = ((t - 18) * 0.8) % 1;
        const fenceX = nodeBX - fenceProg * (nodeBX - nodeAX);
        ctx.fillStyle = "#ea580c";
        ctx.beginPath();
        ctx.arc(fenceX, ipmiY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Laser Lock-On Target Reticle on Node A
        const reticleRadius = 36 - Math.min(18, (t - 18) * 6);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(nodeAX, nodeAY - 80, reticleRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(nodeAX - reticleRadius - 8, nodeAY - 80);
        ctx.lineTo(nodeAX + reticleRadius + 8, nodeAY - 80);
        ctx.moveTo(nodeAX, nodeAY - 80 - reticleRadius - 8);
        ctx.lineTo(nodeAX, nodeAY - 80 + reticleRadius + 8);
        ctx.stroke();

        // STONITH Callout Tag
        ctx.fillStyle = "rgba(239, 68, 68, 0.95)";
        ctx.fillRect(nodeAX - 110, nodeAY - 145, 220, 26);
        ctx.strokeStyle = "#fca5a5";
        ctx.strokeRect(nodeAX - 110, nodeAY - 145, 220, 26);

        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("STONITH: HARD POWER CUT / FENCE", nodeAX, nodeAY - 132);
        ctx.font = "8px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText("fence_ipmilan ▶ Node A PDU Severed", nodeAX, nodeAY - 122);

        ctx.restore();
      }

      // ==========================================
      // 8. SCENE 4: SERVICE SPIN-UP & MYSQL GEAR
      // ==========================================
      if (isScene4) {
        ctx.save();
        // Spinning MySQL Gear on Node B
        const gearX = nodeBX;
        const gearY = nodeBY - 195;
        const gearRadius = 14;
        const gearAngle = t * 4;

        ctx.translate(gearX, gearY);
        ctx.rotate(gearAngle);

        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        for (let g = 0; g < 8; g++) {
          const a = (g * Math.PI) / 4;
          ctx.rect(Math.cos(a) * (gearRadius - 2) - 2, Math.sin(a) * (gearRadius - 2) - 2, 4, 4);
        }
        ctx.arc(0, 0, gearRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, gearRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = "#07090e";
        ctx.fill();

        ctx.restore();

        // MySQL Service Active Label
        ctx.save();
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#10b981";
        ctx.fillText("MySQL 8.0 SERVICE: RUNNING", nodeBX, nodeBY - 170);
        ctx.font = "8px monospace";
        ctx.fillStyle = "#6ee7b7";
        ctx.fillText("Filesystem Mounted: /var/lib/mysql", nodeBX, nodeBY - 158);
        ctx.restore();
      }

      // ==========================================
      // 9. CLIENT TRAFFIC & FLOATING GOLDEN VIRTUAL IP (VIP)
      // ==========================================
      const clientY = 70;
      const clientX = centerX;

      // Draw Client Application Node at Top Center
      ctx.save();
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(clientX - 70, clientY - 26, 140, 32);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(clientX - 70, clientY - 26, 140, 32);

      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#e0f2fe";
      ctx.fillText("CLIENT APP POOL", clientX, clientY - 12);
      ctx.font = "8px monospace";
      ctx.fillStyle = "#7dd3fc";
      ctx.fillText("Zero Query Drops", clientX, clientY - 2);
      ctx.restore();

      // Floating Golden Virtual IP (VIP: 192.168.1.100) Trajectory
      let vipX = nodeAX;
      let vipY = nodeAY - 185;

      if (isScene4) {
        // Glide smoothly from Node A to Node B across t: 28s to 32s
        const glideProgress = Math.min(1, Math.max(0, (t - 28) / 4));
        // Smooth ease-in-out bezier
        const ease =
          glideProgress < 0.5
            ? 2 * glideProgress * glideProgress
            : -1 + (4 - 2 * glideProgress) * glideProgress;

        vipX = nodeAX + ease * (nodeBX - nodeAX);
        vipY = nodeAY - 185 - Math.sin(glideProgress * Math.PI) * 28; // Arched trajectory
      } else if (isScene2 || isScene3) {
        vipX = nodeAX;
        vipY = nodeAY - 185;
      }

      // Draw Floating Golden VIP Orb
      ctx.save();
      // Outer pulsating glow rings
      const pulseR = 14 + Math.sin(t * 6) * 3;
      ctx.beginPath();
      ctx.arc(vipX, vipY, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
      ctx.fill();

      // Core Golden Orb
      ctx.beginPath();
      ctx.arc(vipX, vipY, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 16;
      ctx.fill();

      // VIP Label Tag
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1;
      ctx.fillRect(vipX - 65, vipY - 28, 130, 18);
      ctx.strokeRect(vipX - 65, vipY - 28, 130, 18);

      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = "#fef3c7";
      ctx.fillText("VIP: 192.168.1.100", vipX, vipY - 16);
      ctx.restore();

      // Client traffic conduits (From Client to VIP Orb)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(clientX, clientY + 6);
      ctx.lineTo(vipX, vipY - 28);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Traffic packets along client cable
      if (isScene1 || isScene4) {
        particles.clientPackets.forEach((cp) => {
          const cProg = (cp.offset + t * 0.5) % 1;
          const cx = clientX + cProg * (vipX - clientX);
          const cy = clientY + 6 + cProg * (vipY - 28 - (clientY + 6));
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#fef08a";
          ctx.fill();
        });
      }
      ctx.restore();

      // Server Racks Execution
      drawServerRack(
        nodeAX,
        nodeAY,
        "NODE A (Active Primary)",
        "10.10.10.11",
        isNodeAAlive,
        isNodeAAlive,
        isScene2 && isNodeAFlickering,
        isNodeAFenced
      );

      drawServerRack(
        nodeBX,
        nodeBY,
        isNodeBPromoted ? "NODE B (Active Primary)" : "NODE B (Passive Standby)",
        "10.10.10.12",
        isNodeBPromoted,
        true,
        isScene2,
        false
      );

      // ==========================================
      // 10. SCENE 4 END TITLE BANNER
      // ==========================================
      if (isScene4 && t > 33) {
        const titleAlpha = Math.min(1, (t - 33) / 2);
        ctx.save();
        ctx.fillStyle = `rgba(15, 23, 42, ${0.9 * titleAlpha})`;
        ctx.strokeStyle = `rgba(16, 185, 129, ${titleAlpha})`;
        ctx.lineWidth = 1.5;
        const bannerW = Math.min(560, width * 0.88);
        const bannerH = 52;
        ctx.fillRect(centerX - bannerW / 2, height - 76, bannerW, bannerH);
        ctx.strokeRect(centerX - bannerW / 2, height - 76, bannerW, bannerH);

        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(16, 185, 129, ${titleAlpha})`;
        ctx.fillText("FAILOVER COMPLETE | ZERO DATA LOSS | UNINTERRUPTED UPTIME", centerX, height - 52);

        ctx.font = "10px monospace";
        ctx.fillStyle = `rgba(148, 163, 184, ${titleAlpha})`;
        ctx.fillText("Node B Promoted • DRBD Master • VIP Bound • MySQL Queries Servicing", centerX, height - 36);
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

  // Format seconds to mm:ss.s
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${ms}`;
  };

  return (
    <div
      id="cluster-failover-theater"
      ref={containerRef}
      className={`relative w-full bg-[#0b0f19] border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Top Telemetry Header Ribbon */}
      <div className="px-4 py-2.5 bg-[#07090e]/90 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#00f5d4] animate-pulse" />
            <span className="font-bold text-zinc-100 tracking-wider">
              3D ARCHITECTURE MOTION GRAPHICS // HA FAILOVER DRILL
            </span>
          </div>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-[11px] text-zinc-400">
            Corosync + Pacemaker + DRBD + STONITH
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

          {/* Audio Mute/Unmute Toggle */}
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

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[580px] min-h-[380px] bg-[#0b0f19]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Scene Watermark Overlay in Top Left */}
        <div className="absolute top-4 left-4 pointer-events-none font-mono">
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            ACTIVE MOTION SEQUENCE
          </div>
          <div className="text-sm sm:text-base font-display tracking-wider text-cyan-400 uppercase drop-shadow">
            {currentScene.name}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">
            TIMELINE WINDOW: {currentScene.start}s - {currentScene.end}s
          </div>
        </div>

        {/* Live Coordinates Readout in Top Right */}
        <div className="absolute top-4 right-4 pointer-events-none hidden md:block font-mono text-[10px] text-zinc-500 bg-black/60 px-3 py-1.5 rounded border border-zinc-800 backdrop-blur-sm">
          <div>NODE A VIP: {currentTime < 28 ? "BOUND (Active)" : "UNBOUND"}</div>
          <div>NODE B VIP: {currentTime >= 28 ? "BOUND (Active)" : "STANDBY"}</div>
          <div>DRBD SYNC: {currentTime < 10 ? "CONNECTED (C)" : currentTime >= 28 ? "PRIMARY (R/W)" : "SEVERED"}</div>
        </div>
      </div>

      {/* Interactive Playback Control Bar */}
      <div className="p-3 sm:p-4 bg-[#07090e] border-t border-zinc-800/80 space-y-3">
        {/* Scrubber Track with 4 Scene Partition Markers */}
        <div className="space-y-1.5 font-mono">
          <div className="relative w-full h-3 bg-zinc-900 rounded-sm overflow-hidden cursor-pointer group"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickProg = (e.clientX - rect.left) / rect.width;
                 handleSeek(clickProg * TOTAL_DURATION);
               }}
          >
            {/* Scene Partition Markers */}
            <div className="absolute inset-y-0 left-[25%] w-px bg-zinc-700 z-10" />
            <div className="absolute inset-y-0 left-[45%] w-px bg-zinc-700 z-10" />
            <div className="absolute inset-y-0 left-[70%] w-px bg-zinc-700 z-10" />

            {/* Active Progress Bar */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-[#FF5400] transition-[width] duration-75 relative"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>

          {/* Time stamp indicator */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
            <span className="text-zinc-600">TOTAL RUNTIME: {formatTime(TOTAL_DURATION)}</span>
          </div>
        </div>

        {/* Controls and Scene Navigation Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
          {/* Play/Pause/Restart & Speed */}
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
              title="Restart 40s Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Selector */}
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

          {/* 4 Scene Bookmark Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {SCENES.map((sc, idx) => {
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

export default ClusterFailoverVisualizer;
