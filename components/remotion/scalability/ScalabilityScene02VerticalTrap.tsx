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

export const ScalabilityScene02VerticalTrap: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
  });

  const costCounter = Math.round(
    interpolate(frame, [60, 240], [280, 4850], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const spofAlert = interpolate(frame, [360, 420], [0, 1], {
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
        padding: isVertical ? "60px 40px" : "60px 100px",
        boxSizing: "border-box",
      }}
    >
      {/* Background blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245, 158, 11, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 158, 11, 0.05) 1px, transparent 1px)",
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
          transform: `translateY(${interpolate(spr, [0, 1], [-25, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            border: `1px solid ${TECHNHIT_THEME.colors.amber}`,
            color: TECHNHIT_THEME.colors.amber,
            fontSize: isVertical ? "14px" : "16px",
            fontFamily: TECHNHIT_THEME.fonts.mono,
            fontWeight: 700,
            padding: "6px 16px",
            borderRadius: "4px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          ARCHITECTURAL MISCONCEPTION • SCALE-UP
        </div>

        <h1
          style={{
            fontSize: isVertical ? "36px" : "52px",
            fontFamily: TECHNHIT_THEME.fonts.headline,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            background: "linear-gradient(90deg, #FFFFFF 0%, #F59E0B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          The Vertical Scaling Trap: Hardware Ceiling & SPOF
        </h1>
        <p
          style={{
            fontSize: isVertical ? "18px" : "22px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "8px 0 0 0",
          }}
        >
          Throwing bigger hardware creates exponential costs and catastrophic single points of failure.
        </p>
      </div>

      {/* Main Comparison Grid */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? "24px" : "60px",
          width: "100%",
          zIndex: 10,
        }}
      >
        {/* Monster Server Box */}
        <div
          style={{
            width: isVertical ? "100%" : "480px",
            backgroundColor: TECHNHIT_THEME.colors.bgCard,
            border: `2px solid ${TECHNHIT_THEME.colors.amber}`,
            borderRadius: "16px",
            padding: "24px",
            boxSizing: "border-box",
            boxShadow: "0 0 35px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                color: TECHNHIT_THEME.colors.amber,
                fontWeight: 700,
              }}
            >
              UPGRADED: 128-CORE MONSTER
            </span>
            <span
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                color: "#FFFFFF",
                backgroundColor: "rgba(245, 158, 11, 0.3)",
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              ${costCounter} / mo
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                padding: "12px",
                borderRadius: "8px",
                borderLeft: `4px solid ${TECHNHIT_THEME.colors.amber}`,
              }}
            >
              <div style={{ fontSize: "12px", color: TECHNHIT_THEME.colors.textMuted }}>
                CPU SPECIFICATION
              </div>
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                128 vCPU (Dual AMD EPYC 9654)
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                padding: "12px",
                borderRadius: "8px",
                borderLeft: `4px solid ${TECHNHIT_THEME.colors.amber}`,
              }}
            >
              <div style={{ fontSize: "12px", color: TECHNHIT_THEME.colors.textMuted }}>
                MEMORY CAPACITY
              </div>
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                1,024 GB DDR5 ECC Registered
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontSize: "13px",
                  color: "#FCA5A5",
                  fontWeight: 700,
                }}
              >
                ⚠️ HARDWARE CEILING REACHED
              </div>
              <div style={{ fontSize: "12px", color: "#E2E8F0", marginTop: "4px" }}>
                Cannot exceed motherboard socket limits. Next tier requires proprietary supercomputers.
              </div>
            </div>
          </div>
        </div>

        {/* Technical NUMA & SPOF Breakdown */}
        <div
          style={{
            width: isVertical ? "100%" : "480px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* NUMA Bus Penalty Box */}
          <div
            style={{
              backgroundColor: TECHNHIT_THEME.colors.bgCardDarker,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontSize: "14px",
                color: TECHNHIT_THEME.colors.cyan,
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              NUMA BUS CONTENSIION OVERHEAD
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "12px 16px",
                borderRadius: "8px",
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontSize: "13px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#10B981" }}>Socket 0</span>
                <br />
                <span style={{ fontSize: "11px", color: "#94A3B8" }}>30ns Local</span>
              </div>
              <div style={{ color: TECHNHIT_THEME.colors.orange, fontWeight: 800 }}>
                ⇄ UPI Bus ⇄
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#EF4444" }}>Socket 1</span>
                <br />
                <span style={{ fontSize: "11px", color: "#FCA5A5" }}>140ns Remote</span>
              </div>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: TECHNHIT_THEME.colors.textMuted,
                margin: "10px 0 0 0",
              }}
            >
              Cross-socket memory operations incur a 4.6× latency penalty, throttling lock-heavy workloads.
            </p>
          </div>

          {/* SPOF Alert Box */}
          <div
            style={{
              opacity: spofAlert,
              transform: `scale(${interpolate(spofAlert, [0, 1], [0.95, 1])})`,
              backgroundColor: "rgba(239, 68, 68, 0.95)",
              color: "#FFFFFF",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
            }}
          >
            <div
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontWeight: 900,
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              CRITICAL: SINGLE POINT OF FAILURE (SPOF)
            </div>
            <p style={{ margin: "6px 0 0 0", fontSize: "13px", opacity: 0.95 }}>
              If the PSU blows, OS panics, or cloud hypervisor reboots, 100% of your business is DOWN. Zero fault tolerance.
            </p>
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
        <span style={{ color: TECHNHIT_THEME.colors.amber, fontWeight: 700 }}>
          [VOICEOVER]:{" "}
        </span>
        The instinctive reaction is Vertical Scaling. You upgrade to a 128-core monster, but hardware has a hard ceiling, NUMA latency creeps in, and you create a massive $5,000 Single Point of Failure!
      </div>
    </AbsoluteFill>
  );
};
