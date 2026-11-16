"use client";

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

export function ScalabilityRemotionComposition() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Scene 1: 0 - 300 frames (0s - 10s)
  // Scene 2: 300 - 600 frames (10s - 20s)
  // Scene 3: 600 - 840 frames (20s - 28s)
  // Scene 4: 840 - 1200 frames (28s - 40s)

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#07090e",
        color: "#ffffff",
        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px 64px",
      }}
    >
      {/* Background Tech Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 245, 212, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 212, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          paddingBottom: "18px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              backgroundColor: "#FF5400",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "0.15em",
              color: "#f5f5f5",
            }}
          >
            TECHNHIT<span style={{ color: "#FF5400" }}>//</span>SYSTEM DESIGN
          </span>
          <span
            style={{
              fontSize: "15px",
              backgroundColor: "rgba(0, 245, 212, 0.1)",
              border: "1px solid rgba(0, 245, 212, 0.3)",
              color: "#00f5d4",
              padding: "4px 12px",
              borderRadius: "4px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            ARCHITECTURE MOTION LAB
          </span>
        </div>

        <div
          style={{
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <span>TOPIC: 01 SCALABILITY</span>
          <span style={{ color: "#00f5d4" }}>
            FRAME: {String(frame).padStart(4, "0")} / 1200
          </span>
        </div>
      </div>

      {/* Main Dynamic Stage Scenes */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* SCENE 1: Baseline Single Server & Ingress Surge (Frames 0 - 300) */}
        <Sequence from={0} durationInFrames={300}>
          <Scene1Surge frame={frame} fps={fps} />
        </Sequence>

        {/* SCENE 2: Vertical Scaling (Scale-Up) (Frames 300 - 600) */}
        <Sequence from={300} durationInFrames={300}>
          <Scene2Vertical frame={frame - 300} fps={fps} />
        </Sequence>

        {/* SCENE 3: Single Point of Failure Catastrophe (Frames 600 - 840) */}
        <Sequence from={600} durationInFrames={240}>
          <Scene3Failure frame={frame - 600} fps={fps} />
        </Sequence>

        {/* SCENE 4: Horizontal Scaling (Scale-Out) with Load Balancer (Frames 840 - 1200) */}
        <Sequence from={840} durationInFrames={360}>
          <Scene4Horizontal frame={frame - 840} fps={fps} />
        </Sequence>
      </div>

      {/* Bottom Telemetry HUD */}
      <BottomHud frame={frame} />
    </div>
  );
}

