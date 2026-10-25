"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Post } from "@/lib/posts";
import { playHapticSound, awardOperativeXp } from "@/lib/operative-store";
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
  GitBranch,
  Layers,
  Sparkles,
  FileCode,
  Check,
  FastForward,
  Server,
  Database,
  ArrowRight,
  ShieldAlert,
  Code2,
  ExternalLink,
  Zap,
} from "lucide-react";

interface AgenticWorkflowSimulatorProps {
  post: Post;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "command" | "mcp" | "error" | "success" | "heal" | "gate";
  text: string;
}

export function AgenticWorkflowSimulator({ post }: AgenticWorkflowSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "mdx">("pipeline");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simState, setSimState] = useState<"idle" | "running" | "healing" | "approval" | "completed">("idle");
  const [approvalDecision, setApprovalDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [healingCycles, setHealingCycles] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init",
      timestamp: "14:32:00.102",
      type: "info",
      text: "[SYSTEM] Antigravity Agent Runtime initialized. Environment: TypeScript Monorepo (pnpm).",
    },
    {
      id: "init-mcp",
      timestamp: "14:32:00.180",
      type: "mcp",
      text: "[MCP:BRIDGE] Registered toolservers: mcp:fs, mcp:terminal, mcp:git, mcp:docker, mcp:mysql-cluster.",
    },
    {
      id: "init-ready",
      timestamp: "14:32:00.220",
      type: "info",
      text: "[STANDBY] Target Objective loaded: 'Fix MySQL client connection pool exhaustion during Corosync VIP failover'.",
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

  // Step 1: Reconnaissance
  const runStep1 = () => {
    setSimState("running");
    setCurrentStep(1);
    playHapticSound("click");
    addLog("command", "task:reconnaissance ▶ Agent: Planner");
    addLog("mcp", "[mcp:fs] list_directory path='packages/' depth=2");
    addLog("info", "Discovered monorepo workspace: @technhit/core, @technhit/api-gateway, @technhit/db-pool.");
    addLog("mcp", "[mcp:fs] search_code pattern='createPool|getConnection' path='packages/db-pool'");
    addLog("info", "Found cluster connector at packages/db-pool/src/cluster-connector.ts:42.");
    addLog("mcp", "[mcp:docker] inspect_container id='mysql-drbd-vip'");
    addLog("info", "Container 'mysql-drbd-vip' active on 10.10.10.100:3306. Health check probe verified.");
    addLog("success", "✓ Reconnaissance complete. Formulated 4-point execution plan.");
    setSimState("idle");
  };

  // Step 2: Implementation & Code Modification
  const runStep2 = () => {
    setSimState("running");
    setCurrentStep(2);
    playHapticSound("click");
    addLog("command", "task:implementation ▶ Agent: Coder");
    addLog("mcp", "[mcp:git] checkout_branch branch='feature/ha-mysql-proxy-reconnect'");
    addLog("info", "Created and switched to isolated branch 'feature/ha-mysql-proxy-reconnect'.");
    addLog("mcp", "[mcp:fs] read_file path='packages/db-pool/src/cluster-connector.ts'");
    addLog("mcp", "[mcp:fs] write_patch path='packages/db-pool/src/cluster-connector.ts'");
    addLog("info", "Applied initial connection retry interceptor (+34 lines).");
    addLog("success", "✓ Implementation applied. Test harness ready for verification.");
    setSimState("idle");
  };

  // Step 3: Verification & Automated Self-Healing Loop
  const runStep3 = (triggerHealing = true) => {
    setSimState("running");
    setCurrentStep(3);
    playHapticSound("click");
    addLog("command", "task:verification ▶ Agent: Evaluator");
    addLog("mcp", "[mcp:terminal] exec 'pnpm --filter @technhit/db-pool test:integration'");
    addLog("info", "Spawning integration test runner against Corosync VIP (10.10.10.100)...");

    if (triggerHealing && healingCycles === 0) {
      setTimeout(() => {
        addLog("error", "FAIL: packages/db-pool/test/failover.spec.ts:88");
        addLog("error", "Error: ConnectionPoolExhausted: Node 10.10.10.100 refused connection during 8.2s STONITH window.");
        addLog("error", "Exit code: 1. Automated regression detected.");
        setSimState("healing");
        setHealingCycles(1);
        playHapticSound("error");

        setTimeout(() => {
          addLog("heal", "⚡ [SELF-HEALING CYCLE 1/3] Planner Agent triggered auto-correct loop.");
          addLog("heal", "Analyzing failure stack trace: Interceptor lacked exponential backoff with jitter.");
          addLog("mcp", "[mcp:fs] write_patch path='packages/db-pool/src/cluster-connector.ts'");
          addLog("info", "Auto-patched cluster-connector.ts: Added jittered backoff [100ms..2500ms, maxRetries: 8].");
          addLog("mcp", "[mcp:terminal] exec 'pnpm --filter @technhit/db-pool test:integration'");

          setTimeout(() => {
            addLog("success", "✓ test/failover.spec.ts: 16 passed, 0 failed (3.42s).");
            addLog("mcp", "[mcp:mysql-cluster] execute 'SELECT @@hostname, @@read_only;'");
            addLog("info", "Database query routed to Standby db-node-02 (now Primary). Read/write confirmed.");
            addLog("success", "✓ Exit code: 0. All 16 integration checks PASS.");
            setSimState("idle");
            playHapticSound("success");
          }, 1200);
        }, 1500);
      }, 1000);
    } else {
      setTimeout(() => {
        addLog("success", "✓ test/failover.spec.ts: 16 passed, 0 failed (2.81s).");
        addLog("success", "✓ Exit code: 0. Verification PASS.");
        setSimState("idle");
      }, 800);
    }
  };

  // Step 4: Human-in-the-Loop Review Gate
  const runStep4 = () => {
    setCurrentStep(4);
    setSimState("approval");
    playHapticSound("flip");
    addLog("gate", "🛑 <ApprovalGate id='human-review'> reached.");
    addLog("gate", "PAUSED: Autonomous pipeline halted awaiting human authorization prior to git commit.");
  };

  const handleApproveGate = () => {
    setApprovalDecision("approved");
    setSimState("idle");
    playHapticSound("success");
    awardOperativeXp(50, "Human-in-the-Loop Approval Granted");
    addLog("success", "✓ Human Operator APPROVED diff for packages/db-pool/src/cluster-connector.ts.");
    runStep5();
  };

  const handleRejectGate = () => {
    setApprovalDecision("rejected");
    setSimState("idle");
    playHapticSound("error");
    addLog("error", "✗ Human Operator REJECTED diff. Requesting alternative patch strategy.");
    addLog("heal", "Looping back to Planner Agent for alternative architectural revision...");
  };

  // Step 5: Final Validation & Artifact Generation
  const runStep5 = () => {
    setSimState("running");
    setCurrentStep(5);
    playHapticSound("click");
    addLog("command", "task:finalization ▶ Agent: Release");
    addLog("mcp", "[mcp:terminal] exec 'pnpm lint && pnpm typecheck'");
    addLog("info", "Biome linter clean. TypeScript compilation exited 0.");
    addLog("mcp", "[mcp:git] stage_files files=['packages/db-pool/src/cluster-connector.ts', 'packages/db-pool/test/failover.spec.ts']");
    addLog("mcp", "[mcp:git] commit message='fix(db-pool): implement exponential backoff during Corosync VIP failover transition'");
    addLog("mcp", "[mcp:git] push_branch remote='origin' branch='feature/ha-mysql-proxy-reconnect'");
    addLog("success", "✓ Git branch pushed. Pull Request #142 drafted with zero-downtime failover verification report.");
    setSimState("completed");
    awardOperativeXp(100, "Full Agentic Workflow Simulation Completed");
    playHapticSound("levelup");
  };

  // Auto-Pilot execution
  const runAutoPilot = () => {
    resetSimulation();
    setTimeout(() => {
      runStep1();
      setTimeout(() => {
        runStep2();
        setTimeout(() => {
          runStep3(true);
          setTimeout(() => {
            runStep4();
          }, 5500);
        }, 1200);
      }, 1200);
    }, 400);
  };

  const resetSimulation = () => {
    playHapticSound("click");
    setCurrentStep(0);
    setSimState("idle");
    setApprovalDecision("pending");
    setHealingCycles(0);
    setLogs([
      {
        id: "reset",
        timestamp: "14:35:00.001",
        type: "info",
        text: "[SYSTEM] Antigravity Simulator reset. Ready for execution.",
      },
      {
        id: "reset-mcp",
        timestamp: "14:35:00.040",
        type: "mcp",
        text: "[MCP:BRIDGE] Registered toolservers: mcp:fs, mcp:terminal, mcp:git, mcp:docker, mcp:mysql-cluster.",
      },
    ]);
  };

  const mdxSpecificationCode = `---
name: "Autonomous Full-Stack Feature & Refactoring Workflow"
description: "End-to-end task decomposition, implementation, testing, and self-healing workflow"
repository_type: "monorepo"
package_manager: "pnpm"
framework: "TypeScript / Node.js 22 LTS"
tools:
  - "mcp:fs"
  - "mcp:terminal"
  - "mcp:git"
  - "mcp:docker"
  - "mcp:mysql-cluster"
parameters:
  target_issue:
    type: string
    description: "MySQL client pool exhaustion during Corosync VIP failover transition"
    required: true
  max_healing_cycles:
    type: number
    default: 3
  auto_heal:
    type: boolean
    default: true
---

# Agent Execution Pipeline

<Context>
You are an autonomous senior software engineer and systems architect executing within the Google Antigravity environment.
Your task is to take the requested issue, inspect the local TypeScript monorepo, execute atomic changes, verify functionality via local containerized test harnesses, and prepare a verified Git branch ready for peer review.

Target Objective:
{{ parameters.target_issue }}
</Context>

---

## Step 1: Workspace Reconnaissance & Monorepo Graph Analysis

<Task id="reconnaissance" agent="planner">
1. Run structural analysis on the monorepo:
   - Parse \`pnpm-workspace.yaml\` and turbo/nx graph.
   - Target package: \`packages/db-pool\` and dependent \`apps/api-gateway\`.
2. Inspect external test runners via MCP:
   - Call \`mcp:docker.inspect_container\` for MySQL Corosync VIP node (\`10.10.10.100\`).
   - Query current replication status via \`mcp:mysql-cluster\`.
3. Output atomic execution plan before code mutations.
</Task>

---

## Step 2: Implementation & Branch Isolation

<Task id="implementation" agent="coder" dependsOn="reconnaissance">
1. Create dedicated feature branch:
   \`\`\`bash
   git checkout -b feature/ha-mysql-proxy-reconnect
   \`\`\`
2. Apply changes atomically using \`mcp:fs\`:
   - Enhance \`cluster-connector.ts\` with reconnect interceptor and health check ping.
   - Implement integration test in \`packages/db-pool/test/failover.spec.ts\`.
   - Strictly prohibit mock shortcuts or temporary TODO stubs.
</Task>

---

## Step 3: Verification & Automated Self-Healing Loop

<Task id="verification" agent="evaluator" dependsOn="implementation">
1. Run integration test harness via MCP terminal:
   \`\`\`bash
   pnpm --filter @technhit/db-pool test:integration
   \`\`\`
2. Autonomous Self-Healing Evaluation:
   - IF exit_code != 0:
     - Capture stderr and container packet logs.
     - Decrement \`max_healing_cycles\` (remaining: \${cycles}).
     - Re-prompt Planner Agent to formulate corrective code patch.
     - Apply patch via \`mcp:fs\` and re-execute test suite.
   - IF exit_code == 0:
     - Advance immediately to Step 4.
</Task>

---

## Step 4: Human-in-the-Loop Review Gate

<ApprovalGate id="human-review" dependsOn="verification">
  <Condition>
    Test suite passed (exit code 0). Review diff and authorized branch push.
  </Condition>
  <Prompt>
    Human operator must verify that retry backoff does not violate SLA limits before committing.
  </Prompt>
</ApprovalGate>

---

## Step 5: Final Validation & Artifact Generation

<Task id="finalization" agent="release" dependsOn="human-review">
1. Execute repository-wide validation:
   \`\`\`bash
   pnpm lint && pnpm typecheck
   \`\`\`
2. Commit and stage files atomically via \`mcp:git\`:
   \`\`\`bash
   git commit -m "fix(db-pool): implement exponential backoff during Corosync VIP failover transition"
   git push origin feature/ha-mysql-proxy-reconnect
   \`\`\`
3. Publish verified pull request with failover latency report.
</Task>`;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8 animate-fadeIn">
      {/* Simulation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-display text-[#FF5400] text-xl tracking-widest">SIMULATOR</span>
            <span className="h-px w-8 bg-[#FF5400]/60" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
              AGENTIC RECIPE RUNTIME · GOOGLE ANTIGRAVITY MCP
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-zinc-100 tracking-wide">
            Autonomous Feature Refactoring &amp; Self-Healing Console
          </h1>
          <p className="text-zinc-400 text-sm font-body max-w-3xl mt-1">
            Simulate a production-grade multi-agent execution pipeline in a TypeScript/Node.js monorepo with external Docker/MySQL MCP servers and an interactive Human-in-the-Loop approval gate.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={runAutoPilot}
            disabled={simState === "running" || simState === "healing"}
            className="px-5 py-2.5 rounded bg-[#FF5400] hover:bg-amber-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,84,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RUN AUTO-PILOT</span>
          </button>

          <button
            onClick={() => {
              if (currentStep === 0) runStep1();
              else if (currentStep === 1) runStep2();
              else if (currentStep === 2) runStep3(true);
              else if (currentStep === 3) runStep4();
              else if (currentStep === 4) runStep5();
            }}
            disabled={simState === "running" || simState === "healing" || simState === "approval" || currentStep >= 5}
            className="px-4 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>STEP FORWARD ({currentStep}/5)</span>
          </button>

          <button
            onClick={resetSimulation}
            className="px-4 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Simulator Console */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): MDX Recipe & Pipeline State */}
        <div className="lg:col-span-5 space-y-4">
          {/* Navigation Tabs (Pipeline View vs Raw MDX) */}
          <div className="flex items-center justify-between bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-mono text-xs">
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex-1 py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
                activeTab === "pipeline"
                  ? "bg-zinc-800 text-zinc-100 font-bold"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>PIPELINE STEPS</span>
            </button>
            <button
              onClick={() => setActiveTab("mdx")}
              className={`flex-1 py-1.5 px-3 rounded flex items-center justify-center gap-2 transition-all ${
                activeTab === "mdx"
                  ? "bg-zinc-800 text-zinc-100 font-bold"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>RAW MDX RECIPE</span>
            </button>
          </div>

          {activeTab === "pipeline" ? (
            /* 5-Step Pipeline Progress Cards */
            <div className="space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 1
                    ? "bg-cyan-950/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : currentStep > 1
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                      STEP 01
                    </span>
                    <span className="font-bold text-zinc-200">Reconnaissance &amp; Graph</span>
                  </div>
                  {currentStep > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 1 ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Structural analysis of monorepo packages and Docker/MySQL health checks.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <Bot className="w-3 h-3" /> Planner Agent
                  </span>
                  <span>Tools: mcp:fs, mcp:docker</span>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 2
                    ? "bg-blue-950/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : currentStep > 2
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-bold">
                      STEP 02
                    </span>
                    <span className="font-bold text-zinc-200">Implementation &amp; Branch</span>
                  </div>
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 2 ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Create isolated feature branch and patch client cluster-connector retry logic.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Cpu className="w-3 h-3" /> Coder Agent
                  </span>
                  <span>Tools: mcp:git, mcp:fs</span>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 3
                    ? "bg-amber-950/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : currentStep > 3
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
                      STEP 03
                    </span>
                    <span className="font-bold text-zinc-200">Self-Healing Test Harness</span>
                  </div>
                  {currentStep > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 3 ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Execute Vitest against HA cluster. Auto-correct regressions upon exit code != 0.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <ShieldCheck className="w-3 h-3" /> Evaluator Agent
                  </span>
                  <span>Cycles: {healingCycles}/3 Allowed</span>
                </div>
              </div>

              {/* Step 4 (Approval Gate) */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 4
                    ? "bg-rose-950/20 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                    : currentStep > 4
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-500/40 text-rose-300 font-bold">
                      STEP 04
                    </span>
                    <span className="font-bold text-zinc-200">Human Approval Gate</span>
                  </div>
                  {currentStep > 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 4 ? (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Human-in-the-Loop authorization checkpoint before committing code to git.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-3 h-3" /> ApprovalGate
                  </span>
                  <span>Decision: {approvalDecision.toUpperCase()}</span>
                </div>
              </div>

              {/* Step 5 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 5
                    ? "bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                      STEP 05
                    </span>
                    <span className="font-bold text-zinc-200">Validation &amp; PR Generation</span>
                  </div>
                  {currentStep === 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Biome linting, TypeScript compile pass, conventional git commit and PR creation.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <GitBranch className="w-3 h-3" /> Release Agent
                  </span>
                  <span>Artifact: PR #142 Ready</span>
                </div>
              </div>
            </div>
          ) : (
            /* Raw MDX Recipe Viewer */
            <div className="p-4 rounded-xl bg-[#0d1117] border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-y-auto max-h-[560px] slim-scroll">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[10px] text-zinc-500">
                <span>workflow.mdx (TypeScript Monorepo Adapted)</span>
                <span className="text-purple-400">YAML + MDX Valid</span>
              </div>
              <pre className="whitespace-pre font-mono text-[11px] text-zinc-300">
                {mdxSpecificationCode}
              </pre>
            </div>
          )}

          {/* Connected MCP Tool Servers Panel */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-zinc-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                ACTIVE MCP TOOLSERVERS
              </span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 5 ONLINE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>mcp:mysql-cluster</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <Cpu className="w-3 h-3 text-blue-400" />
                <span>mcp:docker</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>mcp:terminal</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <GitBranch className="w-3 h-3 text-purple-400" />
                <span>mcp:git</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Terminal Stream & Live Console */}
        <div className="lg:col-span-7 bg-[#050609] border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xl relative">
          {/* Terminal Titlebar */}
          <div className="bg-[#0d1117] px-4 py-3 border-b border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-bold text-zinc-200">agent@antigravity-mcp: ~/monorepo/packages/db-pool</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className={`w-2 h-2 rounded-full ${simState === "running" ? "bg-cyan-400 animate-pulse" : simState === "healing" ? "bg-amber-400 animate-ping" : simState === "approval" ? "bg-rose-400 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-zinc-400 uppercase font-bold">{simState}</span>
            </div>
          </div>

          {/* Terminal Console Stream */}
          <div className="p-5 font-mono text-xs space-y-2 overflow-y-auto max-h-[500px] min-h-[460px] slim-scroll bg-[#050609]">
            {logs.map((log) => {
              let color = "text-zinc-400";
              let badge = null;

              if (log.type === "command") {
                color = "text-cyan-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 mr-1.5">EXEC</span>;
              } else if (log.type === "mcp") {
                color = "text-purple-300";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800 text-purple-300 mr-1.5">MCP</span>;
              } else if (log.type === "error") {
                color = "text-rose-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 mr-1.5">STDERR</span>;
              } else if (log.type === "success") {
                color = "text-emerald-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 mr-1.5">PASS</span>;
              } else if (log.type === "heal") {
                color = "text-amber-300 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800 text-amber-300 mr-1.5">HEAL</span>;
              } else if (log.type === "gate") {
                color = "text-rose-300 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 mr-1.5">GATE</span>;
              }

              return (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-600 text-[10px] select-none pt-0.5">{log.timestamp}</span>
                  <div className={`flex-1 break-all ${color}`}>
                    {badge}
                    {log.text}
                  </div>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Human-in-the-Loop <ApprovalGate> Drawer */}
          {simState === "approval" && (
            <div className="p-5 bg-gradient-to-t from-black via-rose-950/20 to-black border-t border-rose-500/50 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                  <span className="font-display text-lg text-white tracking-wide">
                    &lt;ApprovalGate id=&quot;human-review&quot;&gt;
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold">
                  ACTION REQUIRED
                </span>
              </div>

              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs space-y-2">
                <div className="text-zinc-400 flex items-center justify-between pb-1 border-b border-zinc-800 text-[11px]">
                  <span>Target: packages/db-pool/src/cluster-connector.ts</span>
                  <span className="text-emerald-400">+28 / -4 lines</span>
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                  <span className="text-emerald-400">+ const jitter = Math.floor(Math.random() * 200);</span><br />
                  <span className="text-emerald-400">+ await delay(Math.min(100 * Math.pow(1.5, attempt) + jitter, 2500));</span><br />
                  <span className="text-emerald-400">+ return pool.getConnection(); // Auto-reconnect to Standby node-02</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-body">
                The auto-healing cycle has verified 16/16 Vitest passes against the Corosync failover container. Review the exponential backoff changes above before allowing the agent to commit and push.
              </p>

              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  onClick={handleApproveGate}
                  className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>AUTHORIZE &amp; COMMIT</span>
                </button>
                <button
                  onClick={handleRejectGate}
                  className="px-5 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/40 flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT &amp; REQUEST REVISION</span>
                </button>
              </div>
            </div>
          )}

          {/* Terminal Footer Status Bar */}
          <div className="bg-[#0d1117] px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-4">
              <span>STATUS: <strong className="text-white">{simState.toUpperCase()}</strong></span>
              <span>HEALING CYCLES: <strong className="text-amber-400">{healingCycles}/3</strong></span>
            </div>
            {currentStep === 5 && simState === "completed" && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> PR #142 MERGE-READY
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
