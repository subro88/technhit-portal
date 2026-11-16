"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "@/lib/posts";
import { playHapticSound, awardOperativeXp } from "@/lib/operative-store";
import { ScalabilityHybridVisualizer } from "./ScalabilityHybridVisualizer";
import { trackSimulatorAction } from "@/lib/analytics";
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
} from "lucide-react";

interface ScalabilityWorkflowSimulatorProps {
  post: Post;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "command" | "mcp" | "error" | "success" | "gate";
  text: string;
}

interface StageConfig {
  id: string;
  name: string;
  command: string;
  output: string;
  requiresApproval?: boolean;
  approvalDetails?: {
    title: string;
    reason: string;
    blastRadius: string;
  };
}

const STAGES: StageConfig[] = [
  {
    id: "stage-1",
    name: "Surge Detection & Queue Saturation Analysis",
    command: "wrk -t8 -c2000 -d15s http://192.168.10.100/health",
    output: `Running 15s test @ http://192.168.10.100/health
  8 threads and 2000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     2.41s   840.12ms   4.10s    68.22%
    Req/Sec   184.10     92.40   420.00     71.12%
  22,094 requests in 15.02s, 4.12MB read
  Socket errors: connect 412, read 890, write 0, timeout 3,421
[ALERT] Ingress bottleneck detected: TCP listen queue overflow. CPU load 99%.`,
  },
  {
    id: "stage-2",
    name: "Vertical Resource Expansion (Hotplug vCPU/RAM)",
    command: "qm set 100 --cores 16 --memory 65536 --hotplug cpu,memory",
    output: `update VM 100: -cores 16 -memory 65536
Hotplugging 12 vCPUs... OK (Online cores: 16)
Allocating 48GB balloon memory... OK (Total memory: 64 GB)
Kernel NUMA topology: 2 Nodes detected. Memory latency delta: +28ns.
[VERIFIED] Server 01 upgraded to 16 vCPU / 64 GB RAM. Load dropped to 42%.`,
  },
  {
    id: "stage-3",
    name: "Deploy HAProxy Layer 7 Ingress Load Balancer",
    command: "sudo apt update && sudo apt install -y haproxy && sudo haproxy -c -f /etc/haproxy/haproxy.cfg",
    output: `Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease
Setting up haproxy (2.8.5-1ubuntu1) ...
Validating /etc/haproxy/haproxy.cfg:
  - Frontend 'http_ingress' bound to *:80
  - Backend 'cluster_app_nodes' with 4 active servers
  - Health check: GET /health (interval 2000ms, fall 3, rise 2)
Configuration file is valid.
[SYSTEMD] Started HAProxy Load Balancer daemon on PID 14209.`,
  },
  {
    id: "stage-4",
    name: "Horizontal Scale-Out: Provision 4 Stateless Nodes",
    command: "ansible-playbook -i hosts deploy-stateless-cluster.yml --forks 4",
    output: `PLAY [Provision Stateless Worker Nodes] ***************************************
TASK [Deploy Nginx Web Engine & Health Telemetry] *****************************
ok: [192.168.10.101] (app-node-01)
ok: [192.168.10.102] (app-node-02)
ok: [192.168.10.103] (app-node-03)
ok: [192.168.10.104] (app-node-04)
TASK [HAProxy Health Probe Registration] **************************************
changed: [192.168.10.100] -> app-node-01..04 reported UP (200 OK)
PLAY RECAP: 4 nodes configured, 0 failures. Cluster pool: 50,000 RPS capacity.`,
  },
  {
    id: "stage-5",
    name: "SRE Chaos Gate: Kill Node 02 & Verify Zero Downtime",
    command: "ssh root@192.168.10.102 'echo c > /proc/sysrq-trigger'",
    requiresApproval: true,
    approvalDetails: {
      title: "Hard Kernel Panic Fault Injection on Worker 02",
      reason: "Simulate sudden catastrophic motherboard failure during peak 20,000 RPS ingress to verify automated HAProxy health-check eviction.",
      blastRadius: "app-node-02 (192.168.10.102). 25% of cluster compute dropped. 0% user session loss guaranteed by stateless tier.",
    },
    output: `[CHAOS] SysRq-c dispatched to 192.168.10.102. Kernel panic triggered.
[HAPROXY] Health check missed: Server app-node-02 failed 1/3
[HAPROXY] Health check missed: Server app-node-02 failed 2/3
[HAPROXY] Server app-node-02 is DOWN, reason: Layer7 timeout. 3 active servers left.
[TRAFFIC DRAIN] In-flight requests gracefully redispatched to nodes 01, 03, 04.
[TELEMETRY] Aggregate error rate: 0.000% · Cluster P99 latency: 28ms. Zero downtime verified!`,
  },
];

