"use client";

import React, { useEffect, useState } from "react";
import {
  getOperativeState,
  toggleOperativeSound,
  type OperativeState,
  INITIAL_OPERATIVE_STATE,
} from "@/lib/operative-store";
import { Volume2, VolumeX, Award, Shield, CheckCircle2, Zap } from "lucide-react";

interface OperativeHudProps {
  slug: string;
  clearedCount: number;
  totalStages?: number;
  activeStage: number;
  onSelectStage: (stageIndex: number) => void;
}

export function OperativeHud({
  slug,
  clearedCount,
  totalStages = 6,
  activeStage,
  onSelectStage,
}: OperativeHudProps) {
  const [state, setState] = useState<OperativeState>(INITIAL_OPERATIVE_STATE);
  const [showXpFloat, setShowXpFloat] = useState(false);
  const [floatingXp, setFloatingXp] = useState<{ amount: number; reason: string } | null>(null);

  useEffect(() => {
    setState(getOperativeState());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<OperativeState>;
      if (customEvent.detail) {
        setState(customEvent.detail);
        if (customEvent.detail.recentXpReward) {
          setFloatingXp({
            amount: customEvent.detail.recentXpReward.amount,
            reason: customEvent.detail.recentXpReward.reason,
          });
          setShowXpFloat(true);
          const t = setTimeout(() => setShowXpFloat(false), 2000);
          return () => clearTimeout(t);
        }
      }
    };

    window.addEventListener("technhit_operative_update", handleUpdate);
    return () => window.removeEventListener("technhit_operative_update", handleUpdate);
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round(
      ((state.xp - state.currentLevelBaseXp) /
        Math.max(1, state.nextLevelXp - state.currentLevelBaseXp)) *
        100
    )
  );

  const xpRemaining = Math.max(0, state.nextLevelXp - state.xp);

  return (
    <div className="relative z-30 mb-8 font-mono">
      {/* Floating XP Reward Notification */}
      {showXpFloat && floatingXp && (
        <div className="absolute top-[-36px] right-6 flex items-center gap-2 bg-[#FF5400] text-black font-bold text-xs px-3 py-1 rounded shadow-lg animate-xp-float z-50">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>+{floatingXp.amount} XP</span>
          <span className="text-[10px] opacity-80 truncate max-w-[150px]">{floatingXp.reason}</span>
        </div>
      )}

      {/* Main HUD Bar */}
      <div className="hud-glass border border-zinc-800 p-4 sm:p-5 notch-corner flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left: Operative Level & Title */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 bg-[#FF5400] text-black font-display text-3xl font-extrabold flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,84,0,0.35)]">
            {state.level}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">OPERATIVE PROFILE</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-amber-400 font-bold tracking-wide">LVL {state.level}</span>
            </div>
            <div className="font-display text-xl sm:text-2xl text-zinc-100 tracking-wide mt-0.5">
              {state.levelTitle}
            </div>
          </div>
        </div>

        {/* Center: XP Progress Bar */}
        <div className="flex-1 max-w-md space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 uppercase tracking-widest text-[10px]">TOTAL XP</span>
              <span className="text-[#FF5400] font-bold text-sm">{state.xp} XP</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              <span className="text-zinc-300 font-bold">{xpRemaining} XP</span> TO LEVEL {state.level + 1}
            </div>
          </div>

          <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#FF5400] transition-all duration-500 rounded-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Stage Clear Indicators & Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalStages }).map((_, idx) => {
              const isCleared = idx < clearedCount;
              const isCurrent = idx === activeStage;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectStage(idx)}
                  title={`Stage ${idx + 1}`}
                  className={`w-7 h-7 font-display text-xs flex items-center justify-center transition-all ${
                    isCleared
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                      : isCurrent
                      ? "bg-[#FF5400] text-black font-bold shadow-[0_0_10px_rgba(255,84,0,0.5)]"
                      : "bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {isCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-zinc-800 hidden sm:block" />

          {/* Sound Toggle Button */}
          <button
            onClick={() => toggleOperativeSound()}
            className="p-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-900/60"
            title={state.soundEnabled ? "Mute Haptic Audio" : "Enable Haptic Audio"}
            aria-label="Toggle Audio"
          >
            {state.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OperativeHud;
