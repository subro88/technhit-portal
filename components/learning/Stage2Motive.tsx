"use client";

import React, { useState } from "react";
import type { MotiveBenchmark } from "@/lib/learning-generator";
import { markStageComplete, playHapticSound } from "@/lib/operative-store";
import { Gauge, ArrowRight, CheckCircle2, Wifi, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

interface Stage2MotiveProps {
  slug: string;
  motive: MotiveBenchmark;
  onCompleteStage: () => void;
}

export function Stage2Motive({ slug, motive, onCompleteStage }: Stage2MotiveProps) {
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const currentProfile = motive.networkProfiles[selectedProfileIndex] || motive.networkProfiles[0];

  const handleProfileChange = (index: number) => {
    playHapticSound("click");
    setSelectedProfileIndex(index);
  };

  const handleAdvance = () => {
    markStageComplete(slug, "motive", 50);
    onCompleteStage();
  };

  const timeSavedMs = currentProfile.uncompressedTimeMs - currentProfile.compressedTimeMs;
  const timeSavedPercent = Math.round(
    (timeSavedMs / Math.max(1, currentProfile.uncompressedTimeMs)) * 100
  );

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 02</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            MOTIVE &amp; BENCHMARK · WHY REQUIRED?
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          {motive.headline}
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          {motive.subheadline}
        </p>
      </div>

      {/* Network Profile Selector Buttons */}
      <div className="bg-[#0d1117] border border-zinc-800 p-5 notch-corner space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Wifi className="w-4 h-4 text-amber-500" />
            <span>CALIBRATE CLIENT NETWORK SPECTRUM</span>
          </span>
          <span className="text-zinc-500">RTT &amp; BANDWIDTH PROFILE</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {motive.networkProfiles.map((p, idx) => {
            const isSelected = idx === selectedProfileIndex;
            return (
              <button
                key={p.name}
                onClick={() => handleProfileChange(idx)}
                className={`p-4 border font-mono text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? "border-[#FF5400] bg-zinc-950 shadow-[0_0_15px_rgba(255,84,0,0.25)]"
                    : "border-zinc-800 bg-[#0d1117]/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF5400] clip-notch" />
                )}
                <div className="text-xs font-bold text-zinc-200">{p.name}</div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Speed: {p.speedKbps >= 1000 ? `${p.speedKbps / 1000} Mbps` : `${p.speedKbps} Kbps`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Gauge Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Uncompressed Raw Benchmark */}
        <div className="border border-red-500/30 bg-[#0d1117] p-6 notch-corner space-y-5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-2 text-red-400 font-bold tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>UNCOMPRESSED (IDENTITY)</span>
            </span>
            <span className="text-zinc-500 text-[10px]">RAW PAYLOAD</span>
          </div>

          <div className="space-y-2">
            <div className="font-display text-5xl sm:text-6xl text-zinc-100">
              {(motive.uncompressedBytes / 1024).toFixed(1)} <span className="text-xl text-zinc-500 font-mono">KB</span>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Calculated Wire Size: {motive.uncompressedBytes.toLocaleString()} bytes
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Transfer Latency:</span>
              <span className="text-red-400 font-bold">{currentProfile.uncompressedTimeMs} ms</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Bounce Risk:</span>
              <span className="text-red-400 font-bold">
                {currentProfile.uncompressedTimeMs > 2000 ? "HIGH (40% ABANDONMENT)" : "MODERATE"}
              </span>
            </div>
          </div>
        </div>

        {/* Compressed / Optimized Benchmark */}
        <div className="border border-emerald-500/40 bg-zinc-950 p-6 notch-corner space-y-5 shadow-lg">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>BROTLI OPTIMIZED (LEVEL 5/11)</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
              -{motive.savingsPercentage}% BYTES
            </span>
          </div>

          <div className="space-y-2">
            <div className="font-display text-5xl sm:text-6xl text-emerald-400">
              {(motive.compressedBytes / 1024).toFixed(1)} <span className="text-xl text-zinc-500 font-mono">KB</span>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Compressed Wire Size: {motive.compressedBytes.toLocaleString()} bytes
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Transfer Latency:</span>
              <span className="text-emerald-400 font-bold">{currentProfile.compressedTimeMs} ms</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Latency Reduction:</span>
              <span className="text-amber-400 font-bold">-{timeSavedMs} ms (-{timeSavedPercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="bg-[#0d1117] border-l-2 border-amber-500 p-5 font-mono text-xs text-zinc-300 leading-relaxed space-y-2">
        <div className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          ENGINEERING IMPERATIVE
        </div>
        <p className="text-zinc-400 text-sm font-body">
          {motive.explanation}
        </p>
      </div>

      {/* Advance Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleAdvance}
          className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-lg tracking-wider px-8 py-3.5 flex items-center gap-3 transition-colors"
        >
          <span>CONFIRM ARCHITECTURAL MOTIVE (+50 XP)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default Stage2Motive;
