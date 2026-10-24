"use client";

import React, { useState } from "react";
import type { QuizQuestion } from "@/lib/learning-generator";
import {
  awardOperativeXp,
  markStageComplete,
  unlockOperativeBadge,
  playHapticSound,
} from "@/lib/operative-store";
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface Stage6FinalExamProps {
  slug: string;
  badgeName: string;
  badgeDescription: string;
  quiz: QuizQuestion[];
  onReturnToBlog: () => void;
  onRestartDrill: () => void;
}

export function Stage6FinalExam({
  slug,
  badgeName,
  badgeDescription,
  quiz,
  onReturnToBlog,
  onRestartDrill,
}: Stage6FinalExamProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = quiz[currentQuestionIndex];
  const hasAnsweredCurrent = isAnswerSubmitted[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    playHapticSound("click");
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleSubmitAnswer = () => {
    const selected = selectedAnswers[currentQuestionIndex];
    if (selected === undefined || hasAnsweredCurrent) return;

    setIsAnswerSubmitted((prev) => ({ ...prev, [currentQuestionIndex]: true }));
    const isCorrect = selected === currentQ.correctIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      awardOperativeXp(30, "Exam Question Correct");
      playHapticSound("success");
    } else {
      playHapticSound("error");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < quiz.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      playHapticSound("click");
    } else {
      // Completed exam
      setIsCompleted(true);
      markStageComplete(slug, "exam", 100);
      unlockOperativeBadge({
        id: `badge-${slug}`,
        name: badgeName,
        category: "SYSADMIN",
        iconName: "ShieldCheck",
        description: badgeDescription,
      });
      playHapticSound("levelup");
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 06</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            FINAL EXAM · TECHNICAL CERTIFICATION
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          PROVE OPERATIONAL MASTERY UNDER EVALUATION
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          Answer {quiz.length} real-world technical scenarios. Score passing marks to certify your knowledge and unlock the <span className="text-amber-400 font-bold">{badgeName}</span> badge.
        </p>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Question Tracker & Score Bar */}
          <div className="bg-[#0d1117] border border-zinc-800 p-4 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#FF5400] font-bold">
                QUESTION {currentQuestionIndex + 1} OF {quiz.length}
              </span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>SCORE: <strong className="text-emerald-400">{score}</strong></span>
              <span>EARNED: <strong className="text-amber-400">+{score * 30} XP</strong></span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[#0d1117] border border-zinc-800 notch-corner p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Scenario Pill */}
            {currentQ.scenario && (
              <div className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-sm font-mono text-xs text-zinc-300">
                <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">
                  REAL-WORLD SCENARIO:
                </span>
                {currentQ.scenario}
              </div>
            )}

            <h3 className="font-display text-2xl sm:text-3xl text-zinc-100 leading-snug">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3 font-mono text-xs">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                const isCorrectOption = optIdx === currentQ.correctIndex;

                let optionStyles = "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900";
                if (hasAnsweredCurrent) {
                  if (isCorrectOption) {
                    optionStyles = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyles = "border-red-500 bg-red-950/40 text-red-300 font-bold";
                  } else {
                    optionStyles = "border-zinc-900 bg-black/40 text-zinc-600 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyles = "border-[#FF5400] bg-zinc-900 text-zinc-100 font-bold shadow-[0_0_10px_rgba(255,84,0,0.3)]";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={hasAnsweredCurrent}
                    className={`w-full p-4 border text-left flex items-start gap-3 transition-all rounded-sm ${optionStyles}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-relaxed flex-1 font-body text-sm sm:text-base">
                      {opt}
                    </span>
                    {hasAnsweredCurrent && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {hasAnsweredCurrent && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Callout after Submit */}
            {hasAnsweredCurrent && (
              <div className="bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs leading-relaxed animate-fadeIn">
                <span className="text-amber-400 font-bold uppercase text-[10px] block mb-1">
                  TECHNICAL EXPLANATION:
                </span>
                <p className="text-zinc-300 font-body text-xs sm:text-sm">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t border-zinc-800">
              {!hasAnsweredCurrent ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className={`font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 transition-all ${
                    selectedAnswers[currentQuestionIndex] !== undefined
                      ? "bg-[#FF5400] hover:bg-amber-500 text-black shadow-lg"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  CONFIRM ANSWER
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="pulse-cta bg-emerald-500 hover:bg-emerald-400 text-black font-display text-lg tracking-wider px-8 py-3 flex items-center gap-2 transition-colors"
                >
                  <span>
                    {currentQuestionIndex + 1 < quiz.length ? "NEXT SCENARIO →" : "FINALIZE EXAM & CERTIFY"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Certification Celebration Card */
        <div className="bg-[#0d1117] border-2 border-amber-500 notch-corner p-8 sm:p-12 text-center space-y-8 shadow-[0_0_40px_rgba(255,84,0,0.25)] animate-slideUp">
          <div className="w-20 h-20 mx-auto bg-amber-500/20 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-[0.3em]">
              OFFICIAL CERTIFICATION GRANTED
            </div>
            <h3 className="font-display text-4xl sm:text-6xl text-zinc-100 tracking-wide">
              {badgeName}
            </h3>
            <p className="text-zinc-400 text-sm font-body leading-relaxed">
              {badgeDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto font-mono text-xs">
            <div className="bg-zinc-950 border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">EXAM SCORE</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{score} / {quiz.length}</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">BONUS XP</div>
              <div className="text-lg font-bold text-amber-400 mt-1">+{score * 30 + 100} XP</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-3 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-zinc-500">STATUS</div>
              <div className="text-lg font-bold text-zinc-200 mt-1">VERIFIED</div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onReturnToBlog}
              className="pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black font-display text-xl tracking-wider px-8 py-3.5 transition-colors"
            >
              RETURN TO FIELD MANUAL (BLOG MODE)
            </button>
            <button
              onClick={onRestartDrill}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-mono text-xs uppercase px-6 py-3.5 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETAKE DRILL</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Stage6FinalExam;
