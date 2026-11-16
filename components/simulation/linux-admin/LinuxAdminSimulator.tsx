"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "@/lib/posts";
import { playHapticSound, awardOperativeXp } from "@/lib/operative-store";
import { trackSimulatorAction } from "@/lib/analytics";
import { LINUX_ADMIN_SIM_CONFIGS, LinuxAdminSimConfig } from "./linuxAdminSimConfigs";

// Visualizer imports
import { KernelNftablesVisualizer } from "./visualizers/KernelNftablesVisualizer";
import { NginxReverseProxyVisualizer } from "./visualizers/NginxReverseProxyVisualizer";
import { ApacheVHostUbuntu20Visualizer } from "./visualizers/ApacheVHostUbuntu20Visualizer";
import { ApacheVHostMultiTenantVisualizer } from "./visualizers/ApacheVHostMultiTenantVisualizer";
import { ApacheBrotliVisualizer } from "./visualizers/ApacheBrotliVisualizer";
import { MultiPhpFpmVisualizer } from "./visualizers/MultiPhpFpmVisualizer";
import { LampStackMasterclassVisualizer } from "./visualizers/LampStackMasterclassVisualizer";
import { Tomcat10ProductionVisualizer } from "./visualizers/Tomcat10ProductionVisualizer";
import { SshKeyAuthVisualizer } from "./visualizers/SshKeyAuthVisualizer";
import { RootSshSecurityVisualizer } from "./visualizers/RootSshSecurityVisualizer";
import { RootUserDelegationVisualizer } from "./visualizers/RootUserDelegationVisualizer";
import { SftpScpRsyncVisualizer } from "./visualizers/SftpScpRsyncVisualizer";
import { SshfsFuseVisualizer } from "./visualizers/SshfsFuseVisualizer";
import { SublimeRsubTunnelVisualizer } from "./visualizers/SublimeRsubTunnelVisualizer";
import { VsCodeRemoteSshVisualizer } from "./visualizers/VsCodeRemoteSshVisualizer";
import { VsCodePackageArchVisualizer } from "./visualizers/VsCodePackageArchVisualizer";
import { SystemMonitoringTriageVisualizer } from "./visualizers/SystemMonitoringTriageVisualizer";
import { PlexTranscodingVisualizer } from "./visualizers/PlexTranscodingVisualizer";
import { VmwareToolsKernelVisualizer } from "./visualizers/VmwareToolsKernelVisualizer";
import { ManjaroArchRollingVisualizer } from "./visualizers/ManjaroArchRollingVisualizer";
import { ComputingArchitectureVisualizer } from "./visualizers/ComputingArchitectureVisualizer";

import {
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Bot,
  Layers,
  FileCode,
  Check,
  FastForward,
  Server,
  Database,
  ShieldAlert,
  Zap,
  Activity,
  HardDrive,
  Network,
  Code2,
} from "lucide-react";

interface LinuxAdminSimulatorProps {
  post: Post;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "command" | "mcp" | "error" | "success" | "gate";
  text: string;
}

