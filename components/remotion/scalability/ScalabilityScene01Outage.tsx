import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import anime from "animejs";
import { TECHNHIT_THEME } from "./technhitTheme";

interface SceneProps {
  isVertical?: boolean;
}

export const ScalabilityScene01Outage: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const pulseRef = useRef<SVGCircleElement>(null);

  // Entrance spring
  const introSpr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
  });

  // Rapid spike interpolation (0-180 frames: normal, 180-360: spike, 360+: collapse)
  const reqCount = Math.round(
    interpolate(frame, [60, 240, 420], [5000, 48000, 100000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const cpuPct = Math.round(
    interpolate(frame, [90, 260, 420], [18, 74, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const errorOpacity = interpolate(frame, [300, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glitchShake =
    frame > 320
      ? Math.sin(frame * 0.8) * interpolate(frame, [320, 450], [0, 6], { extrapolateRight: "clamp" })
      : 0;

  useEffect(() => {
    if (!pulseRef.current) return;
    const pulseAnim = anime({
      targets: pulseRef.current,
      r: [45, 90],
      opacity: [0.8, 0],
      duration: 800,
      easing: "easeOutQuad",
      autoplay: false,
    });
    pulseAnim.seek(((frame % (fps * 0.8)) / (fps * 0.8)) * 800);
  }, [frame, fps]);

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
        transform: `translate(${glitchShake}px, ${glitchShake * 0.5}px)`,
      }}
    >
      {/* Background Cyber Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 65%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Header Badge & Title */}
      <div
        style={{
          width: "100%",
          textAlign: isVertical ? "center" : "left",
          zIndex: 10,
          opacity: introSpr,
          transform: `translateY(${interpolate(introSpr, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: `1px solid ${TECHNHIT_THEME.colors.red}`,
            color: TECHNHIT_THEME.colors.red,
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
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: TECHNHIT_THEME.colors.red,
              display: "inline-block",
            }}
          />
          INCIDENT DRILL • SRE RUNBOOK SCENARIO 01
        </div>

        <h1
          style={{
            fontSize: isVertical ? "36px" : "54px",
            fontFamily: TECHNHIT_THEME.fonts.headline,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: "-0.5px",
            background:
              frame > 320
                ? "linear-gradient(90deg, #FFFFFF 0%, #EF4444 100%)"
                : "linear-gradient(90deg, #FFFFFF 0%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Black Friday Surge: 100,000 Req/Sec
        </h1>
        <p
          style={{
            fontSize: isVertical ? "18px" : "22px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "8px 0 0 0",
          }}
        >
          Single monolithic application instance overwhelmed under sudden concurrency surge.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? "30px" : "80px",
          width: "100%",
          zIndex: 10,
        }}
      >
        {/* Monolith Server Graphic */}
        <div
          style={{
            position: "relative",
            width: isVertical ? "260px" : "360px",
            height: isVertical ? "300px" : "380px",
            backgroundColor: TECHNHIT_THEME.colors.bgCard,
            border: `2px solid ${frame > 320 ? TECHNHIT_THEME.colors.red : TECHNHIT_THEME.colors.borderCyan}`,
            borderRadius: "16px",
            boxShadow:
              frame > 320
                ? "0 0 45px rgba(239, 68, 68, 0.4), inset 0 0 25px rgba(239, 68, 68, 0.2)"
                : "0 0 30px rgba(0, 245, 212, 0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: "12px",
            }}
          >
            <span
              style={{
                fontFamily: TECHNHIT_THEME.fonts.mono,
                fontSize: "14px",
                color: TECHNHIT_THEME.colors.textMuted,
              }}
            >
              HOST: monolith-prod-01
            </span>
            <span
              style={{
                backgroundColor: frame > 320 ? "#EF4444" : "#10B981",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: "3px",
              }}
            >
              {frame > 320 ? "THERMAL CRITICAL" : "NOMINAL"}
            </span>
          </div>

          {/* SVG Server Blades & Pulse */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle
              ref={pulseRef}
              cx="90"
              cy="90"
              r="45"
              fill="none"
              stroke={frame > 320 ? "#EF4444" : "#00F5D4"}
              strokeWidth="3"
            />
            {/* Server Rack Body */}
            <rect
              x="30"
              y="30"
              width="120"
              height="120"
              rx="10"
              fill="#0F172A"
              stroke={frame > 320 ? "#EF4444" : "#00F5D4"}
              strokeWidth="2"
            />
            {/* Blade Slots */}
            {[48, 68, 88, 108, 128].map((y, i) => (
              <g key={i}>
                <line
                  x1="45"
                  y1={y}
                  x2="135"
                  y2={y}
                  stroke={frame > 320 ? "rgba(239,68,68,0.7)" : "rgba(0,245,212,0.4)"}
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle
                  cx="128"
                  cy={y}
                  r="3"
                  fill={
                    frame > 320
                      ? (frame + i * 5) % 10 > 5
                        ? "#EF4444"
                        : "#7F1D1D"
                      : "#10B981"
                  }
                />
              </g>
            ))}
          </svg>

          {/* Status Bar */}
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontSize: "13px",
              color: frame > 320 ? "#FCA5A5" : TECHNHIT_THEME.colors.cyan,
            }}
          >
            {frame > 320 ? "⚠️ THREAD POOL DEPLETED" : "SOCKET LISTENER ACTIVE"}
          </div>
        </div>

        {/* Live Metrics Telemetry Dashboard */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            width: isVertical ? "100%" : "440px",
          }}
        >
          {/* Ingress Requests Gauge */}
          <div
            style={{
              backgroundColor: TECHNHIT_THEME.colors.bgCardDarker,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "18px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                color: TECHNHIT_THEME.colors.textMuted,
                fontFamily: TECHNHIT_THEME.fonts.mono,
              }}
            >
              <span>INGRESS CONCURRENCY</span>
              <span
                style={{
                  color: reqCount > 60000 ? "#EF4444" : TECHNHIT_THEME.colors.cyan,
                  fontWeight: 800,
                }}
              >
                {reqCount.toLocaleString()} req/sec
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "5px",
                marginTop: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(reqCount / 100000) * 100}%`,
                  backgroundColor: reqCount > 60000 ? "#EF4444" : "#00F5D4",
                  boxShadow:
                    reqCount > 60000 ? "0 0 12px #EF4444" : "0 0 12px #00F5D4",
                }}
              />
            </div>
          </div>

          {/* CPU Saturation Gauge */}
          <div
            style={{
              backgroundColor: TECHNHIT_THEME.colors.bgCardDarker,
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "18px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "14px",
                color: TECHNHIT_THEME.colors.textMuted,
                fontFamily: TECHNHIT_THEME.fonts.mono,
              }}
            >
              <span>CPU UTILIZATION (ALL CORES)</span>
              <span
                style={{
                  color: cpuPct > 85 ? "#EF4444" : "#10B981",
                  fontWeight: 800,
                }}
              >
                {cpuPct}%
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "10px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "5px",
                marginTop: "10px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${cpuPct}%`,
                  backgroundColor: cpuPct > 85 ? "#EF4444" : "#10B981",
                  boxShadow:
                    cpuPct > 85 ? "0 0 12px #EF4444" : "0 0 12px #10B981",
                }}
              />
            </div>
          </div>

          {/* Catastrophic 504 Banner Overlay */}
          <div
            style={{
              opacity: errorOpacity,
              transform: `scale(${interpolate(errorOpacity, [0, 1], [0.92, 1])})`,
              backgroundColor: "rgba(239, 68, 68, 0.95)",
              color: "#FFFFFF",
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 10px 30px rgba(239, 68, 68, 0.5)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                lineHeight: 1,
              }}
            >
              💥
            </div>
            <div>
              <div
                style={{
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                  fontWeight: 900,
                  fontSize: isVertical ? "15px" : "18px",
                  letterSpacing: "1px",
                }}
              >
                HTTP 504 GATEWAY TIMEOUT
              </div>
              <div
                style={{
                  fontSize: isVertical ? "12px" : "13px",
                  opacity: 0.9,
                  marginTop: "3px",
                  fontFamily: TECHNHIT_THEME.fonts.mono,
                }}
              >
                TCP connection queue overflow: dropped 94,210 packets.
              </div>
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
        <span style={{ color: TECHNHIT_THEME.colors.cyan, fontWeight: 700 }}>
          [VOICEOVER]:{" "}
        </span>
        Black Friday at midnight. Your production server is hit with 100,000 requests per second. The CPU pins at 100%, and users get the dreaded 504 Gateway Timeout!
      </div>
    </AbsoluteFill>
  );
};