// ── SCENE 1 COMPONENT ────────────────────────────────────────────────────────
function Scene1Surge({ frame, fps }: { frame: number; fps: number }) {
  const loadProgress = interpolate(frame, [30, 240], [18, 99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isCritical = loadProgress > 85;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        width: "100%",
        maxWidth: "900px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: "#00f5d4",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: "8px",
          }}
        >
          SCENE 01 // THE BASELINE ARCHITECTURE
        </div>
        <h1
          style={{
            fontSize: "44px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            margin: 0,
            color: isCritical ? "#ef4444" : "#f1f5f9",
          }}
        >
          SINGLE MONOLITHIC SERVER UNDER SURGE
        </h1>
      </div>

      {/* Server Rack Illustration */}
      <div
        style={{
          width: "480px",
          padding: "28px",
          borderRadius: "16px",
          backgroundColor: "#0d1117",
          border: isCritical
            ? "2px solid #ef4444"
            : "2px solid rgba(0, 245, 212, 0.4)",
          boxShadow: isCritical
            ? "0 0 40px rgba(239, 68, 68, 0.35)"
            : "0 0 30px rgba(0, 245, 212, 0.15)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "12px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#f8fafc" }}>
            Server 01 (Monolith)
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 800,
              backgroundColor: isCritical
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(16, 185, 129, 0.2)",
              color: isCritical ? "#ef4444" : "#10b981",
              border: isCritical
                ? "1px solid #ef4444"
                : "1px solid #10b981",
            }}
          >
            {isCritical ? "CRITICAL LOAD 99%" : "HEALTHY 18%"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <ResourceBox label="CPU CORES" value="4 vCPU" sub="Intel Xeon E3" />
          <ResourceBox label="MEMORY" value="16 GB RAM" sub="DDR4 2666MHz" />
        </div>

        {/* Load Bar */}
        <div style={{ marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>RESOURCE UTILIZATION</span>
            <span
              style={{
                fontWeight: 800,
                color: isCritical ? "#ef4444" : "#00f5d4",
              }}
            >
              {Math.round(loadProgress)}%
            </span>
          </div>
          <div
            style={{
              height: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                backgroundColor: isCritical ? "#ef4444" : "#00f5d4",
                boxShadow: isCritical
                  ? "0 0 15px #ef4444"
                  : "0 0 10px #00f5d4",
                transition: "width 0.1s linear",
              }}
            />
          </div>
        </div>

        {isCritical && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              color: "#fca5a5",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            WARNING: TCP SYN BACKLOG EXHAUSTED · 504 TIMEOUT RISK
          </div>
        )}
      </div>
    </div>
  );
}

// ── SCENE 2 COMPONENT ────────────────────────────────────────────────────────
function Scene2Vertical({ frame, fps }: { frame: number; fps: number }) {
  const ramScale = interpolate(frame, [20, 100], [16, 64], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cpuScale = interpolate(frame, [20, 100], [4, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const loadProgress = interpolate(frame, [20, 100], [99, 42], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        width: "100%",
        maxWidth: "950px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: "#f59e0b",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: "8px",
          }}
        >
          SCENE 02 // METHOD 01: SCALE-UP
        </div>
        <h1
          style={{
            fontSize: "44px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            margin: 0,
            color: "#f1f5f9",
          }}
        >
          VERTICAL SCALING (BIGGER MACHINE)
        </h1>
      </div>

      <div
        style={{
          width: "540px",
          padding: "32px",
          borderRadius: "16px",
          backgroundColor: "#0d1117",
          border: "2px solid #f59e0b",
          boxShadow: "0 0 35px rgba(245, 158, 11, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "12px",
          }}
        >
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#f8fafc" }}>
            Server 01 (Scale-Up Instance)
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 800,
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              color: "#f59e0b",
              border: "1px solid #f59e0b",
            }}
          >
            UPGRADE ACTIVE
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <ResourceBox
            label="EXPANDED CPU"
            value={`${Math.round(cpuScale)} vCPU`}
            sub="Dual Socket Xeon Gold"
            highlight
          />
          <ResourceBox
            label="STACKED RAM"
            value={`${Math.round(ramScale)} GB RAM`}
            sub="Quad-Channel ECC DDR5"
            highlight
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>NEW UTILIZATION ENVELOPE</span>
            <span style={{ fontWeight: 800, color: "#10b981" }}>
              {Math.round(loadProgress)}% (HEALTHY)
            </span>
          </div>
          <div
            style={{
              height: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: "100%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 10px #10b981",
              }}
            />
          </div>
        </div>

        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            border: "1px dashed rgba(245, 158, 11, 0.4)",
            color: "#fbbf24",
            padding: "12px 18px",
            borderRadius: "8px",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          <strong>Tradeoff:</strong> Machine is significantly more powerful, but hardware costs are exponential and the Single Point of Failure remains 100% unmitigated.
        </div>
      </div>
    </div>
  );
}

// ── SCENE 3 COMPONENT ────────────────────────────────────────────────────────
function Scene3Failure({ frame, fps }: { frame: number; fps: number }) {
  const isFlicker = frame % 6 < 3;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        width: "100%",
        maxWidth: "950px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: "#ef4444",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: "8px",
          }}
        >
          SCENE 03 // THE HARDWARE CEILING & CATASTROPHE
        </div>
        <h1
          style={{
            fontSize: "44px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            margin: 0,
            color: "#ef4444",
          }}
        >
          SINGLE POINT OF FAILURE (SPOF) CRASH
        </h1>
      </div>

      <div
        style={{
          width: "540px",
          padding: "36px",
          borderRadius: "16px",
          backgroundColor: isFlicker ? "#1c0a0a" : "#0d1117",
          border: "2px solid #ef4444",
          boxShadow: "0 0 45px rgba(239, 68, 68, 0.4)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            lineHeight: 1,
            filter: "drop-shadow(0 0 15px #ef4444)",
          }}
        >
          ⚡
        </div>

        <div style={{ fontSize: "26px", fontWeight: 900, color: "#f87171" }}>
          HARDWARE POWER SUPPLY FAULT
        </div>

        <p style={{ color: "#cbd5e1", fontSize: "16px", margin: 0 }}>
          The entire 64 GB / 16 vCPU machine is unpowered. Because all workloads were consolidated into one box, 100% of client traffic is currently failing.
        </p>

        <div
          style={{
            padding: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "15px",
            letterSpacing: "0.05em",
          }}
        >
          OUTAGE: 100% DOWNTIME · RTO = UNKNOWN
        </div>
      </div>
    </div>
  );
}

