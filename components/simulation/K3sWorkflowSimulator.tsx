"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "@/lib/posts";
import { playHapticSound, awardOperativeXp } from "@/lib/operative-store";
import { K3sEdgeClusterVisualizer } from "@/components/simulation/K3sEdgeClusterVisualizer";
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
  Power,
  WifiOff,
  Radio,
} from "lucide-react";

interface K3sWorkflowSimulatorProps {
  post: Post;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "command" | "mcp" | "error" | "success" | "spool" | "gate";
  text: string;
}

export function K3sWorkflowSimulator({ post }: K3sWorkflowSimulatorProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "mdx">("pipeline");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simState, setSimState] = useState<"idle" | "running" | "partitioned" | "approval" | "completed">("idle");
  const [approvalDecision, setApprovalDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [activeMaster, setActiveMaster] = useState<string>("edge-control-01");
  const [datastoreState, setDatastoreState] = useState<"Uninitialized" | "SQLite (WAL)" | "Kine Ready" | "Quorum Locked">("Uninitialized");
  const [meshCniState, setMeshCniState] = useState<"Down" | "WireGuard Native" | "Encrypted Mesh" | "Partitioned">("Down");
  const [spoolState, setSpoolState] = useState<"Direct Stream" | "Local Buffer" | "Spooling (NVMe)" | "Re-syncing">("Direct Stream");

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init",
      timestamp: "16:00:00.104",
      type: "info",
      text: "[SYSTEM] Antigravity Edge Orchestrator online. Target: 3-Node Low-Power ARM K3s Micro-Cluster.",
    },
    {
      id: "init-mcp",
      timestamp: "16:00:00.180",
      type: "mcp",
      text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:fs, mcp:network. SSH keys verified across ARM SBCs.",
    },
    {
      id: "init-ready",
      timestamp: "16:00:00.220",
      type: "info",
      text: "[STANDBY] Topology Target: Master edge-control-01 (10.10.10.11), Worker edge-worker-01 (RPi 5), Worker edge-worker-02 (RK3588).",
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

  // Two-way interactive sync from 3D motion-graphics timeline scrubber
  const handleTimelineSync = useCallback((time: number, sceneIndex: number) => {
    if (sceneIndex === 0) {
      setActiveMaster("edge-control-01");
      setDatastoreState("SQLite (WAL)");
      setMeshCniState("WireGuard Native");
      setSpoolState("Direct Stream");
      setCurrentStep(1);
    } else if (sceneIndex === 1) {
      setMeshCniState("Partitioned");
      setSimState("partitioned");
      setCurrentStep(3);
    } else if (sceneIndex === 2) {
      setMeshCniState("Partitioned");
      setSpoolState("Spooling (NVMe)");
      setCurrentStep(4);
    } else if (sceneIndex === 3) {
      setMeshCniState("Encrypted Mesh");
      setSpoolState("Direct Stream");
      setSimState("completed");
      setCurrentStep(5);
    }
  }, []);

  // Step 1: Pre-Flight ARM Kernel Audit
  const runStep1 = () => {
    setSimState("running");
    setCurrentStep(1);
    playHapticSound("click");
    addLog("command", "task:arm_kernel_prerequisites ▶ Agent: edge_infra_planner");
    addLog("mcp", "[mcp:terminal] exec 'grep -E \"cgroup_enable=cpuset cgroup_memory=1\" /boot/firmware/cmdline.txt'");
    addLog("info", "ARM64 cgroups v2 memory controller confirmed active in bootloader.");
    addLog("mcp", "[mcp:terminal] exec 'swapon --show && zramctl'");
    addLog("info", "Physical swap disabled. ZRAM lz4 compressed RAM pool active (1.8GB @ 3.4:1 ratio).");
    addLog("mcp", "[mcp:terminal] exec 'sysctl net.ipv4.ip_forward net.bridge.bridge-nf-call-iptables'");
    addLog("info", "Kernel packet forwarding and bridge netfilter enabled.");
    addLog("mcp", "[mcp:terminal] exec 'uname -m && lscpu | grep Architecture'");
    addLog("info", "Hardware verified: aarch64 (Cortex-A76 / RK3588). RAM baseline: 3.8GB free.");
    addLog("success", "✓ ARM Pre-Flight Passed. Zero swap contention, cgroups verified for container limits.");
    setSimState("idle");
  };

  // Step 2: Kine/SQLite K3s Server Bootstrap
  const runStep2 = () => {
    setSimState("running");
    setCurrentStep(2);
    playHapticSound("click");
    addLog("command", "task:bootstrap_k3s_control_plane ▶ Agent: control_plane_architect");
    addLog("mcp", "[mcp:fs] write_file path='/etc/rancher/k3s/config.yaml'");
    addLog("info", "Written K3s config: disable traefik/servicelb, flannel-backend=wireguard-native, sqlite WAL mode.");
    addLog("mcp", "[mcp:terminal] exec 'curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC=\"server\" sh -'");
    addLog("info", "Starting k3s.service with embedded Kine translation engine...");

    setTimeout(() => {
      addLog("mcp", "[mcp:terminal] exec 'sqlite3 /var/lib/rancher/k3s/server/db/state.db \"PRAGMA journal_mode; PRAGMA synchronous;\"'");
      addLog("info", "SQLite Engine verified: journal_mode=WAL | synchronous=NORMAL (flash media wear mitigated).");
      addLog("mcp", "[mcp:terminal] exec 'kubectl get nodes -o wide'");
      addLog("success", "✓ Control Plane online: edge-control-01 (v1.31.2+k3s1, Ready, RAM footprint: 480MB).");
      setDatastoreState("SQLite (WAL)");
      setSimState("idle");
    }, 1200);
  };

  // Step 3: WireGuard Edge Worker Onboarding
  const runStep3 = () => {
    setSimState("running");
    setCurrentStep(3);
    playHapticSound("click");
    addLog("command", "task:join_arm_workers ▶ Agent: mesh_network_engineer");
    addLog("mcp", "[mcp:terminal] exec 'cat /var/lib/rancher/k3s/server/node-token' on edge-control-01");
    addLog("info", "Extracted cryptographically signed node token (K10...::server:...).");
    addLog("mcp", "[mcp:network] verify_port host='10.10.10.11' port=51820 proto='udp'");
    addLog("info", "WireGuard UDP port 51820 open. MTU calibrated to 1420 bytes for cellular traversal.");
    addLog("mcp", "[mcp:terminal] exec 'curl -sfL https://get.k3s.io | K3S_URL=https://10.10.10.11:6443 sh -' on edge-worker-01");
    addLog("mcp", "[mcp:terminal] exec 'curl -sfL https://get.k3s.io | K3S_URL=https://10.10.10.11:6443 sh -' on edge-worker-02");

    setTimeout(() => {
      addLog("mcp", "[mcp:terminal] exec 'wg show flannel-wg'");
      addLog("info", "Kernel WireGuard interface flannel-wg up: peers connected with ChaCha20-Poly1305 handshakes.");
      addLog("mcp", "[mcp:terminal] exec 'kubectl get nodes'");
      addLog("success", "✓ 3-Node Cluster Mesh established: edge-control-01, edge-worker-01 (RPi 5), edge-worker-02 (RK3588).");
      setMeshCniState("WireGuard Native");
      setSimState("idle");
    }, 1400);
  };

  // Step 4: Approval Gate - Partition Tolerance & Disk Spool Policy
  const runStep4 = () => {
    setCurrentStep(4);
    setSimState("approval");
    playHapticSound("flip");
    addLog("gate", "🛑 <ApprovalGate id='edge-partition-toleration-policy'> reached.");
    addLog("gate", "PAUSED: Eviction delay tuned to 15m (900s). Local Vector NVMe spool buffer formulated. Awaiting operator authorization.");
  };

  const handleApproveGate = () => {
    setApprovalDecision("approved");
    setSimState("running");
    playHapticSound("success");
    awardOperativeXp(50, "Edge Partition Policy Authorized");
    addLog("success", "✓ Human Operator APPROVED partition toleration & NVMe spooling policy.");

    addLog("command", "task:apply_edge_manifests ▶ Agent: edge_sre_operator");
    addLog("mcp", "[mcp:fs] write_file path='/etc/vector/vector.yaml'");
    addLog("info", "Vector telemetry collector deployed: disk buffer enabled on /var/log/vector/spool (max_size: 50GiB).");
    addLog("mcp", "[mcp:terminal] exec 'kubectl apply -f https://raw.githubusercontent.com/nhit/edge-manifests/main/telemetry-agent.yaml'");
    addLog("info", "DaemonSet edge-telemetry deployed with tolerations: node.kubernetes.io/unreachable (900s).");
    addLog("success", "✓ Edge resiliency armed. Workers will survive WAN cuts without pod eviction for up to 15 minutes.");
    setSimState("idle");
    runStep5();
  };

  const handleRejectGate = () => {
    setApprovalDecision("rejected");
    setSimState("idle");
    playHapticSound("error");
    addLog("error", "✗ Human Operator REJECTED policy. Eviction window must be reviewed against SLA.");
  };

  // Step 5: Severance & Autonomous Survivability Drill
  const runStep5 = () => {
    setSimState("partitioned");
    setCurrentStep(5);
    playHapticSound("click");
    addLog("command", "task:simulate_wan_severance ▶ Agent: edge_chaos_evaluator");
    addLog("info", "Injecting simulated WAN failure: cutting upstream cellular/backhaul link to edge-worker-01...");

    setTimeout(() => {
      addLog("error", "[KUBE-CONTROLLER] Heartbeat missed from edge-worker-01 (lease renew timeout > 40s).");
      addLog("spool", "⚡ [NODE-LIFECYCLE] Node marked NotReady, but pod eviction INHIBITED (900s toleration active).");
      addLog("mcp", "[mcp:terminal] exec 'crictl ps' on edge-worker-01 via local serial console");
      addLog("info", "Local containerd status: Pod telemetry-producer RUNNING autonomously without master communication.");
      addLog("spool", "📦 [VECTOR-BUFFER] Telemetry sink unreachable: spooling 1,200 events/sec to local NVMe SSD.");
      setSpoolState("Spooling (NVMe)");
      setMeshCniState("Partitioned");

      setTimeout(() => {
        addLog("info", "[CHAOS] Restoring upstream WAN link... Re-establishing WireGuard tunnel.");
        addLog("mcp", "[mcp:terminal] exec 'wg show flannel-wg' on edge-control-01");
        addLog("info", "WireGuard handshake completed in 84ms. Node edge-worker-01 status: Ready.");
        addLog("spool", "🚀 [VECTOR-DRAIN] Flushed 72,000 buffered telemetry records to central TimescaleDB with 0 data loss.");
        setSpoolState("Direct Stream");
        setMeshCniState("Encrypted Mesh");
        addLog("success", "✓ Edge Autonomous Resilience Attested. Total disconnect: 60s, Pod downtime: 0s, Data loss: 0%.");
        setSimState("completed");
        awardOperativeXp(100, "Edge Micro-Cluster Validation Completed");
        playHapticSound("levelup");
      }, 2000);
    }, 1200);
  };

  // Auto-Pilot execution
  const runAutoPilot = () => {
    resetSimulation();
    setTimeout(() => {
      runStep1();
      setTimeout(() => {
        runStep2();
        setTimeout(() => {
          runStep3();
          setTimeout(() => {
            runStep4();
          }, 3500);
        }, 3200);
      }, 2500);
    }, 400);
  };

  const resetSimulation = () => {
    playHapticSound("click");
    setCurrentStep(0);
    setSimState("idle");
    setApprovalDecision("pending");
    setActiveMaster("edge-control-01");
    setDatastoreState("Uninitialized");
    setMeshCniState("Down");
    setSpoolState("Direct Stream");
    setLogs([
      {
        id: "reset",
        timestamp: "16:01:00.001",
        type: "info",
        text: "[SYSTEM] Antigravity Edge Orchestrator reset. Cluster state restored to clean initial baseline.",
      },
      {
        id: "reset-mcp",
        timestamp: "16:01:00.040",
        type: "mcp",
        text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:fs, mcp:network. SBC nodes ready for bootstrap.",
      },
    ]);
  };

  const mdxSpecificationCode = `---
name: "Deploy K3s Across Low-Power ARM Nodes with Disconnected Autonomy"
description: "End-to-end automated deployment, SQLite/Kine control plane, WireGuard-native CNI, and offline telemetry spooling"
tools:
  - "mcp:terminal"
  - "mcp:fs"
  - "mcp:network"
parameters:
  master_node_ip:
    type: string
    description: "IP address of control node (e.g., 10.10.10.11)"
    required: true
  worker_nodes:
    type: array
    description: "List of worker SBC IPs"
    default: ["10.10.10.12", "10.10.10.13"]
  cni_backend:
    type: string
    description: "Flannel backend engine"
    default: "wireguard-native"
  datastore_engine:
    type: string
    description: "Kine backed datastore"
    default: "sqlite-wal"
  not_ready_toleration_seconds:
    type: number
    description: "Pod eviction delay on WAN disconnect"
    default: 900
---

# ARM Edge Micro-Cluster Deployment Specification

<Context>
You are an autonomous Edge Systems Architect inside Google Antigravity.
Your objective is to provision and validate a low-power, 3-node K3s micro-cluster across ARM single-board computers (Raspberry Pi 5 / RK3588) that survives intermittent network partitions, enforces WireGuard encryption across untrusted backhauls, and buffers telemetry to NVMe without data loss.

Control Node: {{ parameters.master_node_ip }}
Worker Nodes: {{ parameters.worker_nodes }}
CNI Mesh: {{ parameters.cni_backend }} (UDP: 51820)
Eviction Delay: {{ parameters.not_ready_toleration_seconds }}s (15 minutes)
</Context>

---

## Step 1: Pre-Flight ARM Kernel Audit

<Task id="arm_kernel_prerequisites" agent="edge_infra_planner">
1. Verify cgroups v2 memory controller in bootloader:
   \`\`\`bash
   grep -E 'cgroup_enable=cpuset cgroup_memory=1' /boot/firmware/cmdline.txt
   \`\`\`
2. Verify ZRAM lz4 compression enabled and physical swap disabled.
3. Validate kernel IP forwarding (net.ipv4.ip_forward = 1).
</Task>

---

## Step 2: Kine/SQLite K3s Server Bootstrap

<Task id="bootstrap_k3s_control_plane" agent="control_plane_architect" dependsOn="arm_kernel_prerequisites">
1. Write \`/etc/rancher/k3s/config.yaml\`:
   - Disable unused monoliths: traefik, servicelb, local-storage.
   - Enforce flannel backend: wireguard-native.
2. Launch K3s server with embedded SQLite engine in WAL mode:
   \`\`\`bash
   curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server" sh -
   \`\`\`
3. Gate: Verify RAM usage < 512MB and SQLite WAL mode enabled.
</Task>

---

## Step 3: WireGuard Edge Worker Onboarding

<Task id="join_arm_workers" agent="mesh_network_engineer" dependsOn="bootstrap_k3s_control_plane">
1. Extract cluster registration token from \`/var/lib/rancher/k3s/server/node-token\`.
2. Ensure UDP port 51820 is reachable across edge subnets.
3. Join worker nodes via secure WireGuard mesh:
   \`\`\`bash
   curl -sfL https://get.k3s.io | K3S_URL=https://{{ parameters.master_node_ip }}:6443 K3S_TOKEN=$TOKEN sh -
   \`\`\`
4. Gate: \`wg show flannel-wg\` must verify active ChaCha20-Poly1305 handshakes.
</Task>

---

## Step 4: Approval Gate - Partition Tolerance & Disk Spool Policy

<ApprovalGate id="edge-partition-toleration-policy" dependsOn="join_arm_workers">
  <Condition>
    Nodes joined via WireGuard. Operator must sign off on 15-minute pod eviction delay and Vector NVMe buffer allocation.
  </Condition>
  <Prompt>
    Verify that 900s toleration and 50GiB NVMe spooling match edge compliance requirements.
  </Prompt>
</ApprovalGate>

<Task id="apply_edge_manifests" agent="edge_sre_operator" dependsOn="edge-partition-toleration-policy">
1. Deploy Vector DaemonSet with local disk spooling:
   - Buffer directory: \`/var/log/vector/spool\`
   - Max size: 50GiB, drop_oldest on overflow
2. Apply 900s unreachability tolerations to edge workloads.
</Task>

---

## Step 5: Severance & Autonomous Survivability Drill

<Task id="simulate_wan_severance" agent="edge_chaos_evaluator" dependsOn="apply_edge_manifests">
1. Sever upstream network connection to edge-worker-01.
2. Confirm worker marks NotReady but workloads remain Running.
3. Validate Vector buffers telemetry to local NVMe storage.
4. Restore network and confirm zero telemetry data loss.
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
              LOW-POWER ARM K3S MICRO-CLUSTER · DISCONNECTED AUTONOMY MCP
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-zinc-100 tracking-wide">
            Deploy K3s Across Low-Power ARM Nodes Console
          </h1>
          <p className="text-zinc-400 text-sm font-body max-w-3xl mt-1">
            Automated ARM SBC provisioning, SQLite/Kine lightweight control planes, Flannel WireGuard-native encryption, 15m partition tolerations, and offline telemetry spooling validation.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={runAutoPilot}
            disabled={simState === "running" || simState === "partitioned"}
            className="px-5 py-2.5 rounded bg-[#FF5400] hover:bg-amber-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,84,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>RUN AUTO-PILOT</span>
          </button>

          <button
            onClick={() => {
              if (currentStep === 0) runStep1();
              else if (currentStep === 1) runStep2();
              else if (currentStep === 2) runStep3();
              else if (currentStep === 3) runStep4();
              else if (currentStep === 4) runStep5();
            }}
            disabled={simState === "running" || simState === "partitioned" || simState === "approval" || currentStep >= 5}
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

      {/* Cinematic 3D Technical Motion-Graphics Theater */}
      <K3sEdgeClusterVisualizer onTimelineSync={handleTimelineSync} />

      {/* Cluster Status Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> CONTROL NODE
          </span>
          <span className="text-cyan-300 font-bold">{activeMaster}</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" /> DATASTORE
          </span>
          <span className="text-emerald-300 font-bold">{datastoreState}</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-purple-400" /> MESH CNI
          </span>
          <span className="text-purple-300 font-bold">{meshCniState}</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" /> TELEMETRY SPOOL
          </span>
          <span className="text-amber-300 font-bold">{spoolState}</span>
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
                    <span className="font-bold text-zinc-200">ARM Kernel &amp; cgroups Audit</span>
                  </div>
                  {currentStep > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 1 ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Verify cgroups v2 memory controller in bootloader, ZRAM lz4 compression, disable disk swap.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Bot className="w-3 h-3" /> edge_infra_planner
                  </span>
                  <span>Tools: mcp:terminal, mcp:fs</span>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 2
                    ? "bg-amber-950/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : currentStep > 2
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
                      STEP 02
                    </span>
                    <span className="font-bold text-zinc-200">Kine / SQLite Server Init</span>
                  </div>
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 2 ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Launch K3s server with SQLite WAL mode, disable traefik &amp; servicelb, constrain RAM to &lt;500MB.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Database className="w-3 h-3" /> control_plane_architect
                  </span>
                  <span>Datastore: SQLite (WAL)</span>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 3
                    ? "bg-purple-950/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                    : currentStep > 3
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                      STEP 03
                    </span>
                    <span className="font-bold text-zinc-200">WireGuard Edge Worker Mesh</span>
                  </div>
                  {currentStep > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 3 ? (
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Join RPi 5 and RK3588 worker nodes using kernel ChaCha20-Poly1305 tunnels over UDP 51820.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <Network className="w-3 h-3" /> mesh_network_engineer
                  </span>
                  <span>CNI: flannel-wg</span>
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
                    <span className="font-bold text-zinc-200">Partition Tolerance &amp; NVMe Spool</span>
                  </div>
                  {currentStep > 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 4 ? (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Operator review of 15m (900s) eviction delay and Vector NVMe disk buffer allocation (50GiB).
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-3 h-3" /> edge_sre_operator
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
                    <span className="font-bold text-zinc-200">WAN Severance &amp; Reconvergence</span>
                  </div>
                  {currentStep === 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Cut upstream WAN link, verify zero container restarts, spool 72k records to NVMe, reconnect without loss.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-3 h-3" /> edge_chaos_evaluator
                  </span>
                  <span>Data Loss: 0% | RTO: 0s</span>
                </div>
              </div>
            </div>
          ) : (
            /* Raw MDX Recipe Viewer */
            <div className="p-4 rounded-xl bg-[#0d1117] border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-y-auto max-h-[560px] slim-scroll">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[10px] text-zinc-500">
                <span>deploy-k3s-arm-edge-cluster.mdx</span>
                <span className="text-purple-400">YAML + MDX Valid</span>
              </div>
              <pre className="whitespace-pre font-mono text-[11px] text-zinc-300">
                {mdxSpecificationCode}
              </pre>
            </div>
          )}

          {/* Connected Tool Servers Panel */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-zinc-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-zinc-400 text-[11px]">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                ORCHESTRATION TOOLSERVERS
              </span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 3 ONLINE
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>mcp:terminal</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <HardDrive className="w-3 h-3 text-amber-400" />
                <span>mcp:fs</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-zinc-800 flex items-center gap-1.5 text-zinc-300">
                <Network className="w-3 h-3 text-emerald-400" />
                <span>mcp:network</span>
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
              <span className="ml-2 font-bold text-zinc-200">
                root@{activeMaster}:~# [K3S / WIREGUARD EDGE CONSOLE]
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span
                className={`w-2 h-2 rounded-full ${
                  simState === "running"
                    ? "bg-cyan-400 animate-pulse"
                    : simState === "partitioned"
                    ? "bg-amber-400 animate-ping"
                    : simState === "approval"
                    ? "bg-rose-400 animate-pulse"
                    : "bg-emerald-400"
                }`}
              />
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
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 mr-1.5">TASK</span>;
              } else if (log.type === "mcp") {
                color = "text-purple-300";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800 text-purple-300 mr-1.5">MCP</span>;
              } else if (log.type === "error") {
                color = "text-rose-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 mr-1.5">WAN_CUT</span>;
              } else if (log.type === "success") {
                color = "text-emerald-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 mr-1.5">PASS</span>;
              } else if (log.type === "spool") {
                color = "text-amber-300 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800 text-amber-300 mr-1.5">AUTONOMY</span>;
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
                    &lt;ApprovalGate id=&quot;edge-partition-toleration-policy&quot;&gt;
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold">
                  OPERATOR SIGN-OFF REQUIRED
                </span>
              </div>

              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs space-y-2">
                <div className="text-zinc-400 flex items-center justify-between pb-1 border-b border-zinc-800 text-[11px]">
                  <span>Edge Resiliency &amp; Eviction Inhibit Policy</span>
                  <span className="text-emerald-400">Toleration: 900s (15m)</span>
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed font-mono space-y-1">
                  <div><span className="text-cyan-400">tolerations:</span> node.kubernetes.io/unreachable:NoExecute (tolerationSeconds: 900)</div>
                  <div><span className="text-purple-400">tolerations:</span> node.kubernetes.io/not-ready:NoExecute (tolerationSeconds: 900)</div>
                  <div><span className="text-amber-400">vector_buffer:</span> type: disk | max_size: 50GiB | path: /var/log/vector/spool</div>
                  <div className="text-[10px] text-zinc-500">Enforces: Worker pods stay alive during WAN severance; telemetry spools locally to NVMe.</div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-body">
                K3s WireGuard mesh is formed across ARM SBC nodes. Please verify that this 15-minute eviction inhibition and 50GiB local NVMe disk spooling configuration complies with edge telemetry requirements before applying manifests.
              </p>

              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  onClick={handleApproveGate}
                  className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>AUTHORIZE &amp; APPLY MANIFESTS</span>
                </button>
                <button
                  onClick={handleRejectGate}
                  className="px-5 py-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-rose-500/40 flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>REJECT &amp; RE-PLAN</span>
                </button>
              </div>
            </div>
          )}

          {/* Terminal Footer Status Bar */}
          <div className="bg-[#0d1117] px-4 py-2.5 border-t border-zinc-800 flex items-center justify-between font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-4">
              <span>STATUS: <strong className="text-white">{simState.toUpperCase()}</strong></span>
              <span>CONTROL: <strong className="text-cyan-400">{activeMaster}</strong></span>
              <span>DATASTORE: <strong className="text-emerald-400">{datastoreState}</strong></span>
              <span>SPOOL: <strong className="text-amber-400">{spoolState}</strong></span>
            </div>
            {currentStep === 5 && simState === "completed" && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> SURVIVABILITY ATTESTED (0% LOSS)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default K3sWorkflowSimulator;