export function ScalabilityWorkflowSimulator({ post }: ScalabilityWorkflowSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "mdx">("pipeline");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simState, setSimState] = useState<"idle" | "running" | "approval" | "completed">("idle");
  const [approvalDecision, setApprovalDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init",
      timestamp: "10:00:00.100",
      type: "info",
      text: "[SYSTEM] Antigravity SRE Orchestrator online for Scalability Masterclass.",
    },
    {
      id: "init-mcp",
      timestamp: "10:00:00.180",
      type: "mcp",
      text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:haproxy, mcp:k6, mcp:chaos. SSH keys verified.",
    },
    {
      id: "init-ready",
      timestamp: "10:00:00.220",
      type: "info",
      text: "[STANDBY] Topology Target: VIP 192.168.10.100, 4 Stateless Worker Nodes. Ready for execution.",
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

  const handleTimelineSync = useCallback((time: number, sceneIndex: number) => {
    // Keep in sync with visualizer
  }, []);

  const executeStage = async (stageIndex: number) => {
    if (stageIndex >= STAGES.length) {
      setSimState("completed");
      setIsAutoPilot(false);
      playHapticSound("success");
      awardOperativeXp(60, "Distributed Scalability Pipeline Completed");
      addLog("success", "[PIPELINE COMPLETE] All 5 scalability stages committed. Zero downtime verified.");
      trackSimulatorAction(post.slug, "complete", STAGES.length);
      return;
    }

    const stage = STAGES[stageIndex];
    setCurrentStep(stageIndex + 1);

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

    await new Promise((res) => setTimeout(res, 850));

    stage.output.split("\n").forEach((line) => {
      addLog("info", line);
    });

    addLog("success", `[STAGE COMMITTED] '${stage.name}' verified.`);

    if (isAutoPilot && stageIndex + 1 < STAGES.length) {
      setTimeout(() => executeStage(stageIndex + 1), 1200);
    } else if (stageIndex + 1 === STAGES.length) {
      setSimState("completed");
      setIsAutoPilot(false);
      playHapticSound("success");
      awardOperativeXp(60, "Full SRE Scalability Verification");
      addLog("success", "[SYSTEM] Enterprise Scalability Benchmark Complete.");
    } else {
      setSimState("idle");
    }
  };

  const handleApprove = () => {
    setApprovalDecision("approved");
    setSimState("running");
    playHapticSound("click");
    addLog("success", "[OPERATOR APPROVED] Chaos injection authorized. Dispatching SysRq panic.");
    executeStage(currentStep - 1);
  };

  const handleReject = () => {
    setApprovalDecision("rejected");
    setSimState("idle");
    setIsAutoPilot(false);
    playHapticSound("click");
    addLog("error", "[ACTION ABORTED] Operator rejected chaos fault injection.");
  };

  const startAutoPilot = () => {
    setIsAutoPilot(true);
    setApprovalDecision("approved");
    executeStage(0);
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setSimState("idle");
    setIsAutoPilot(false);
    setApprovalDecision("pending");
    playHapticSound("click");
    setLogs([
      {
        id: "reset",
        timestamp: "10:00:00.000",
        type: "info",
        text: "[RESET] Simulation reset to initial state. Cluster standby.",
      },
    ]);
  };

  const activeStage = currentStep > 0 ? STAGES[currentStep - 1] : STAGES[0];

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-[#07090e] p-4 sm:p-6 shadow-2xl overflow-hidden font-mono text-xs">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-wider text-slate-100 uppercase">
                SCALABILITY ARCHITECTURE SRE SIMULATOR
              </h2>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Target: 4-Node Stateless Compute Cluster with HAProxy L7 Balancer
            </p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-800 bg-slate-900/80 p-0.5">
            <button
              onClick={() => {
                setActiveTab("pipeline");
                playHapticSound("click");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                activeTab === "pipeline"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="h-3.5 w-3.5" /> Interactive Pipeline
            </button>
            <button
              onClick={() => {
                setActiveTab("mdx");
                playHapticSound("click");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                activeTab === "mdx"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileCode className="h-3.5 w-3.5" /> Declarative HAProxy Spec
            </button>
          </div>
        </div>
      </div>

      {activeTab === "pipeline" ? (
        <>
          {/* Hybrid Motion-Graphics Visualizer Component */}
          <div className="mb-6">
            <ScalabilityHybridVisualizer onTimelineSync={handleTimelineSync} externalStep={currentStep} />
          </div>

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
                  const nextIdx = currentStep < STAGES.length ? currentStep : 0;
                  executeStage(nextIdx);
                }}
                disabled={simState === "running" || simState === "approval"}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-[11px] font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition"
              >
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                {currentStep === 0
                  ? "Execute Stage 1"
                  : currentStep < STAGES.length
                  ? `Step to Stage ${currentStep + 1}`
                  : "Re-run"}
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
                <span className="text-slate-200 font-bold">192.168.10.100 (HAProxy VIP)</span>
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

          {/* SRE Approval Gate Alert Box */}
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
                      <Check className="h-4 w-4" /> Authorize & Inject Fault
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

          {/* Grid Layout: Execution Stages & Live Terminal Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider px-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" /> Execution Stages
                </span>
                <span>
                  {currentStep}/{STAGES.length}
                </span>
              </div>

              {STAGES.map((stg, idx) => {
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
                        ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50"
                        : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-slate-700" />
                        )}
                        <span className="font-bold text-slate-200">
                          0{idx + 1}. {stg.name}
                        </span>
                      </div>
                      {stg.requiresApproval && (
                        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20">
                          GATE
                        </span>
                      )}
                    </div>
                    <div className="mt-2 rounded bg-black/60 p-2 font-mono text-[10px] text-slate-400 truncate border border-slate-800/80">
                      $ {stg.command}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Stream */}
            <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-800 bg-slate-950 shadow-inner overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-bold text-slate-300">sre-root@technhit-cluster-bastion: ~</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SESSION LIVE</span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto max-h-[360px] space-y-2 font-mono text-[11px] select-text">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 select-none text-[10px] pt-0.5">{log.timestamp}</span>
                    <span
                      className={`break-all ${
                        log.type === "command"
                          ? "text-cyan-300 font-bold"
                          : log.type === "success"
                          ? "text-emerald-400 font-bold"
                          : log.type === "error"
                          ? "text-red-400 font-bold"
                          : log.type === "gate"
                          ? "text-amber-400 font-bold"
                          : log.type === "mcp"
                          ? "text-purple-400"
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
        /* Declarative HAProxy Spec */
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-200 uppercase tracking-wider">
              HAProxy Production Cluster Configuration (/etc/haproxy/haproxy.cfg)
            </span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30">
              L7 LOAD BALANCER
            </span>
          </div>
          <pre className="p-4 rounded-lg bg-black text-cyan-300 text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`frontend http_ingress
    bind *:80
    mode http
    default_backend cluster_app_nodes

backend cluster_app_nodes
    mode http
    balance roundrobin
    option httpchk GET /health HTTP/1.1\\r\\nHost:\\ localhost
    http-check expect status 200

    server app-node-01 192.168.10.101:80 check inter 2000ms fall 3 rise 2 weight 100
    server app-node-02 192.168.10.102:80 check inter 2000ms fall 3 rise 2 weight 100
    server app-node-03 192.168.10.103:80 check inter 2000ms fall 3 rise 2 weight 100
    server app-node-04 192.168.10.104:80 check inter 2000ms fall 3 rise 2 weight 100`}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ScalabilityWorkflowSimulator;
