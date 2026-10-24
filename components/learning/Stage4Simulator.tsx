"use client";

import React, { useState } from "react";
import type { SimulatorSpec } from "@/lib/learning-generator";
import { markStageComplete, playHapticSound } from "@/lib/operative-store";
import { Terminal, Play, CheckCircle2, ArrowRight, Server, Activity, ShieldCheck, Copy, Check } from "lucide-react";

interface Stage4SimulatorProps {
  slug: string;
  simulator: SimulatorSpec;
  onCompleteStage: () => void;
}

export function Stage4Simulator({ slug, simulator, onCompleteStage }: Stage4SimulatorProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [executedSteps, setExecutedSteps] = useState<Record<number, boolean>>({});
  const [acceptEncodingBr, setAcceptEncodingBr] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleExecuteStep = (index: number) => {
    playHapticSound("click");
    setExecutedSteps((prev) => ({ ...prev, [index]: true }));
    if (index + 1 < simulator.terminalSteps.length) {
      setActiveStepIndex(index + 1);
    }
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    playHapticSound("click");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const allExecuted = simulator.terminalSteps.length > 0 &&
    simulator.terminalSteps.every((_, idx) => !!executedSteps[idx]);

  const handleAdvance = () => {
    markStageComplete(slug, "field", 50);
    onCompleteStage();
  };

  const currentPayloadBytes = acceptEncodingBr
    ? simulator.compressedPayloadBytes
    : simulator.defaultPayloadBytes;

  const ratio = Math.round(
    ((simulator.defaultPayloadBytes - simulator.compressedPayloadBytes) /
      simulator.defaultPayloadBytes) *
      100
  );

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-[#FF5400] text-xl tracking-widest">STAGE 04</span>
          <span className="h-px w-8 bg-[#FF5400]/60" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400">
            FIELD TEST · TERMINAL &amp; PACKET SIMULATOR
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-zinc-100 tracking-wide leading-tight">
          {simulator.headline}
        </h2>
        <p className="text-zinc-400 text-sm max-w-2xl font-body leading-relaxed">
          {simulator.description}
        </p>
      </div>

      {/* Simulator Split View */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Terminal (7 cols) */}
        <div className="lg:col-span-7 bg-[#050609] border border-zinc-800 notch-corner overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Terminal Window Header */}
          <div className="bg-[#0d1117] px-4 py-3 border-b border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-zinc-300">root@technhit-node-01: ~</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SSH SESSION ACTIVE</span>
            </div>
          </div>

          {/* Terminal Command Stream */}
          <div className="p-5 font-mono text-xs space-y-6 overflow-y-auto max-h-[460px] slim-scroll">
            {simulator.terminalSteps.map((step, idx) => {
              const isDone = !!executedSteps[idx];
              const isCurrent = idx === activeStepIndex;

              return (
                <div key={step.id} className="space-y-2 border-b border-zinc-900 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="text-[#FF5400] font-bold">
                      STEP {idx + 1}: {step.title.toUpperCase()}
                    </span>
                    <button
                      onClick={() => handleCopyCommand(step.command, idx)}
                      className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                      title="Copy command"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-[10px] text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-zinc-400 text-xs font-body">
                    {step.description}
                  </p>

                  <div className="bg-[#0d1117] border border-zinc-800/80 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-zinc-200 truncate">
                      <span className="text-emerald-400 font-bold">$</span>
                      <code className="text-amber-300 font-bold truncate">{step.command}</code>
                    </div>

                    <button
                      onClick={() => handleExecuteStep(idx)}
                      disabled={isDone}
                      className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0 ${
                        isDone
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                          : isCurrent
                          ? "bg-[#FF5400] hover:bg-amber-500 text-black shadow-[0_0_10px_rgba(255,84,0,0.4)]"
                          : "border border-zinc-700 text-zinc-300 hover:border-zinc-500"
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>EXECUTED</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>RUN COMMAND</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Terminal Output */}
                  {isDone && (
                    <div className="bg-black/70 border-l-2 border-emerald-500 p-3 text-zinc-400 text-[11px] whitespace-pre-wrap leading-relaxed animate-fadeIn">
                      {step.output}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-[#0d1117] px-4 py-2.5 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
            <span>TERMINAL PROGRESS: {Object.keys(executedSteps).length} / {simulator.terminalSteps.length}</span>
            <span className="text-emerald-400">SYSTEM READY</span>
          </div>
        </div>

        {/* Right Column: Live HTTP Header & Packet Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d1117] border border-zinc-800 notch-corner p-6 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs border-b border-zinc-800 pb-3">
              <span className="flex items-center gap-2 text-amber-400 font-bold tracking-wider">
                <Server className="w-4 h-4" />
                <span>PACKET INSPECTOR</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">LIVE SIMULATION</span>
            </div>

            {/* Toggle Client Encoding Header */}
            <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-sm space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">CLIENT ACCEPT-ENCODING:</span>
                <button
                  onClick={() => {
                    playHapticSound("click");
                    setAcceptEncodingBr((prev) => !prev);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                    acceptEncodingBr
                      ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {acceptEncodingBr ? "br (BROTLI ON)" : "identity (OFF)"}
                </button>
              </div>
              <div className="text-[10px] text-zinc-500">
                Click toggle to simulate modern Chromium vs legacy plain HTTP client.
              </div>
            </div>

            {/* Live Wire Size Gauge */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">PAYLOAD WIRE WEIGHT:</span>
                <span className={acceptEncodingBr ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                  {(currentPayloadBytes / 1024).toFixed(1)} KB
                </span>
              </div>

              <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                  style={{
                    width: `${Math.round((currentPayloadBytes / simulator.defaultPayloadBytes) * 100)}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>{acceptEncodingBr ? `SAVINGS: -${ratio}%` : "UNCOMPRESSED"}</span>
                <span>ORIGINAL: {(simulator.defaultPayloadBytes / 1024).toFixed(1)} KB</span>
              </div>
            </div>

            {/* Simulated Response Headers */}
            <div className="space-y-2 font-mono text-xs">
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                RECEIVED RESPONSE HEADERS:
              </div>
              <div className="bg-black/90 border border-zinc-800 p-3.5 space-y-1 font-mono text-[11px] text-zinc-300 rounded-sm">
                <div className="text-emerald-400 font-bold">HTTP/1.1 200 OK</div>
                <div>Server: {simulator.responseHeaders["Server"]}</div>
                {acceptEncodingBr ? (
                  <div className="text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded">
                    Content-Encoding: br
                  </div>
                ) : (
                  <div className="text-zinc-600">Content-Encoding: [none]</div>
                )}
                <div className="text-amber-400">Vary: Accept-Encoding</div>
                <div>Content-Type: text/html; charset=UTF-8</div>
                <div>Cache-Control: public, max-age=31536000</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 font-mono text-xs text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">Brotli module active &amp; headers validated.</span>
          </div>
        </div>
      </div>

      {/* Advance Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleAdvance}
          disabled={!allExecuted}
          className={`font-display text-lg tracking-wider px-8 py-3.5 flex items-center gap-3 transition-colors ${
            allExecuted
              ? "pulse-cta bg-[#FF5400] hover:bg-amber-500 text-black shadow-lg"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          <span>
            {allExecuted
              ? "VERIFY SIMULATION & ADVANCE (+50 XP)"
              : `EXECUTE ALL ${simulator.terminalSteps.length} TERMINAL COMMANDS TO ADVANCE`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default Stage4Simulator;
