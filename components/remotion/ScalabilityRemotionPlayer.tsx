"use client";

import React from "react";
import { Player } from "@remotion/player";
import { ScalabilityRemotionComposition } from "./ScalabilityRemotionComposition";

export function ScalabilityRemotionPlayer() {
  return (
    <div className="w-full bg-[#07090e] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-2 sm:p-4">
      <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-800/80 mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-200 font-bold uppercase tracking-wider">
            REMOTION MOTION-GRAPHICS CINEMA · 1080P @ 30FPS
          </span>
        </div>
        <div className="text-zinc-500 text-[11px] hidden sm:block">
          PROGRAMMATIC VIDEO ENGINE (1200 FRAMES)
        </div>
      </div>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-zinc-800 shadow-inner">
        <Player
          component={ScalabilityRemotionComposition}
          durationInFrames={1200}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          controls
          loop
          autoPlay
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default ScalabilityRemotionPlayer;
