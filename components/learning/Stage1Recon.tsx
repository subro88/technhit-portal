"use client";

import React, { useState } from "react";
import type { ReconCard } from "@/lib/learning-generator";
import { awardOperativeXp, markStageComplete, playHapticSound } from "@/lib/operative-store";
import { RefreshCw, CheckCircle2, ArrowRight, Zap, Eye } from "lucide-react";

import ArchitectureDiagram from "@/components/mdx/ArchitectureDiagram";

interface Stage1ReconProps {
  slug: string;
  cards: ReconCard[];
  architectureDiagram?: {
    type: "reverse-proxy" | "cluster" | "network" | "stem" | "php-fpm" | "kernel-firewall" | "ssh-handshake" | "apache-vhost" | "system-telemetry" | "sshfs-fuse" | "ssh-file-transfer" | "tomcat-servlet" | "lamp-stack" | "root-privilege" | "remote-ide" | "hypervisor-guest" | "media-pipeline";
    title: string;
  };
  onCompleteStage: () => void;
}

export function Stage1Recon({ slug, cards, architectureDiagram, onCompleteStage }: Stage1ReconProps) {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [awardedCards, setAwardedCards] = useState<Record<string, boolean>>({});

  const handleCardClick = (cardId: string) => {
    playHapticSound("flip");
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));

    if (!awardedCards[cardId]) {
      setAwardedCards((prev) => ({ ...prev, [cardId]: true }));
      awardOperativeXp(15, "Concept Recon Card Discovered");
    }
  };

  const flippedCount = Object.keys(awardedCards).length;
  const isAllFlipped = cards.length > 0 && flippedCount >= cards.length;

  const handleAdvance = () => {
    markStageComplete(slug, "recon", 50);
    onCompleteStage();
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Stage Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 01</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            RECONNAISSANCE · WHAT IS IT?
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          DECONSTRUCT THE ESSENTIAL CONCEPTS
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          Flip each architecture card below to reveal its production definition and live implementation context. Every new discovery awards <span className="text-[#FF5400] font-bold">+15 XP</span>.
        </p>
      </div>

      {/* Visual Architectural Flow Diagram (if configured) */}
      {architectureDiagram && (
        <div className="space-y-2">
          <ArchitectureDiagram
            type={architectureDiagram.type}
            title={architectureDiagram.title}
          />
        </div>
      )}

      {/* Mission Status Strip */}
      <div className="border border-zinc-800 bg-[#0d1117] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-[#FF5400] text-black font-bold uppercase text-[10px] tracking-wider">
            DRILL OBJECTIVE
          </span>
          <span className="text-zinc-300">
            Flip all {cards.length} concept cards to calibrate foundational understanding.
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span>PROGRESS:</span>
          <span className="font-bold text-amber-400 text-sm">{flippedCount} / {cards.length}</span>
          <span className="text-zinc-600">({Math.round((flippedCount / cards.length) * 100)}%)</span>
        </div>
      </div>

      {/* 3D Concept Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => {
          const isFlipped = !!flippedCards[card.id];
          const hasAwarded = !!awardedCards[card.id];

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`perspective-1000 min-h-[320px] h-[320px] sm:h-[330px] cursor-pointer group relative transition-all ${
                isFlipped ? "z-30 shadow-[0_0_25px_rgba(255,84,0,0.25)]" : "z-10"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Concept card: ${card.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
            >
              <div
                className={`relative w-full h-full duration-500 preserve-3d transition-transform ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Face */}
                <div className="absolute inset-0 backface-hidden bg-[#0d1117] border border-zinc-800 group-hover:border-amber-500/70 p-5 sm:p-6 flex flex-col justify-between transition-colors shadow-lg notch-corner overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 mb-3">
                      <span className="text-[#FF5400] tracking-widest font-bold">
                        {String(idx + 1).padStart(2, "0")} / {card.tag}
                      </span>
                      {hasAwarded ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>+15 XP</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-500/80 text-[10px]">
                          <Zap className="w-3.5 h-3.5" />
                          <span>15 XP POOL</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl text-zinc-100 leading-tight group-hover:text-amber-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-zinc-500 text-xs font-mono mt-2 tracking-wide">
                      {card.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs text-zinc-400 border-t border-zinc-800/80 pt-3 group-hover:text-amber-400 transition-colors">
                    <span className="tracking-widest uppercase text-[10px]">TAP TO DECODE</span>
                    <RefreshCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
                  </div>
                </div>

                {/* Back Face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-zinc-950 border border-amber-500/80 p-5 flex flex-col justify-between shadow-2xl notch-corner overflow-hidden">
                  <div className="space-y-2.5 overflow-y-auto slim-scroll max-h-[220px]">
                    <div className="flex items-center justify-between font-mono text-[10px] text-amber-400 tracking-widest border-b border-zinc-800 pb-2">
                      <span>{card.tag} SPECIFICATION</span>
                      <span className="text-emerald-400 font-bold">DECODED</span>
                    </div>
                    <p className="text-zinc-200 text-xs font-body leading-relaxed">
                      {card.definition}
                    </p>
                    <div className="bg-[#0d1117] border border-zinc-800 p-2.5 rounded-sm">
                      <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                        SEEN IN PRODUCTION
                      </div>
                      <p className="text-zinc-300 text-[11px] font-mono leading-tight">
                        {card.seenInProd}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 border-t border-zinc-800 pt-2.5 mt-2 shrink-0">
                    <span className="tracking-widest uppercase">CLICK TO FLIP BACK</span>
                    <RefreshCw className="w-3 h-3 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advance Banner */}
      {isAllFlipped && (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slideUp">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 font-mono text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>RECON STAGE OBJECTIVE COMPLETED (+50 BONUS XP)</span>
            </div>
            <p className="text-zinc-400 text-xs font-mono">
              All concepts have been internalized into your operative telemetry.
            </p>
          </div>

          <button
            onClick={handleAdvance}
            className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-lg tracking-wider px-8 py-3 flex items-center gap-2 transition-colors shrink-0"
          >
            <span>ADVANCE TO STAGE 02: MOTIVE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
}

export default Stage1Recon;
