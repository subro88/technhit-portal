import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TECHNHIT_THEME } from "./technhitTheme";

interface SceneProps {
  isVertical?: boolean;
}

export const ScalabilityScene04HaproxyConfig: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
  });

  // Node failover trigger at frame 300
  const isFailover = frame > 300;
  const failoverAlert = interpolate(frame, [300, 340], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: TECHNHIT_THEME.colors.bgDark,
        color: TECHNHIT_THEME.colors.textLight,
        fontFamily: TECHNHIT_THEME.fonts.body,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isVertical ? "50px 30px" : "50px 80px",
        boxSizing: "border-box",
      }}
    >
      {/* Background blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 245, 212, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 212, 0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          width: "100%",
          textAlign: isVertical ? "center" : "left",
          zIndex: 10,
          opacity: spr,
          transform: `translateY(${interpolate(spr, [0, 1], [-20, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(189, 0, 255, 0.15)",
            border: `1px solid ${TECHNHIT_THEME.colors.purple}`,
            color: TECHNHIT_THEME.colors.purple,
            fontSize: isVertical ? "13px" : "15px",
            fontFamily: TECHNHIT_THEME.fonts.mono,
            fontWeight: 700,
            padding: "5px 14px",
            borderRadius: "4px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          SRE CONFIGURATION • HAProxy Layer 7 Runbook
        </div>

        <h1
          style={{
            fontSize: isVertical ? "32px" : "48px",
            fontFamily: TECHNHIT_THEME.fonts.headline,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            background: "linear-gradient(90deg, #FFFFFF 0%, #BD00FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Production HAProxy Syntax & Instant Node Failover
        </h1>
        <p
          style={{
            fontSize: isVertical ? "16px" : "20px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Active health checks: `check inter 2000 rise 2 fall 3` prevents cascading traffic drops.
        </p>
      </div>

      {/* Main Terminal Code Window */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: "24px",
          width: "100%",
          maxWidth: "1200px",
          zIndex: 10,
          alignItems: "stretch",
        }}
      >
        {/* Terminal Window */}
        <div
          style={{
            flex: isVertical ? "none" : 1.4,
            backgroundColor: "#05070D",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
          }}
        >
          {/* Terminal Titlebar */}
          <div
            style={{
              backgroundColor: "#0D111E",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#F59E0B" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            </div>
            <span style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontSize: "13px", color: "#94A3B8" }}>
              /etc/haproxy/haproxy.cfg (Production)
            </span>
            <span style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontSize: "12px", color: TECHNHIT_THEME.colors.cyan }}>
              SYNTAX: VALID
            </span>
          </div>

          {/* Code Content */}
          <pre
            style={{
              padding: "18px 24px",
              margin: 0,
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontSize: isVertical ? "12px" : "15px",
              lineHeight: 1.6,
              color: "#E2E8F0",
              overflowX: "hidden",
            }}
          >
            <code>
              <span style={{ color: TECHNHIT_THEME.colors.purple, fontWeight: 700 }}>frontend</span>{" "}
              <span style={{ color: TECHNHIT_THEME.colors.cyan }}>http_in</span>{"\n"}
              {"    "}<span style={{ color: "#94A3B8" }}>bind</span> :80, :443 ssl crt /etc/ssl/technhit.pem{"\n"}
              {"    "}<span style={{ color: "#94A3B8" }}>default_backend</span> cluster_app_nodes{"\n\n"}
              <span style={{ color: TECHNHIT_THEME.colors.purple, fontWeight: 700 }}>backend</span>{" "}
              <span style={{ color: TECHNHIT_THEME.colors.cyan }}>cluster_app_nodes</span>{"\n"}
              {"    "}<span style={{ color: "#94A3B8" }}>balance</span> leastconn{"\n"}
              {"    "}<span style={{ color: "#94A3B8" }}>option</span> httpchk GET /healthz{"\n"}
              {"    "}<span style={{ color: "#94A3B8" }}>server</span> app01 10.0.0.11:8080 check inter 2000 rise 2 fall 3{"\n"}
              <span
                style={{
                  backgroundColor: isFailover ? "rgba(239,68,68,0.25)" : "transparent",
                  color: isFailover ? "#FCA5A5" : "inherit",
                  display: "block",
                  padding: "2px 0",
                  textDecoration: isFailover ? "line-through" : "none",
                }}
              >
                {"    "}server app02 10.0.0.12:8080 check inter 2000 rise 2 fall 3
              </span>
              {"    "}<span style={{ color: "#94A3B8" }}>server</span> app03 10.0.0.13:8080 check inter 2000 rise 2 fall 3{"\n"}
            </code>
          </pre>
        </div>

        {/* Live Failover Telemetry & Status Window */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "space-between",
          }}
        >
          {/* Health Check Parameter Explanation */}
          <div
            style={{
              backgroundColor: TECHNHIT_THEME.colors.bgCard,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              padding: "18px",
            }}
          >
            <div style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontSize: "14px", color: TECHNHIT_THEME.colors.cyan, fontWeight: 700 }}>
              ACTIVE HEALTH CHECK PARAMETERS
            </div>
            <ul
              style={{
                margin: "10px 0 0 0",
                paddingLeft: "20px",
                fontSize: "13px",
                lineHeight: 1.6,
                color: TECHNHIT_THEME.colors.textMuted,
              }}
            >
              <li><strong style={{ color: "#FFFFFF" }}>inter 2000:</strong> Probes /healthz every 2,000ms.</li>
              <li><strong style={{ color: "#FFFFFF" }}>fall 3:</strong> 3 consecutive failures marks node DOWN.</li>
              <li><strong style={{ color: "#FFFFFF" }}>rise 2:</strong> 2 consecutive successes restores node to pool.</li>
            </ul>
          </div>

          {/* Dynamic Failover Status Badge */}
          <div
            style={{
              backgroundColor: isFailover ? "rgba(239, 68, 68, 0.95)" : "rgba(16, 185, 129, 0.2)",
              border: `1px solid ${isFailover ? "#EF4444" : "#10B981"}`,
              borderRadius: "12px",
              padding: "18px",
              color: "#FFFFFF",
              boxShadow: isFailover ? "0 0 30px rgba(239, 68, 68, 0.4)" : "none",
            }}
          >
            <div style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontWeight: 800, fontSize: "14px" }}>
              {isFailover ? "🚨 [ALERT] NODE app02 FAILURE DETECTED" : "✅ CLUSTER HEALTH: ALL BACKENDS NOMINAL"}
            </div>
            <div style={{ fontSize: "13px", marginTop: "6px", opacity: 0.9 }}>
              {isFailover
                ? "HAProxy marked app02 DOWN. 100% of traffic cleanly redistributed to app01 & app03. Dropped packets: 0."
                : "Active traffic distribution across 3 nodes. 0 timeouts reported."}
            </div>
          </div>
        </div>
      </div>

      {/* Narration Subtitle Footer Banner */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "8px",
          padding: "12px 24px",
          textAlign: "center",
          fontFamily: TECHNHIT_THEME.fonts.body,
          fontSize: isVertical ? "16px" : "20px",
          color: "#E2E8F0",
          zIndex: 10,
        }}
      >
        <span style={{ color: TECHNHIT_THEME.colors.purple, fontWeight: 700 }}>
          [VOICEOVER]:{" "}
        </span>
        Under the frontend, we bind port 80 and 443. In the backend, we define worker nodes with active health checks. If Node 2 crashes, HAProxy instantly reroutes traffic with zero dropped packets!
      </div>
    </AbsoluteFill>
  );
};
