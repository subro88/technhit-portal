"use client";

import React, { useState } from "react";
import { Player } from "@remotion/player";
import { ScalabilityMasterclass16x9 } from "./ScalabilityMasterclass16x9";
import { ScalabilityShorts9x16 } from "./ScalabilityShorts9x16";
import { Monitor, Smartphone, Volume2, VolumeX, Sparkles } from "lucide-react";

export function ScalabilityRemotionPlayer() {
  const [format, setFormat] = useState<"16x9" | "9x16">("16x9");
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div className="w-full bg-[#07090e] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 mb-12">
      {/* Top Console Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-800/80 mb-5 gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#00f5d4] animate-pulse shadow-[0_0_12px_#00f5d4]" />
          <div>
            <div className="text-zinc-100 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              REMOTION ENGINE • YOUTUBE MASTERCLASS CINEMA
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                PRO-MASTER
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">
              Anime.js Vector Interpolation • Edge-TTS Prabhat Neural Voiceover • 60 FPS Spring Physics
            </div>
          </div>
        </div>

        {/* Format & Audio Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-1 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFormat("16x9")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                format === "16x9"
                  ? "bg-[#00f5d4] text-[#07090e] shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              16:9 Explainer (128s)
            </button>
            <button
              type="button"
              onClick={() => setFormat("9x16")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                format === "9x16"
                  ? "bg-[#00f5d4] text-[#07090e] shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              9:16 Shorts (56s)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-lg border transition-all ${
              audioEnabled
                ? "bg-zinc-900 border-zinc-700 text-cyan-400"
                : "bg-red-950/40 border-red-800 text-red-400"
            }`}
            title={audioEnabled ? "Voiceover Audio Active" : "Voiceover Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Player Stage */}
      <div className="w-full flex items-center justify-center bg-[#030508] border border-zinc-800/80 rounded-xl p-2 sm:p-4 shadow-inner min-h-[420px]">
        {format === "16x9" ? (
          <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-800/80 shadow-2xl relative bg-black">
            <Player
              component={ScalabilityMasterclass16x9}
              inputProps={{ enableAudio: audioEnabled }}
              durationInFrames={3840}
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
        ) : (
          <div className="w-full max-w-[380px] aspect-[9/16] rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl relative bg-black">
            <Player
              component={ScalabilityShorts9x16}
              inputProps={{ enableAudio: audioEnabled }}
              durationInFrames={1680}
              compositionWidth={1080}
              compositionHeight={1920}
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
        )}
      </div>

      {/* Info & Render Action Ticker */}
      <div className="mt-4 pt-3 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-zinc-400 gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {format === "16x9"
              ? "Widescreen YouTube Masterclass: 6 Sequenced Scenes · 3,840 Frames · HAProxy Failover Simulation"
              : "Vertical YouTube Shorts: 4 Kinetic Segments · 1,680 Frames · Mobile Optimized Stack"}
          </span>
        </div>
        <div className="text-[11px] text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/50">
          CLI: <code>npm run {format === "16x9" ? "build:scalability:16x9" : "build:scalability:9x16"}</code>
        </div>
      </div>
    </div>
  );
}

export default ScalabilityRemotionPlayer;
