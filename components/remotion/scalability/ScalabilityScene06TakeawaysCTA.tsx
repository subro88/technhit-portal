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

export const ScalabilityScene06TakeawaysCTA: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
  });

  const pillars = [
    { title: "DECOUPLE STATE", desc: "Offload sessions to Redis Cluster; route read queries to DB replicas.", icon: "⚡" },
    { title: "AUTOSCALING TRIGGERS", desc: "Scale out based on P99 latency and queue backlog, not just CPU.", icon: "📈" },
    { title: "FAILOVER RECOVERY", desc: "Enforce active health checks with fast rise/fall thresholds.", icon: "🛡️" },
    { title: "CHAOS DRILLS", desc: "Proactively terminate production nodes weekly to prove resiliency.", icon: "🔥" },
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
      {/* Background blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0, 245, 212, 0.08) 0%, transparent 70%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
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
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: `1px solid ${TECHNHIT_THEME.colors.emerald}`,
            color: TECHNHIT_THEME.colors.emerald,
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
          MASTERCLASS SUMMARY • SRE ACTION PLAN
        </div>

        <h1
          style={{
            fontSize: isVertical ? "32px" : "48px",
            fontFamily: TECHNHIT_THEME.fonts.headline,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            background: "linear-gradient(90deg, #FFFFFF 0%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Build Zero-Downtime Scalable Distributed Systems
        </h1>
        <p
          style={{
            fontSize: isVertical ? "16px" : "20px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Core architectural disciplines to survive peak traffic surges.
        </p>
      </div>

      {/* 4 Pillars Grid & TechNHIT Portal CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          maxWidth: "1150px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isVertical ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          {pillars.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: TECHNHIT_THEME.colors.bgCard,
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ fontSize: "24px" }}>{p.icon}</div>
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontWeight: 800,
                  fontSize: isVertical ? "12px" : "14px",
                  color: TECHNHIT_THEME.colors.cyan,
                }}
              >
                {p.title}
              </div>
              <div
                style={{
                  fontSize: isVertical ? "11px" : "13px",
                  color: TECHNHIT_THEME.colors.textMuted,
                  lineHeight: 1.4,
                }}
              >
                {p.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div
          style={{
            backgroundColor: "rgba(7, 9, 14, 0.95)",
            border: `2px solid ${TECHNHIT_THEME.colors.cyan}`,
            borderRadius: "14px",
            padding: isVertical ? "16px 20px" : "20px 32px",
            display: "flex",
            flexDirection: isVertical ? "column" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 0 40px rgba(0, 245, 212, 0.2)",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: TECHNHIT_THEME.fonts.headline,
                fontWeight: 900,
                fontSize: isVertical ? "20px" : "24px",
                color: "#FFFFFF",
              }}
            >
              Master The Interactive Simulation On TechNHIT
            </div>
            <div
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontSize: isVertical ? "13px" : "15px",
                color: TECHNHIT_THEME.colors.cyan,
                marginTop: "4px",
              }}
            >
              👉 technhit.in/clustering-virtualization
            </div>
          </div>

          <div
            style={{
              backgroundColor: TECHNHIT_THEME.colors.cyan,
              color: "#000000",
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontWeight: 900,
              fontSize: "14px",
              padding: "10px 24px",
              borderRadius: "6px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 0 20px rgba(0, 245, 212, 0.5)",
            }}
          >
            SUBSCRIBE • FULL RUNBOOK
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
        <span style={{ color: TECHNHIT_THEME.colors.emerald, fontWeight: 700 }}>
          [VOICEOVER]:{" "}
        </span>
        Decouple state into Redis and read-replica databases, enforce autoscaling, and practice chaos engineering. Master the interactive simulations on TechNHIT.in and subscribe for more engineering masterclasses!
      </div>
    </AbsoluteFill>
  );
};