export function LinuxAdminSimulator({ post }: LinuxAdminSimulatorProps) {
  const config: LinuxAdminSimConfig =
    LINUX_ADMIN_SIM_CONFIGS[post.slug] || LINUX_ADMIN_SIM_CONFIGS["hardening-linux-kernel-sysctl-nftables"];

  const [activeTab, setActiveTab] = useState<"pipeline" | "mdx">("pipeline");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simState, setSimState] = useState<"idle" | "running" | "approval" | "completed">("idle");
  const [approvalDecision, setApprovalDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init-sys",
      timestamp: "10:00:00.100",
      type: "info",
      text: `[SYSTEM] Antigravity SRE Orchestrator online for target: ${config.targetHost}`,
    },
    {
      id: "init-mcp",
      timestamp: "10:00:00.180",
      type: "mcp",
      text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:fs, mcp:kernel, mcp:systemd. Direct SSH root session established.",
    },
    {
      id: "init-ready",
      timestamp: "10:00:00.220",
      type: "info",
      text: `[STANDBY] Plan loaded: 4 atomic execution stages. Target workflow: ${config.title}.`,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (type: LogEntry["type"], text: string) => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(" ")[0]}.${String(now.getMilliseconds()).padStart(3, "0")}`;
    setLogs((prev) => [...prev, { id: Math.random().toString(), timestamp: timeStr, type, text }]);
  };

  // Timeline sync callback from visualizer
  const handleTimelineSync = useCallback((time: number, sceneIndex: number) => {
    // Keep in sync with visualizer scrubber
  }, []);

  const executeStage = async (stageIndex: number) => {
    if (stageIndex >= config.stages.length) {
      setSimState("completed");
      setIsAutoPilot(false);
      playHapticSound("success");
      awardOperativeXp(50, "Full SRE Pipeline Execution Completed");
      addLog("success", `[PIPELINE COMPLETE] All ${config.stages.length} stages successfully committed. Zero regressions.`);
      trackSimulatorAction(post.slug, "complete", config.stages.length);
      return;
    }

    const stage = config.stages[stageIndex];
    setCurrentStep(stageIndex + 1);

    // If stage requires approval and has not been approved
    if (stage.requiresApproval && approvalDecision !== "approved") {
      setSimState("approval");
      setIsAutoPilot(false);
      playHapticSound("click");
      addLog("gate", `[APPROVAL GATE] Stage '${stage.name}' requires elevated operator authorization.`);
      return;
    }

    setSimState("running");
    playHapticSound("click");
    addLog("command", `$ ${stage.command}`);

    // Realistic terminal delay
    await new Promise((res) => setTimeout(res, 900));

    stage.output.split("\n").forEach((line) => {
      addLog("info", line);
    });

    awardOperativeXp(stage.xp, `Completed ${stage.name}`);
    addLog("success", `[STAGE ${stageIndex + 1}/${config.stages.length} VERIFIED] ${stage.name} - Telemetry: ${stage.telemetry.status}`);

    // If autopilot is on, schedule next stage
    if (isAutoPilot && stageIndex + 1 < config.stages.length) {
      const nextStage = config.stages[stageIndex + 1];
      if (nextStage.requiresApproval && approvalDecision !== "approved") {
        setSimState("approval");
        setIsAutoPilot(false);
        playHapticSound("click");
        addLog("gate", `[APPROVAL GATE] Stage '${nextStage.name}' requires elevated operator authorization.`);
      } else {
        setTimeout(() => {
          executeStage(stageIndex + 1);
        }, 1500);
      }
    } else if (stageIndex + 1 === config.stages.length) {
      setSimState("completed");
      setIsAutoPilot(false);
      playHapticSound("success");
      awardOperativeXp(50, "Full SRE Pipeline Execution Completed");
      addLog("success", `[PIPELINE COMPLETE] All ${config.stages.length} stages successfully committed. Zero regressions.`);
    }
  };

  const handleApprove = () => {
    setApprovalDecision("approved");
    playHapticSound("success");
    addLog("success", "[APPROVAL GRANTED] Elevated authorization verified by operative.");
    setSimState("running");
    const currentStageIdx = currentStep > 0 ? currentStep - 1 : 0;
    executeStage(currentStageIdx);
  };

  const handleReject = () => {
    setApprovalDecision("rejected");
    setIsAutoPilot(false);
    playHapticSound("error");
    addLog("error", "[APPROVAL REJECTED] Change aborted by operative. Host state unchanged.");
    setSimState("idle");
  };

  const startAutoPilot = () => {
    setIsAutoPilot(true);
    setSimState("running");
    setApprovalDecision("pending");
    playHapticSound("click");
    addLog("info", "[AUTO-PILOT ENGAGED] Autonomous execution of Linux admin pipeline initiated.");
    executeStage(0);
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setSimState("idle");
    setApprovalDecision("pending");
    setIsAutoPilot(false);
    playHapticSound("click");
    setLogs([
      {
        id: "reset-sys",
        timestamp: "10:00:00.100",
        type: "info",
        text: `[SYSTEM] Antigravity SRE Orchestrator reset. Target: ${config.targetHost}`,
      },
      {
        id: "reset-ready",
        timestamp: "10:00:00.150",
        type: "info",
        text: `[STANDBY] Target workflow: ${config.title}. Ready for execution.`,
      },
    ]);
  };

  // Render the dedicated visualizer component based on visualizerKey
  const renderVisualizer = () => {
    const props = { onTimelineSync: handleTimelineSync, externalStep: currentStep };
    switch (config.visualizerKey) {
      case "KernelNftablesVisualizer":
        return <KernelNftablesVisualizer {...props} />;
      case "NginxReverseProxyVisualizer":
        return <NginxReverseProxyVisualizer {...props} />;
      case "ApacheVHostUbuntu20Visualizer":
        return <ApacheVHostUbuntu20Visualizer {...props} />;
      case "ApacheVHostMultiTenantVisualizer":
        return <ApacheVHostMultiTenantVisualizer {...props} />;
      case "ApacheBrotliVisualizer":
        return <ApacheBrotliVisualizer {...props} />;
      case "MultiPhpFpmVisualizer":
        return <MultiPhpFpmVisualizer {...props} />;
      case "LampStackMasterclassVisualizer":
        return <LampStackMasterclassVisualizer {...props} />;
      case "Tomcat10ProductionVisualizer":
        return <Tomcat10ProductionVisualizer {...props} />;
      case "SshKeyAuthVisualizer":
        return <SshKeyAuthVisualizer {...props} />;
      case "RootSshSecurityVisualizer":
        return <RootSshSecurityVisualizer {...props} />;
      case "RootUserDelegationVisualizer":
        return <RootUserDelegationVisualizer {...props} />;
      case "SftpScpRsyncVisualizer":
        return <SftpScpRsyncVisualizer {...props} />;
      case "SshfsFuseVisualizer":
        return <SshfsFuseVisualizer {...props} />;
      case "SublimeRsubTunnelVisualizer":
        return <SublimeRsubTunnelVisualizer {...props} />;
      case "VsCodeRemoteSshVisualizer":
        return <VsCodeRemoteSshVisualizer {...props} />;
      case "VsCodePackageArchVisualizer":
        return <VsCodePackageArchVisualizer {...props} />;
      case "SystemMonitoringTriageVisualizer":
        return <SystemMonitoringTriageVisualizer {...props} />;
      case "PlexTranscodingVisualizer":
        return <PlexTranscodingVisualizer {...props} />;
      case "VmwareToolsKernelVisualizer":
        return <VmwareToolsKernelVisualizer {...props} />;
      case "ManjaroArchRollingVisualizer":
        return <ManjaroArchRollingVisualizer {...props} />;
      case "ComputingArchitectureVisualizer":
        return <ComputingArchitectureVisualizer {...props} />;
      default:
        return <KernelNftablesVisualizer {...props} />;
    }
  };

  const activeStage = currentStep > 0 ? config.stages[currentStep - 1] : config.stages[0];

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#07090e] p-4 sm:p-6 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-wider text-slate-100 uppercase">{config.title}</h2>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                SRE SIMULATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{config.summary}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5">
            <button
              onClick={() => { setActiveTab("pipeline"); playHapticSound("click"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                activeTab === "pipeline"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="h-3.5 w-3.5" /> Interactive Pipeline
            </button>
            <button
              onClick={() => { setActiveTab("mdx"); playHapticSound("click"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                activeTab === "mdx"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileCode className="h-3.5 w-3.5" /> Declarative MDX Spec
            </button>
          </div>
        </div>
      </div>

      {activeTab === "pipeline" ? (
        <>
          {/* Dedicated Motion-Graphics Technical Visualizer */}
          <div className="mb-6">{renderVisualizer()}</div>

          {/* SRE Action & Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={startAutoPilot}
                disabled={simState === "running" || simState === "approval"}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-[11px] font-bold text-slate-950 hover:brightness-110 disabled:opacity-50 transition shadow-[0_0_15px_rgba(0,245,212,0.2)]"
              >
                <FastForward className="h-3.5 w-3.5" /> Auto-Pilot SRE
              </button>

              <button
                onClick={() => {
                  const nextIdx = currentStep < config.stages.length ? currentStep : 0;
                  executeStage(nextIdx);
                }}
                disabled={simState === "running" || simState === "approval"}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-[11px] font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition"
              >
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                {currentStep === 0 ? "Execute Stage 1" : currentStep < config.stages.length ? `Step to Stage ${currentStep + 1}` : "Re-run"}
              </button>

              <button
                onClick={resetSimulation}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Target:</span>
                <span className="text-slate-200 font-bold">{config.targetHost}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    simState === "completed"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : simState === "approval"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                      : simState === "running"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {simState.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* SRE Approval Gate Alert Modal/Box if required */}
          {simState === "approval" && activeStage?.approvalDetails && (
            <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-950/20 p-5 shadow-lg relative overflow-hidden animate-in fade-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                      SRE Gate: {activeStage.approvalDetails.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                      ELEVATED PRIVILEGE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{activeStage.approvalDetails.reason}</p>
                  <div className="mt-2 text-[11px] text-amber-200/80">
                    <span className="font-bold">Blast Radius:</span> {activeStage.approvalDetails.blastRadius}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={handleApprove}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                    >
                      <Check className="h-4 w-4" /> Authorize & Apply Change
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
                    >
                      <XCircle className="h-4 w-4 text-red-400" /> Abort Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout: Stage Pipeline Tracker & Live Terminal Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Stages list */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" /> Execution Stages
                </span>
                <span>{currentStep}/{config.stages.length}</span>
              </div>

              {config.stages.map((stg, idx) => {
                const isCurrent = currentStep === idx + 1;
                const isPassed = currentStep > idx + 1 || simState === "completed";
                return (
                  <div
                    key={stg.id}
                    onClick={() => executeStage(idx)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition ${
                      isCurrent
                        ? "border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,245,212,0.1)]"
                        : isPassed
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : "border-slate-800 bg-slate-900/30 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold">#{idx + 1}</span>
                        )}
                        <span className={`text-[11px] font-bold ${isCurrent ? "text-cyan-300" : isPassed ? "text-emerald-300" : "text-slate-300"}`}>
                          {stg.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-semibold">+{stg.xp} XP</span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-1">{stg.description}</p>

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1.5 border-t border-slate-800/60">
                      <span className="truncate max-w-[200px] text-slate-400">$ {stg.command}</span>
                      <span className={isPassed ? "text-emerald-400 font-bold" : "text-slate-500"}>
                        {stg.telemetry.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Output Console */}
            <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner h-[380px]">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 ml-2">
                    <Terminal className="h-3 w-3 text-cyan-400" /> SRE EXECUTION LOGS
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">root@{config.targetHost.split(" ")[0]}:~</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[11px]">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 select-none text-[10px] pt-0.5">{log.timestamp}</span>
                    <span
                      className={`break-all ${
                        log.type === "command"
                          ? "text-cyan-300 font-bold"
                          : log.type === "mcp"
                          ? "text-purple-400"
                          : log.type === "success"
                          ? "text-emerald-400 font-semibold"
                          : log.type === "error"
                          ? "text-red-400 font-bold"
                          : log.type === "gate"
                          ? "text-amber-300 font-bold"
                          : "text-slate-300"
                      }`}
                    >
                      {log.text}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Declarative MDX Spec View */
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-cyan-300 text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4" /> Declarative SRE Automation Spec (YAML / MDX)
            </span>
            <span className="text-[10px] text-slate-500">schema: technhit/sre-pipeline/v1</span>
          </div>

          <pre className="text-[11px] text-emerald-400 font-mono overflow-x-auto p-4 rounded bg-slate-900/60 border border-slate-800/80">
{`name: "${config.title}"
slug: "${config.slug}"
category: "${config.category}"
target_host: "${config.targetHost}"
stages:
${config.stages
  .map(
    (s, i) => `  - step: ${i + 1}
    id: "${s.id}"
    name: "${s.name}"
    command: "${s.command.replace(/"/g, '\\"')}"
    requires_approval: ${!!s.requiresApproval}
    telemetry_assertion: "${s.telemetry.status}"
    xp_reward: ${s.xp}`
  )
  .join("\n")}
`}
          </pre>
        </div>
      )}
    </div>
  );
}
