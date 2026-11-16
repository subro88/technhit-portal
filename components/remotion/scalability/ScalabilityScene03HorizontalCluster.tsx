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

export const ScalabilityScene03HorizontalCluster: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
  });

  const nodes = [
    { id: "node-01", ip: "10.0.0.11", status: "HEALTHY", load: "25k req/s" },
    { id: "node-02", ip: "10.0.0.12", status: "HEALTHY", load: "25k req/s" },
    { id: "node-03", ip: "10.0.0.13", status: "HEALTHY", load: "25k req/s" },
    { id: "node-04", ip: "10.0.0.14", status: "HEALTHY", load: "25k req/s" },
  ];

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
      {/* Background Grid */}
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
            backgroundColor: "rgba(0, 245, 212, 0.12)",
            border: `1px solid ${TECHNHIT_THEME.colors.cyan}`,
            color: TECHNHIT_THEME.colors.cyan,
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
          PRODUCTION ARCHITECTURE • HORIZONTAL SCALE-OUT
        </div>

        <h1
          style={{
            fontSize: isVertical ? "32px" : "48px",
            fontFamily: TECHNHIT_THEME.fonts.headline,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            background: "linear-gradient(90deg, #FFFFFF 0%, #00F5D4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Horizontal Scale-Out: Stateless High-Availability Cluster
        </h1>
        <p
          style={{
            fontSize: isVertical ? "16px" : "20px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Distributing load across disposable commodity nodes behind an HAProxy Layer 7 reverse proxy.
        </p>
      </div>

      {/* Architectural Node Flow Diagram */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "1100px",
          zIndex: 10,
          gap: "16px",
        }}
      >
        {/* Top: HAProxy Load Balancer Box */}
        <div
          style={{
            backgroundColor: TECHNHIT_THEME.colors.bgCardDarker,
            border: `2px solid ${TECHNHIT_THEME.colors.cyan}`,
            borderRadius: "12px",
            padding: isVertical ? "12px 20px" : "16px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: isVertical ? "100%" : "680px",
            boxShadow: "0 0 30px rgba(0, 245, 212, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 245, 212, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontWeight: 900,
                color: TECHNHIT_THEME.colors.cyan,
                fontSize: "18px",
              }}
            >
              L7
            </div>
            <div>
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontWeight: 800,
                  fontSize: isVertical ? "16px" : "18px",
                  color: "#FFFFFF",
                }}
              >
                HAProxy Gateway (Active / Passive Pair)
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: TECHNHIT_THEME.colors.textMuted,
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                }}
              >
                Algorithm: Least Connections • Health Check: 2000ms
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontWeight: 800,
              fontSize: "12px",
              padding: "4px 10px",
              borderRadius: "4px",
            }}
          >
            100,000 REQ/S INGEST
          </div>
        </div>

        {/* Animated Traffic Dispersion Connector */}
        <svg
          width={isVertical ? "300" : "800"}
          height="45"
          viewBox={isVertical ? "0 0 300 45" : "0 0 800 45"}
          style={{ overflow: "visible" }}
        >
          {isVertical ? (
            <line x1="150" y1="0" x2="150" y2="45" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
          ) : (
            <>
              <line x1="400" y1="0" x2="400" y2="20" stroke="#00F5D4" strokeWidth="2" />
              <line x1="100" y1="20" x2="700" y2="20" stroke="#00F5D4" strokeWidth="2" />
              <line x1="100" y1="20" x2="100" y2="45" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="300" y1="20" x2="300" y2="45" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="500" y1="20" x2="500" y2="45" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="700" y1="20" x2="700" y2="45" stroke="#00F5D4" strokeWidth="2" strokeDasharray="4 4" />
              {/* Traveling Packet Dots */}
              {[100, 300, 500, 700].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={(frame * 3 + i * 10) % 45}
                  r="4"
                  fill="#00F5D4"
                />
              ))}
            </>
          )}
        </svg>

        {/* Bottom: 4 Stateless Commodity Nodes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isVertical ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: "16px",
            width: "100%",
          }}
        >
          {nodes.map((node, i) => (
            <div
              key={node.id}
              style={{
                backgroundColor: TECHNHIT_THEME.colors.bgCard,
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: TECHNHIT_THEME.fonts.mono,
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#FFFFFF",
                  }}
                >
                  {node.id}
                </span>
                <span
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    color: "#10B981",
                    fontSize: "11px",
                    fontFamily: TECHNHIT_THEME.fonts.mono,
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}
                >
                  {node.status}
                </span>
              </div>

              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontSize: "12px",
                  color: TECHNHIT_THEME.colors.textMuted,
                }}
              >
                IP: {node.ip}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: "8px",
                  fontSize: "13px",
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                }}
              >
                <span style={{ color: TECHNHIT_THEME.colors.textMuted }}>Throughput:</span>
                <span style={{ color: TECHNHIT_THEME.colors.cyan, fontWeight: 700 }}>
                  {node.load}
                </span>
              </div>
            </div>
          ))}
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
        <span style={{ color: TECHNHIT_THEME.colors.cyan, fontWeight: 700 }}>
          [VOICEOVER]:{" "}
        </span>
        The engineering solution is Horizontal Scaling. We distribute load across a cluster of identical, stateless application nodes behind an ultra-fast HAProxy Layer 7 reverse proxy!
      </div>
    </AbsoluteFill>
  );
};