// ── SCENE 4 COMPONENT ────────────────────────────────────────────────────────
function Scene4Horizontal({ frame, fps }: { frame: number; fps: number }) {
  const isServer2Killed = frame > 180;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        width: "100%",
        maxWidth: "1100px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            color: "#00f5d4",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: "6px",
          }}
        >
          SCENE 04 // METHOD 02: SCALE-OUT WITH LOAD BALANCER
        </div>
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 900,
            letterSpacing: "0.05em",
            margin: 0,
            color: "#f1f5f9",
          }}
        >
          HORIZONTAL SCALING & FAULT-TOLERANT CLUSTER
        </h1>
      </div>

      {/* Top Load Balancer Box */}
      <div
        style={{
          width: "360px",
          padding: "16px 24px",
          borderRadius: "12px",
          backgroundColor: "#161b22",
          border: "2px solid #a855f7",
          boxShadow: "0 0 25px rgba(168, 85, 247, 0.3)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "16px", fontWeight: 800, color: "#f8fafc" }}>
            HAProxy L7 Load Balancer
          </div>
          <div style={{ fontSize: "12px", color: "#c084fc" }}>
            VIP: 192.168.10.100 (Round Robin)
          </div>
        </div>
        <span
          style={{
            fontSize: "11px",
            padding: "3px 8px",
            borderRadius: "4px",
            backgroundColor: "rgba(168, 85, 247, 0.2)",
            color: "#c084fc",
            fontWeight: 700,
          }}
        >
          ACTIVE
        </span>
      </div>

      {/* Grid of 4 Worker Nodes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          width: "100%",
        }}
      >
        <ClusterNode
          id="Node 01"
          ip="192.168.10.101"
          status="ONLINE"
          load="32%"
          color="#10b981"
        />
        <ClusterNode
          id="Node 02"
          ip="192.168.10.102"
          status={isServer2Killed ? "OFFLINE (DRAINED)" : "ONLINE"}
          load={isServer2Killed ? "0%" : "34%"}
          color={isServer2Killed ? "#ef4444" : "#10b981"}
          isKilled={isServer2Killed}
        />
        <ClusterNode
          id="Node 03"
          ip="192.168.10.103"
          status="ONLINE"
          load={isServer2Killed ? "46%" : "31%"}
          color="#10b981"
        />
        <ClusterNode
          id="Node 04"
          ip="192.168.10.104"
          status="ONLINE"
          load={isServer2Killed ? "45%" : "33%"}
          color="#10b981"
        />
      </div>

      {isServer2Killed ? (
        <div
          style={{
            padding: "12px 24px",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid #10b981",
            borderRadius: "8px",
            color: "#34d399",
            fontWeight: 800,
            fontSize: "15px",
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          CHAOS TEST: NODE 02 KILLED · ZERO REQUEST LOSS · TRAFFIC REDIRECTED SEAMLESSLY
        </div>
      ) : (
        <div
          style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.7)",
            letterSpacing: "0.05em",
          }}
        >
          Ingress traffic evenly distributed across 4 commodity instances. N+1 redundancy online.
        </div>
      )}
    </div>
  );
}

function ClusterNode({
  id,
  ip,
  status,
  load,
  color,
  isKilled,
}: {
  id: string;
  ip: string;
  status: string;
  load: string;
  color: string;
  isKilled?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "#0d1117",
        border: `1px solid ${color}`,
        borderRadius: "12px",
        padding: "18px",
        boxShadow: `0 0 20px ${color}22`,
        opacity: isKilled ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "16px", color: "#f8fafc" }}>
          {id}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 800,
            color,
            padding: "2px 6px",
            borderRadius: "3px",
            backgroundColor: `${color}18`,
          }}
        >
          {status}
        </span>
      </div>
      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
        {ip}
      </div>
      <div style={{ fontSize: "13px", color: "#cbd5e1" }}>
        LOAD: <strong style={{ color }}>{load}</strong>
      </div>
    </div>
  );
}

function ResourceBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        border: highlight
          ? "1px solid rgba(245, 158, 11, 0.4)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        padding: "12px 14px",
      }}
    >
      <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: 800,
          color: highlight ? "#f59e0b" : "#f1f5f9",
          margin: "4px 0",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}

function BottomHud({ frame }: { frame: number }) {
  const currentSceneName =
    frame < 300
      ? "SCENE 1: BASELINE & INGRESS PEAK"
      : frame < 600
      ? "SCENE 2: VERTICAL SCALE-UP"
      : frame < 840
      ? "SCENE 3: SINGLE POINT OF FAILURE"
      : "SCENE 4: HORIZONTAL LOAD BALANCING";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        paddingTop: "16px",
        fontSize: "13px",
        color: "rgba(255, 255, 255, 0.6)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <span style={{ color: "#00f5d4", fontWeight: 700 }}>
          CURRENT: {currentSceneName}
        </span>
      </div>
      <div style={{ display: "flex", gap: "24px" }}>
        <span>RESOLUTION: 1920x1080 (60 FPS)</span>
        <span>ENGINE: REMOTION 4.0</span>
      </div>
    </div>
  );
}
