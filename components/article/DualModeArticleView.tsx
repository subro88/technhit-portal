"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/lib/posts";
import { generateLearningDrill, type LearningDrillData } from "@/lib/learning-generator";
import { getOperativeState, playHapticSound } from "@/lib/operative-store";
import { OperativeHud } from "@/components/learning/OperativeHud";
import { Stage1Recon } from "@/components/learning/Stage1Recon";
import { Stage2Motive } from "@/components/learning/Stage2Motive";
import { Stage3Debate } from "@/components/learning/Stage3Debate";
import { Stage4Simulator } from "@/components/learning/Stage4Simulator";
import { Stage5Debrief } from "@/components/learning/Stage5Debrief";
import { Stage6FinalExam } from "@/components/learning/Stage6FinalExam";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Youtube,
  BookOpen,
  Gamepad2,
  Lock,
  CheckCircle2,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";

interface DualModeArticleViewProps {
  post: Post;
  children: React.ReactNode;
}

export function DualModeArticleView({ post, children }: DualModeArticleViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "blog" | "learning"
  const initialMode = searchParams.get("mode") === "learning" ? "learning" : "blog";
  const [mode, setMode] = useState<"blog" | "learning">(initialMode);
  const [activeStage, setActiveStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drill data
  const drillData: LearningDrillData = generateLearningDrill(post);

  // Read cleared stages from operative store
  const [clearedStages, setClearedStages] = useState<string[]>([]);

  useEffect(() => {
    const state = getOperativeState();
    setClearedStages(state.clearedStages[post.slug] || []);

    const handleUpdate = () => {
      const s = getOperativeState();
      setClearedStages(s.clearedStages[post.slug] || []);
    };

    window.addEventListener("technhit_operative_update", handleUpdate);
    return () => window.removeEventListener("technhit_operative_update", handleUpdate);
  }, [post.slug]);

  // Track scroll progress in blog mode
  useEffect(() => {
    if (mode !== "blog") return;

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode]);

  const handleSwitchMode = (targetMode: "blog" | "learning") => {
    playHapticSound("click");
    setMode(targetMode);
    const url = new URL(window.location.href);
    if (targetMode === "learning") {
      url.searchParams.set("mode", "learning");
    } else {
      url.searchParams.delete("mode");
    }
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const stageKeys = ["recon", "motive", "debate", "field", "debrief", "exam"];
  const clearedCount = clearedStages.length;

  return (
    <div className="min-h-screen text-zinc-100 pb-24">
      {/* Sticky Dual-Mode Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-[#07090e]/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand & Track link */}
          <Link
            href={`/${post.category}`}
            className="flex items-center gap-2 group font-mono text-xs text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span className="font-display text-lg tracking-wider text-zinc-200 group-hover:text-amber-400 pt-0.5">
              TECHNHIT<span className="text-[#FF5400]">//</span>BLUEPRINT
            </span>
          </Link>

          {/* Central Segmented Toggle */}
          <div className="flex border border-zinc-800 bg-zinc-950 p-0.5 rounded-sm" role="tablist">
            <button
              onClick={() => handleSwitchMode("blog")}
              role="tab"
              aria-selected={mode === "blog"}
              className={`font-display tracking-[0.14em] text-xs sm:text-sm px-4 sm:px-6 py-1.5 transition-all flex items-center gap-2 leading-none pt-1 ${
                mode === "blog"
                  ? "bg-[#FF5400] text-black font-bold shadow-[0_0_12px_rgba(255,84,0,0.3)]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>BLOG MODE</span>
            </button>

            <button
              onClick={() => handleSwitchMode("learning")}
              role="tab"
              aria-selected={mode === "learning"}
              className={`font-display tracking-[0.14em] text-xs sm:text-sm px-4 sm:px-6 py-1.5 transition-all flex items-center gap-2 leading-none pt-1 ${
                mode === "learning"
                  ? "bg-[#FF5400] text-black font-bold shadow-[0_0_12px_rgba(255,84,0,0.3)]"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>LEARNING MODE</span>
            </button>
          </div>

          {/* Right Status Badge */}
          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-zinc-400">
            {mode === "blog" ? (
              <span className="text-[11px] text-zinc-500">
                READING: <strong className="text-amber-400">{Math.round(scrollProgress)}%</strong>
              </span>
            ) : (
              <span className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>DRILL: <strong className="text-emerald-400">{clearedCount}/6 CLEAR</strong></span>
              </span>
            )}
          </div>
        </div>

        {/* Scroll Progress Bar (Blog Mode) */}
        {mode === "blog" && (
          <div className="h-[2px] w-full bg-transparent">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#FF5400] transition-[width] duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {mode === "blog" ? (
          /* ================= BLOG MODE ================= */
          <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto">
            {/* Header Telemetry */}
            <header className="space-y-6 pb-8 border-b border-zinc-800">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400">
                <span className="px-2.5 py-0.5 bg-[#FF5400]/10 text-[#FF5400] border border-[#FF5400]/30 font-bold uppercase tracking-wider text-[11px]">
                  {post.category.toUpperCase().replace(/-/g, " ")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{post.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{post.readTime} MIN READ</span>
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl text-zinc-100 leading-[1.05] tracking-wide">
                {post.title}
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg font-body leading-relaxed max-w-3xl">
                {post.summary}
              </p>

              {/* YouTube Companion Banner if available */}
              {post.youtubeId && (
                <div className="bg-[#0d1117] border border-zinc-800 p-4 notch-corner flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/20 text-red-500 flex items-center justify-center rounded shrink-0">
                      <Youtube className="w-6 h-6" />
                    </div>
                    <div className="font-mono text-xs">
                      <div className="text-zinc-200 font-bold">YOUTUBE COMPANION WALKTHROUGH</div>
                      <div className="text-zinc-500 text-[11px]">Watch step-by-step video on @TechBlogTutorial</div>
                    </div>
                  </div>
                  <a
                    href={`https://www.youtube.com/watch?v=${post.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    WATCH VIDEO
                  </a>
                </div>
              )}

              {/* In-Article Callout: Jump into Learning Mode */}
              <div className="p-6 bg-gradient-to-r from-zinc-950 via-[#0d1117] to-zinc-950 border border-amber-500/40 notch-corner flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-xs text-amber-400 font-bold uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>INTERACTIVE GAMIFIED DRILL AVAILABLE</span>
                  </div>
                  <p className="text-zinc-300 text-sm font-body">
                    Master this architecture with our 6-stage hands-on drill: concept cards, live packet simulator, debate scenarios, and certification exam.
                  </p>
                </div>

                <button
                  onClick={() => handleSwitchMode("learning")}
                  className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-lg tracking-wider px-7 py-3 transition-colors shrink-0 flex items-center gap-2"
                >
                  <span>ENTER LEARNING MODE →</span>
                </button>
              </div>
            </header>

            {/* Markdown Body Content */}
            <article className="prose prose-invert prose-zinc max-w-none text-zinc-300 font-body leading-relaxed space-y-6">
              {children}
            </article>

            {/* Bottom Training Ground CTA */}
            <div className="my-14 border border-[#FF5400]/40 bg-gradient-to-br from-[#FF5400]/15 via-zinc-950 to-zinc-950 p-8 sm:p-10 notch-corner space-y-4">
              <div className="font-mono text-xs text-[#FF5400] font-bold uppercase tracking-widest">
                TRAINING GROUND // REPS UNDER THE BAR
              </div>
              <h2 className="font-display text-3xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
                READING IS REPS. NOW GO UNDER THE BAR.
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base font-body leading-relaxed max-w-2xl">
                Internalize the exact mechanisms in this guide through our 6-stage drill. Flip cards, calibrate bandwidth sliders, judge architectural proposals, test commands in the terminal, and certify your knowledge with official XP and badges.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleSwitchMode("learning")}
                  className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-xl tracking-wider px-9 py-4 transition-colors"
                >
                  START THE 6-STAGE DRILL →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= LEARNING MODE ================= */
          <div className="space-y-10 animate-fadeIn">
            {/* Operative Gamification HUD */}
            <OperativeHud
              slug={post.slug}
              clearedCount={clearedCount}
              totalStages={6}
              activeStage={activeStage}
              onSelectStage={(idx) => setActiveStage(idx)}
            />

            {/* 6-Stage Selector Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
                <span className="uppercase tracking-widest flex items-center gap-2">
                  <span className="text-[#FF5400] font-bold">//</span>
                  <span>THE DRILL — 6 OPERATIONAL STAGES</span>
                </span>
                <span className="text-zinc-500">CLICK ANY UNLOCKED STAGE</span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                {[
                  { id: "recon", name: "WHAT IS IT?", sub: "Concept Card Deconstruction", pool: 150 },
                  { id: "motive", name: "WHY REQUIRED?", sub: "Comparative Network Benchmark", pool: 180 },
                  { id: "debate", name: "PROS & CONS", sub: "Architecture Proposal Judgment", pool: 250 },
                  { id: "field", name: "FIELD TEST", sub: "Terminal & Packet Simulator", pool: 300 },
                  { id: "debrief", name: "CONSOLIDATION", sub: "5 Golden Production Rules", pool: 140 },
                  { id: "exam", name: "FINAL EXAM", sub: "Scenario Certification Quiz", pool: 300 },
                ].map((stage, idx) => {
                  const isCurrent = idx === activeStage;
                  const isCleared = clearedStages.includes(stage.id);
                  const isUnlocked = idx === 0 || clearedStages.includes(stageKeys[idx - 1]);

                  return (
                    <button
                      key={stage.id}
                      onClick={() => {
                        playHapticSound("click");
                        setActiveStage(idx);
                      }}
                      className={`p-5 border text-left flex flex-col justify-between transition-all notch-corner relative overflow-hidden h-[135px] ${
                        isCurrent
                          ? "border-[#FF5400] bg-zinc-950 shadow-[0_0_15px_rgba(255,84,0,0.25)]"
                          : isCleared
                          ? "border-emerald-500/40 bg-[#0d1117] hover:border-emerald-500/70"
                          : isUnlocked
                          ? "border-zinc-800 bg-[#0d1117] hover:border-zinc-700"
                          : "border-zinc-900 bg-black/40 opacity-50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span className="text-[#FF5400] font-bold">STAGE 0{idx + 1}</span>
                        {isCleared ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>CLEARED</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="px-2 py-0.5 bg-[#FF5400] text-black font-bold uppercase text-[9px]">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-amber-500/80">{stage.pool} XP POOL</span>
                        )}
                      </div>

                      <div>
                        <div className="font-display text-xl sm:text-2xl text-zinc-100 tracking-wide">
                          {stage.name}
                        </div>
                        <div className="text-zinc-500 text-[11px] font-body truncate mt-0.5">
                          {stage.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Stage Screen */}
            <div className="pt-6 border-t border-zinc-800/80">
              {activeStage === 0 && (
                <Stage1Recon
                  slug={post.slug}
                  cards={drillData.reconCards}
                  onCompleteStage={() => setActiveStage(1)}
                />
              )}

              {activeStage === 1 && (
                <Stage2Motive
                  slug={post.slug}
                  motive={drillData.motive}
                  onCompleteStage={() => setActiveStage(2)}
                />
              )}

              {activeStage === 2 && (
                <Stage3Debate
                  slug={post.slug}
                  statements={drillData.debateStatements}
                  onCompleteStage={() => setActiveStage(3)}
                />
              )}

              {activeStage === 3 && (
                <Stage4Simulator
                  slug={post.slug}
                  simulator={drillData.simulator}
                  onCompleteStage={() => setActiveStage(4)}
                />
              )}

              {activeStage === 4 && (
                <Stage5Debrief
                  slug={post.slug}
                  rules={drillData.debriefRules}
                  onCompleteStage={() => setActiveStage(5)}
                />
              )}

              {activeStage === 5 && (
                <Stage6FinalExam
                  slug={post.slug}
                  badgeName={drillData.badgeName}
                  badgeDescription={drillData.badgeDescription}
                  quiz={drillData.quiz}
                  onReturnToBlog={() => handleSwitchMode("blog")}
                  onRestartDrill={() => {
                    setActiveStage(0);
                    playHapticSound("click");
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DualModeArticleView;
