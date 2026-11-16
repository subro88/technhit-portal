import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ScalabilityScene01Outage } from "./scalability/ScalabilityScene01Outage";
import { ScalabilityScene02VerticalTrap } from "./scalability/ScalabilityScene02VerticalTrap";
import { ScalabilityScene03HorizontalCluster } from "./scalability/ScalabilityScene03HorizontalCluster";
import { ScalabilityScene06TakeawaysCTA } from "./scalability/ScalabilityScene06TakeawaysCTA";

export interface ShortsProps {
  enableAudio?: boolean;
}

export const ScalabilityShorts9x16: React.FC<ShortsProps> = ({
  enableAudio = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07090E" }}>
      {/* Top Mobile Brand Banner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          backgroundColor: "rgba(11, 15, 25, 0.96)",
          borderBottom: "2px solid #00F5D4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
          zIndex: 50,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <span
          style={{
            backgroundColor: "#00F5D4",
            color: "#07090E",
            fontWeight: 900,
            fontSize: "15px",
            padding: "4px 12px",
            borderRadius: "4px",
            letterSpacing: "1px",
          }}
        >
          TECHNHIT.IN
        </span>

        <span
          style={{
            color: "#EF4444",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          ⚠️ SRE CRASH DRILL
        </span>
      </div>

      {/* Main 4 Fast-Paced Vertical Scenes Track (Total 1680 frames / 56s @ 30 FPS) */}
      <div style={{ position: "absolute", top: "64px", bottom: 0, left: 0, right: 0 }}>
        {/* Segment 1: 0 - 300 frames (10.0s) */}
        <Sequence from={0} durationInFrames={300} name="Shorts 1: Crash Hook">
          <ScalabilityScene01Outage isVertical={true} />
        </Sequence>

        {/* Segment 2: 300 - 660 frames (12.0s) */}
        <Sequence from={300} durationInFrames={360} name="Shorts 2: Scale-Up Trap">
          <ScalabilityScene02VerticalTrap isVertical={true} />
        </Sequence>

        {/* Segment 3: 660 - 1140 frames (16.0s) */}
        <Sequence from={660} durationInFrames={480} name="Shorts 3: Scale-Out Cluster">
          <ScalabilityScene03HorizontalCluster isVertical={true} />
        </Sequence>

        {/* Segment 4: 1140 - 1680 frames (18.0s) */}
        <Sequence from={1140} durationInFrames={540} name="Shorts 4: Outro & Law">
          <ScalabilityScene06TakeawaysCTA isVertical={true} />
        </Sequence>
      </div>

      {/* Synchronized Master Audio Track */}
      {enableAudio && (
        <Audio src={staticFile("scalability_shorts_9x16.mp3")} volume={1.0} />
      )}
    </AbsoluteFill>
  );
};
