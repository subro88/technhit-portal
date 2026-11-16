import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ScalabilityScene01Outage } from "./scalability/ScalabilityScene01Outage";
import { ScalabilityScene02VerticalTrap } from "./scalability/ScalabilityScene02VerticalTrap";
import { ScalabilityScene03HorizontalCluster } from "./scalability/ScalabilityScene03HorizontalCluster";
import { ScalabilityScene04HaproxyConfig } from "./scalability/ScalabilityScene04HaproxyConfig";
import { ScalabilityScene05UniversalLaw } from "./scalability/ScalabilityScene05UniversalLaw";
import { ScalabilityScene06TakeawaysCTA } from "./scalability/ScalabilityScene06TakeawaysCTA";

export interface MasterclassProps {
  enableAudio?: boolean;
}

export const ScalabilityMasterclass16x9: React.FC<MasterclassProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090E" }}>
      {/* Top Persistent Header HUD Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "48px",
          backgroundColor: "rgba(11, 15, 25, 0.96)",
          borderBottom: "1px solid rgba(0, 245, 212, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          zIndex: 50,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              backgroundColor: "#00F5D4",
              color: "#07090E",
              fontWeight: 900,
              padding: "2px 8px",
              borderRadius: "3px",
              letterSpacing: "1px",
            }}
          >
            TECHNHIT.IN
          </span>
          <span style={{ color: "#E2E8F0", fontWeight: 700 }}>
            SYSTEM DESIGN MASTERCLASS: SCALABILITY & CLUSTERING
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px", color: "#94A3B8" }}>
          <span>LATENCY: P99 &lt; 28MS</span>
          <span>HA-PROXY L7 ROUTING</span>
          <span style={{ color: "#10B981", fontWeight: 800 }}>● 60 FPS MASTER</span>
        </div>
      </div>

      {/* Main 6 Sequenced Scenes Track (Total 3840 frames / 128s @ 30 FPS) */}
      <div style={{ position: "absolute", top: "48px", bottom: 0, left: 0, right: 0 }}>
        {/* Scene 1: 0 - 630 frames (21.0s) */}
        <Sequence from={0} durationInFrames={630} name="Scene 1: 100K Outage">
          <ScalabilityScene01Outage isVertical={false} />
        </Sequence>

        {/* Scene 2: 630 - 1260 frames (21.0s) */}
        <Sequence from={630} durationInFrames={630} name="Scene 2: Vertical Trap">
          <ScalabilityScene02VerticalTrap isVertical={false} />
        </Sequence>

        {/* Scene 3: 1260 - 2010 frames (25.0s) */}
        <Sequence from={1260} durationInFrames={750} name="Scene 3: Horizontal Cluster">
          <ScalabilityScene03HorizontalCluster isVertical={false} />
        </Sequence>

        {/* Scene 4: 2010 - 2640 frames (21.0s) */}
        <Sequence from={2010} durationInFrames={640} name="Scene 4: HAProxy Config">
          <ScalabilityScene04HaproxyConfig isVertical={false} />
        </Sequence>

        {/* Scene 5: 2640 - 3300 frames (22.0s) */}
        <Sequence from={2640} durationInFrames={660} name="Scene 5: Universal Scalability Law">
          <ScalabilityScene05UniversalLaw isVertical={false} />
        </Sequence>

        {/* Scene 6: 3300 - 3840 frames (18.0s) */}
        <Sequence from={3300} durationInFrames={540} name="Scene 6: SRE Takeaways & CTA">
          <ScalabilityScene06TakeawaysCTA isVertical={false} />
        </Sequence>
      </div>

      {/* Synchronized Master Audio Track */}
      {enableAudio && (
        <Audio src={staticFile("scalability_masterclass_16x9.mp3")} volume={1.0} />
      )}
    </AbsoluteFill>
  );
};
