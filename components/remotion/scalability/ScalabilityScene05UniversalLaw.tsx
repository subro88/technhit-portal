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

export const ScalabilityScene05UniversalLaw: React.FC<SceneProps> = ({
  isVertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 90, mass: 0.8 },
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
          THEORETICAL FOUNDATIONS • UNIVERSAL SCALABILITY LAW
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
          Neil Gunther's Law: Why Adding Nodes Can Slow You Down
        </h1>
        <p
          style={{
            fontSize: isVertical ? "16px" : "20px",
            color: TECHNHIT_THEME.colors.textMuted,
            margin: "6px 0 0 0",
          }}
        >
          Contention (σ) caps throughput; Coherency crosstalk (κ) actively destroys performance.
        </p>
      </div>

      {/* Central Formula & Interactive Curve Visualization */}
      <div
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: isVertical ? "20px" : "60px",
          width: "100%",
          maxWidth: "1200px",
          zIndex: 10,
        }}
      >
        {/* KaTeX Style Master Equation Card */}
        <div
          style={{
            flex: 1,
            backgroundColor: TECHNHIT_THEME.colors.bgCardDarker,
            border: `2px solid ${TECHNHIT_THEME.colors.borderCyan}`,
            borderRadius: "16px",
            padding: "24px 32px",
            boxShadow: "0 0 40px rgba(0, 245, 212, 0.15)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontSize: "14px",
              color: TECHNHIT_THEME.colors.textMuted,
              marginBottom: "14px",
              letterSpacing: "1px",
            }}
          >
            UNIVERSAL SCALABILITY LAW (GUNTHER 1993)
          </div>

          <div
            style={{
              fontFamily: TECHNHIT_THEME.fonts.mono,
              fontSize: isVertical ? "26px" : "38px",
              fontWeight: 800,
              color: "#FFFFFF",
              padding: "16px 20px",
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "inline-block",
            }}
          >
            C(N) = <span style={{ color: TECHNHIT_THEME.colors.cyan }}>N</span> / [ 1 +{" "}
            <span style={{ color: TECHNHIT_THEME.colors.amber }}>σ</span>(N - 1) +{" "}
            <span style={{ color: TECHNHIT_THEME.colors.red }}>κ</span>N(N - 1) ]
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <div style={{ backgroundColor: "rgba(0, 245, 212, 0.08)", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontWeight: 800, color: TECHNHIT_THEME.colors.cyan }}>
                N : Workers
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                Total parallel nodes or CPU threads.
              </div>
            </div>

            <div style={{ backgroundColor: "rgba(245, 158, 11, 0.08)", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontWeight: 800, color: TECHNHIT_THEME.colors.amber }}>
                σ : Contention
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                Serialization queueing (Amdahl's limit).
              </div>
            </div>

            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", padding: "12px", borderRadius: "8px" }}>
              <div style={{ fontFamily: TECHNHIT_THEME.fonts.mono, fontWeight: 800, color: TECHNHIT_THEME.colors.red }}>
                κ : Crosstalk
              </div>
              <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                Coherency delay between nodes: O(N²).
              </div>
            </div>
          </div>
        </div>

        {/* Scalability Curve SVG Visualizer */}
        <div
          style={{
            flex: isVertical ? "none" : 1,
            width: isVertical ? "100%" : "auto",
            backgroundColor: TECHNHIT_THEME.colors.bgCard,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
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
            THROUGHPUT TRAJECTORY COMPARISON
          </div>

          <svg width="100%" height="220" viewBox="0 0 450 220">
            {/* Axis */}
            <line x1="40" y1="190" x2="430" y2="190" stroke="#475569" strokeWidth="2" />
            <line x1="40" y1="20" x2="40" y2="190" stroke="#475569" strokeWidth="2" />

            {/* Labels */}
            <text x="400" y="210" fill="#94A3B8" fontSize="11" fontFamily="monospace">Nodes (N)</text>
            <text x="10" y="25" fill="#94A3B8" fontSize="11" fontFamily="monospace" transform="rotate(-90 10 25)">Capacity</text>

            {/* 1. Ideal Linear Curve */}
            <line x1="40" y1="190" x2="250" y2="30" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
            <text x="255" y="35" fill="#10B981" fontSize="11" fontFamily="monospace">Ideal (Linear)</text>

            {/* 2. Amdahl's Law Curve (Plateau) */}
            <path d="M 40 190 Q 150 90, 420 85" fill="none" stroke="#F59E0B" strokeWidth="3" />
            <text x="330" y="75" fill="#F59E0B" fontSize="11" fontFamily="monospace">Amdahl's (Contention)</text>

            {/* 3. Gunther's USL (Retrograde / Collapse) */}
            <path d="M 40 190 Q 180 80, 270 100 T 420 180" fill="none" stroke="#EF4444" strokeWidth="3.5" />
            <text x="300" y="155" fill="#EF4444" fontSize="11" fontFamily="monospace">USL (Retrograde Dip!)</text>

            {/* Danger Zone marker */}
            <circle cx="370" cy="155" r="5" fill="#EF4444" />
          </svg>

          <div
            style={{
              fontSize: "12px",
              color: TECHNHIT_THEME.colors.textMuted,
              marginTop: "8px",
              fontFamily: TECHNHIT_THEME.fonts.mono,
            }}
          >
            ⚠️ High κ forces retrograde collapse: past 32 nodes, nodes spend more time synchronizing state than serving requests!
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
        According to Universal Scalability Law, throughput is capped by contention sigma and coherency delay kappa. If nodes constantly chat to sync state, more nodes actually degrades performance. Keep nodes strictly stateless!
      </div>
    </AbsoluteFill>
  );
};
