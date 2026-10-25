"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "@/lib/posts";
import { playHapticSound, awardOperativeXp } from "@/lib/operative-store";
import { ClusterFailoverVisualizer } from "@/components/simulation/ClusterFailoverVisualizer";
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
  Activity,
  HardDrive,
  Network,
  Power,
  RefreshCw,
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
  const [simState, setSimState] = useState<"idle" | "running" | "fencing" | "approval" | "completed">("idle");
  const [approvalDecision, setApprovalDecision] = useState<"pending" | "approved" | "rejected">("pending");
  const [activeNode, setActiveNode] = useState<"db-node-01" | "db-node-02">("db-node-01");
  const [drbdSyncState, setDrbdSyncState] = useState<"Unconfigured" | "SyncSource" | "UpToDate/UpToDate" | "Secondary/Primary">("Unconfigured");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init",
      timestamp: "14:45:00.102",
      type: "info",
      text: "[SYSTEM] Antigravity SRE Orchestrator online. Target: 2-Node Active-Passive HA MySQL Cluster.",
    },
    {
      id: "init-mcp",
      timestamp: "14:45:00.180",
      type: "mcp",
      text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:fs, mcp:network. SSH keys verified.",
    },
    {
      id: "init-ready",
      timestamp: "14:45:00.220",
      type: "info",
      text: "[STANDBY] Topology Target: Node A (10.10.10.11), Node B (10.10.10.12), VIP (10.10.10.100), DRBD (/dev/drbd0).",
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
      setActiveNode("db-node-01");
      setDrbdSyncState("UpToDate/UpToDate");
      setCurrentStep(1);
    } else if (sceneIndex === 1) {
      setActiveNode("db-node-01");
      setDrbdSyncState("Secondary/Primary");
      setCurrentStep(2);
    } else if (sceneIndex === 2) {
      setSimState("fencing");
      setCurrentStep(3);
    } else if (sceneIndex === 3) {
      setActiveNode("db-node-02");
      setDrbdSyncState("UpToDate/UpToDate");
      setSimState("completed");
      setCurrentStep(5);
    }
  }, []);

  // Step 1: Pre-Flight Discovery & Network Verification
  const runStep1 = () => {
    setSimState("running");
    setCurrentStep(1);
    playHapticSound("click");
    addLog("command", "task:recon_and_prerequisites ▶ Agent: infra_planner");
    addLog("mcp", "[mcp:network] ping host='10.10.10.12' source='10.10.10.11' count=4");
    addLog("info", "Ring 0 Ingress latency: 0.18ms RTT. Loss: 0%.");
    addLog("mcp", "[mcp:network] ping host='10.20.20.12' source='10.20.20.11' count=4");
    addLog("info", "Ring 1 Dedicated Heartbeat crossover latency: 0.09ms RTT. Zero jitter.");
    addLog("mcp", "[mcp:terminal] exec 'grep -E \"db-node-01|db-node-02\" /etc/hosts'");
    addLog("info", "Node A (10.10.10.11) & Node B (10.10.10.12) host resolution verified.");
    addLog("mcp", "[mcp:terminal] exec 'lsblk /dev/sdb1'");
    addLog("info", "Partition /dev/sdb1 (500GB) verified raw and unmounted on both nodes.");
    addLog("mcp", "[mcp:terminal] exec 'chronyc tracking'");
    addLog("info", "System clock offset: 0.000042 seconds (< 10ms threshold).");
    addLog("success", "✓ Pre-Flight Checks Passed. Ring 0/Ring 1 and storage partitions verified.");
    setSimState("idle");
  };

  // Step 2: DRBD Synchronous Storage Provisioning
  const runStep2 = () => {
    setSimState("running");
    setCurrentStep(2);
    playHapticSound("click");
    addLog("command", "task:configure_drbd ▶ Agent: storage_engineer");
    addLog("mcp", "[mcp:fs] write_file path='/etc/drbd.d/mysql-ha.res'");
    addLog("info", "Configured DRBD Protocol C (Synchronous) on /dev/drbd0 over TCP:7788.");
    addLog("mcp", "[mcp:terminal] exec 'drbdadm create-md mysql-ha && drbdadm up mysql-ha'");
    addLog("info", "DRBD v9 metadata initialized on both nodes.");
    addLog("mcp", "[mcp:terminal] exec 'drbdadm primary --force mysql-ha'");
    addLog("info", "Promoted db-node-01 to DRBD Primary. Initial block resynchronization started.");
    setDrbdSyncState("SyncSource");

    setTimeout(() => {
      addLog("mcp", "[mcp:terminal] exec 'mkfs.ext4 -m 1 -O mmp /dev/drbd0'");
      addLog("info", "Filesystem ext4 with Multi-Mount Protection (MMP) initialized on /dev/drbd0.");
      addLog("mcp", "[mcp:terminal] exec 'drbdadm status mysql-ha'");
      addLog("success", "✓ DRBD Replication status: db-node-01:Primary/UpToDate, db-node-02:Secondary/UpToDate.");
      setDrbdSyncState("UpToDate/UpToDate");
      setSimState("idle");
    }, 1200);
  };

  // Step 3: Corosync, Pacemaker & STONITH Initialization
  const runStep3 = () => {
    setSimState("running");
    setCurrentStep(3);
    playHapticSound("click");
    addLog("command", "task:corosync_pacemaker_stonith ▶ Agent: cluster_architect");
    addLog("mcp", "[mcp:terminal] exec 'pcs host auth db-node-01 db-node-02 -u hacluster'");
    addLog("info", "PCS cluster daemon authenticated across both nodes via port 2224.");
    addLog("mcp", "[mcp:terminal] exec 'pcs cluster setup mysql_cluster db-node-01 addr=10.10.10.11 addr=10.20.20.11 db-node-02 addr=10.10.10.12 addr=10.20.20.12'");
    addLog("info", "Corosync dual-ring Totem cluster 'mysql_cluster' generated.");
    addLog("mcp", "[mcp:terminal] exec 'pcs cluster start --all && pcs cluster enable --all'");
    addLog("info", "Corosync & Pacemaker daemons started and enabled on boot.");
    addLog("mcp", "[mcp:terminal] exec 'pcs stonith create fence_node1 fence_ipmilan ip=192.168.10.51 pcmk_host_list=db-node-01'");
    addLog("mcp", "[mcp:terminal] exec 'pcs stonith create fence_node2 fence_ipmilan ip=192.168.10.52 pcmk_host_list=db-node-02'");
    addLog("info", "Configured hardware STONITH IPMI power management agents for both nodes.");
    addLog("mcp", "[mcp:terminal] exec 'pcs stonith status'");
    addLog("success", "✓ STONITH fencing active. Zero-tolerance split-brain protection armed.");
    setSimState("idle");
  };

  // Step 4: Cluster Resource Configuration & Constraints (Approval Gate)
  const runStep4 = () => {
    setCurrentStep(4);
    setSimState("approval");
    playHapticSound("flip");
    addLog("gate", "🛑 <ApprovalGate id='cluster-constraint-review'> reached.");
    addLog("gate", "PAUSED: Colocation and ordering constraints formulated. Awaiting operator authorization.");
  };

  const handleApproveGate = () => {
    setApprovalDecision("approved");
    setSimState("running");
    playHapticSound("success");
    awardOperativeXp(50, "Cluster Constraints Authorized");
    addLog("success", "✓ Human Operator APPROVED cluster constraints.");

    addLog("command", "task:activate_resources ▶ Agent: crm_operator");
    addLog("mcp", "[mcp:terminal] exec 'pcs resource create VIP ocf:heartbeat:IPaddr2 ip=10.10.10.100 cidr_netmask=24 op monitor interval=10s'");
    addLog("mcp", "[mcp:terminal] exec 'pcs resource create fs_mysql ocf:heartbeat:Filesystem device=/dev/drbd0 directory=/var/lib/mysql fstype=ext4'");
    addLog("mcp", "[mcp:terminal] exec 'pcs resource create mysql_svc ocf:heartbeat:mysql config=/etc/mysql/my.cnf'");
    addLog("mcp", "[mcp:terminal] exec 'pcs constraint colocation add VIP with fs_mysql INFINITY'");
    addLog("mcp", "[mcp:terminal] exec 'pcs constraint colocation add fs_mysql with ms_drbd_mysql:Master INFINITY'");
    addLog("mcp", "[mcp:terminal] exec 'pcs constraint order promote ms_drbd_mysql then start fs_mysql then start VIP'");
    addLog("success", "✓ Resources online: VIP (10.10.10.100), /var/lib/mysql mounted, MySQL active on db-node-01.");
    setSimState("idle");
    runStep5();
  };

  const handleRejectGate = () => {
    setApprovalDecision("rejected");
    setSimState("idle");
    playHapticSound("error");
    addLog("error", "✗ Human Operator REJECTED constraints. Re-evaluating CRM policy tree.");
  };

  // Step 5: Automated Failover & Self-Healing Testing
  const runStep5 = () => {
    setSimState("fencing");
    setCurrentStep(5);
    playHapticSound("click");
    addLog("command", "task:failover_validation ▶ Agent: reliability_evaluator");
    addLog("info", "Injecting hardware/kernel freeze on db-node-01: 'echo c > /proc/sysrq-trigger'...");

    setTimeout(() => {
      addLog("error", "[COROSYNC] Heartbeat lost on db-node-01 (Ring 0 & Ring 1 timeout > 1000ms).");
      addLog("heal", "⚡ [PACEMAKER] Initiating STONITH fencing protocol against db-node-01.");
      addLog("mcp", "[mcp:terminal] exec 'fence_ipmilan -a 192.168.10.51 -l admin -p secret -o off'");
      addLog("heal", "⚡ [BMC] Hardware power cut confirmed: db-node-01 forcibly TERMINATED.");
      addLog("info", "[PACEMAKER] db-node-01 confirmed dead. Zero risk of split-brain writes.");

      setTimeout(() => {
        addLog("mcp", "[mcp:terminal] exec 'drbdadm primary mysql-ha' on db-node-02");
        addLog("info", "Promoted db-node-02 to DRBD Primary.");
        addLog("mcp", "[mcp:terminal] exec 'mount /dev/drbd0 /var/lib/mysql && systemctl start mysql'");
        addLog("info", "Mounted /var/lib/mysql. Started MySQL server (InnoDB recovery 0.8s).");
        addLog("mcp", "[mcp:terminal] exec 'ip addr add 10.10.10.100/24 dev eth0 && arping -U 10.10.10.100'");
        addLog("info", "Virtual IP 10.10.10.100 migrated to db-node-02. Gratuitous ARP broadcast sent.");

        setActiveNode("db-node-02");
        setDrbdSyncState("Secondary/Primary");
        addLog("success", "✓ Total Failover Latency: 8.4 seconds (RTO < 10s achieved, RPO = 0 transactions).");
        addLog("success", "✓ Cluster Self-Healing Attested. db-node-02 running Primary with full write quorum.");
        setSimState("completed");
        awardOperativeXp(100, "HA Cluster Failover Validation Completed");
        playHapticSound("levelup");
      }, 1500);
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
    setActiveNode("db-node-01");
    setDrbdSyncState("Unconfigured");
    setLogs([
      {
        id: "reset",
        timestamp: "14:46:00.001",
        type: "info",
        text: "[SYSTEM] Antigravity SRE Orchestrator reset. Cluster state restored to clean initial baseline.",
      },
      {
        id: "reset-mcp",
        timestamp: "14:46:00.040",
        type: "mcp",
        text: "[MCP:BRIDGE] Registered toolservers: mcp:terminal, mcp:fs, mcp:network. Nodes ready for orchestration.",
      },
    ]);
  };

  const mdxSpecificationCode = `---
name: "Provision Active-Passive MySQL Cluster (Corosync + Pacemaker + DRBD)"
description: "End-to-end automated setup, configuration, and failover validation for a two-node HA Linux database cluster"
tools:
  - "mcp:terminal"
  - "mcp:fs"
  - "mcp:network"
parameters:
  node_primary_ip:
    type: string
    description: "Private heartbeat IP of Node A (e.g., 10.10.10.11)"
    required: true
  node_secondary_ip:
    type: string
    description: "Private heartbeat IP of Node B (e.g., 10.10.10.12)"
    required: true
  virtual_ip:
    type: string
    description: "Cluster Virtual IP / Floating IP (e.g., 10.10.10.100)"
    required: true
  drbd_device:
    type: string
    default: "/dev/drbd0"
  drbd_disk_partition:
    type: string
    default: "/dev/sdb1"
  fencing_agent:
    type: string
    description: "Fencing mechanism (e.g., fence_ipmilan, fence_pve, fence_virsh)"
    default: "fence_ipmilan"
---

# High-Availability MySQL Cluster Orchestration

<Context>
You are an autonomous Site Reliability Engineer and Linux Systems Architect inside Google Antigravity.
Your objective is to provision, configure, and validate a resilient, zero-downtime active-passive MySQL database cluster across two Linux nodes using Corosync for cluster messaging, Pacemaker as the CRM, DRBD for block-level replication, and STONITH for split-brain prevention.

Target Virtual IP: {{ parameters.virtual_ip }}
Heartbeat Nodes: {{ parameters.node_primary_ip }} (Node A), {{ parameters.node_secondary_ip }} (Node B)
Storage Device: {{ parameters.drbd_device }} on {{ parameters.drbd_disk_partition }}
Fencing Agent: {{ parameters.fencing_agent }}
</Context>

---

## Step 1: Pre-Flight Discovery & Network Verification

<Task id="recon_and_prerequisites" agent="infra_planner">
1. Audit local network interfaces across both nodes:
   - Verify low-latency dedicated heartbeat interfaces (Ring 0 on 10.10.10.x and Ring 1 on 10.20.20.x).
   - Confirm hostname resolution via /etc/hosts on both nodes:
     \`\`\`bash
     grep -E 'db-node-01|db-node-02' /etc/hosts
     \`\`\`
   - Ensure TCP ports 7788 (DRBD), 2224 (pcsd), and UDP ports 5404, 5405 (Corosync) are open on firewall/ufw/iptables.
2. Check shared-nothing storage block device availability:
   - Run \`lsblk\` and verify {{ parameters.drbd_disk_partition }} exists unmounted on both nodes.
3. Validate NTP/Chrony synchronization between nodes (clock skew must be < 10ms).
</Task>

---

## Step 2: DRBD Synchronous Storage Provisioning

<Task id="configure_drbd" agent="storage_engineer" dependsOn="recon_and_prerequisites">
1. Generate the DRBD configuration file at \`/etc/drbd.d/mysql-ha.res\`:
   - Protocol: C (Synchronous zero-loss replication).
   - Configure split-brain handlers (discard-node-nodata, adjust-my-split-brain).
   - Define endpoints for Node A ({{ parameters.node_primary_ip }}) and Node B ({{ parameters.node_secondary_ip }}).
2. Initialize metadata and attach storage on both nodes:
   \`\`\`bash
   drbdadm create-md mysql-ha
   drbdadm up mysql-ha
   \`\`\`
3. Establish initial sync on Node A:
   \`\`\`bash
   drbdadm primary --force mysql-ha
   \`\`\`
4. Format the filesystem on {{ parameters.drbd_device }} with ext4 (Multi-Mount Protection enabled).
5. Gate: Do not proceed until \`dstate:UpToDate/UpToDate\` is achieved.
</Task>

---

## Step 3: Corosync, Pacemaker & STONITH Initialization

<Task id="corosync_pacemaker_stonith" agent="cluster_architect" dependsOn="configure_drbd">
1. Authenticate nodes and initialize cluster:
   \`\`\`bash
   pcs host auth db-node-01 db-node-02 -u hacluster
   pcs cluster setup mysql_cluster db-node-01 addr=10.10.10.11 addr=10.20.20.11 db-node-02 addr=10.10.10.12 addr=10.20.20.12
   pcs cluster start --all && pcs cluster enable --all
   \`\`\`
2. Configure STONITH fencing devices (IPMI BMC or Proxmox VE API):
   \`\`\`bash
   pcs stonith create fence_node1 {{ parameters.fencing_agent }} ip=192.168.10.51 pcmk_host_list=db-node-01
   pcs stonith create fence_node2 {{ parameters.fencing_agent }} ip=192.168.10.52 pcmk_host_list=db-node-02
   \`\`\`
3. Enforce STONITH enabled (\`stonith-enabled=true\`) and no-quorum-policy=stop.
</Task>

---

## Step 4: Cluster Resource Configuration & Constraints

<ApprovalGate id="cluster-constraint-review" dependsOn="corosync_pacemaker_stonith">
  <Condition>
    Corosync quorum formed and STONITH active. Operator must verify colocation and ordering rules.
  </Condition>
  <Prompt>
    Verify that MySQL and Filesystem colocate with DRBD Master and follow strict promotion order.
  </Prompt>
</ApprovalGate>

<Task id="activate_resources" agent="crm_operator" dependsOn="cluster-constraint-review">
1. Define cluster resources:
   - VIP (ocf:heartbeat:IPaddr2, ip=10.10.10.100)
   - fs_mysql (ocf:heartbeat:Filesystem, device=/dev/drbd0, directory=/var/lib/mysql)
   - mysql_svc (ocf:heartbeat:mysql, config=/etc/mysql/my.cnf)
2. Enforce atomic colocation & ordering:
   \`\`\`bash
   pcs constraint colocation add VIP with fs_mysql INFINITY
   pcs constraint colocation add fs_mysql with ms_drbd_mysql:Master INFINITY
   pcs constraint order promote ms_drbd_mysql then start fs_mysql then start VIP
   \`\`\`
</Task>

---

## Step 5: Automated Failover & Self-Healing Testing

<Task id="failover_validation" agent="reliability_evaluator" dependsOn="activate_resources">
1. Inject simulated catastrophic kernel panic on Node A:
   \`\`\`bash
   ssh db-node-01 'echo c > /proc/sysrq-trigger'
   \`\`\`
2. Validate automated failover execution:
   - Corosync detects token loss in < 1000ms.
   - Node B invokes STONITH via IPMI: Node A power cut attested.
   - Node B promotes DRBD /dev/drbd0 to Primary.
   - Node B mounts /var/lib/mysql and starts MySQL.
   - Node B takes over Virtual IP (10.10.10.100) and broadcasts Gratuitous ARP.
3. Validate total recovery time objective: RTO < 10s, RPO = 0 transactions.
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
              HIGH-AVAILABILITY CLUSTER ORCHESTRATION · GOOGLE ANTIGRAVITY MCP
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-zinc-100 tracking-wide">
            Provision Active-Passive MySQL Cluster Console
          </h1>
          <p className="text-zinc-400 text-sm font-body max-w-3xl mt-1">
            Automated provisioning, Corosync Totem dual-ring configuration, DRBD 9 Protocol C synchronous storage, STONITH IPMI fencing, and catastrophic kernel panic failover validation.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <button
            onClick={runAutoPilot}
            disabled={simState === "running" || simState === "fencing"}
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
            disabled={simState === "running" || simState === "fencing" || simState === "approval" || currentStep >= 5}
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
      <ClusterFailoverVisualizer onTimelineSync={handleTimelineSync} />

      {/* Cluster Status Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" /> ACTIVE PRIMARY
          </span>
          <span className="text-cyan-300 font-bold">{activeNode}</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-purple-400" /> VIRTUAL IP (VIP)
          </span>
          <span className="text-purple-300 font-bold">10.10.10.100</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" /> DRBD SYNC
          </span>
          <span className="text-amber-300 font-bold">{drbdSyncState}</span>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5 text-rose-400" /> STONITH FENCE
          </span>
          <span className="text-emerald-400 font-bold">fence_ipmilan (ARMED)</span>
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
                    <span className="font-bold text-zinc-200">Pre-Flight &amp; Network Audit</span>
                  </div>
                  {currentStep > 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 1 ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Verify Ring 0 &amp; Ring 1 interfaces, /dev/sdb1 disk availability, Chrony clock sync.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Bot className="w-3 h-3" /> infra_planner
                  </span>
                  <span>Tools: mcp:network, mcp:terminal</span>
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
                    <span className="font-bold text-zinc-200">DRBD Protocol C Storage</span>
                  </div>
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 2 ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Write /etc/drbd.d/mysql-ha.res, initialize metadata, force primary sync, format ext4 MMP.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <HardDrive className="w-3 h-3" /> storage_engineer
                  </span>
                  <span>Tools: mcp:fs, mcp:terminal</span>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  currentStep === 3
                    ? "bg-blue-950/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : currentStep > 3
                    ? "bg-[#0d1117] border-emerald-500/40 opacity-80"
                    : "bg-[#050609] border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-bold">
                      STEP 03
                    </span>
                    <span className="font-bold text-zinc-200">Corosync &amp; STONITH Arming</span>
                  </div>
                  {currentStep > 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 3 ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Dual-ring Totem membership, pcs host authentication, IPMI BMC fence agent arming.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <ShieldCheck className="w-3 h-3" /> cluster_architect
                  </span>
                  <span>STONITH: Active</span>
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
                    <span className="font-bold text-zinc-200">Constraint Review &amp; Resources</span>
                  </div>
                  {currentStep > 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : currentStep === 4 ? (
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Human-in-the-Loop review of colocation &amp; ordering rules prior to activating VIP &amp; MySQL.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <AlertTriangle className="w-3 h-3" /> crm_operator
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
                    <span className="font-bold text-zinc-200">Kernel Crash Failover Drill</span>
                  </div>
                  {currentStep === 5 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : null}
                </div>
                <p className="text-[11px] text-zinc-400 font-body mb-2.5">
                  Simulate SysRq kernel crash on Node A, trigger STONITH power cut, promote Node B in &lt;10s.
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="w-3 h-3" /> reliability_evaluator
                  </span>
                  <span>RTO: 8.4s | RPO: 0</span>
                </div>
              </div>
            </div>
          ) : (
            /* Raw MDX Recipe Viewer */
            <div className="p-4 rounded-xl bg-[#0d1117] border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-y-auto max-h-[560px] slim-scroll">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800 text-[10px] text-zinc-500">
                <span>provision-active-passive-mysql.mdx</span>
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
                root@{activeNode}:~# [PCS / COROSYNC CONSOLE]
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className={`w-2 h-2 rounded-full ${simState === "running" ? "bg-cyan-400 animate-pulse" : simState === "fencing" ? "bg-rose-400 animate-ping" : simState === "approval" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
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
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 border border-rose-800 text-rose-300 mr-1.5">CRASH</span>;
              } else if (log.type === "success") {
                color = "text-emerald-400 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 mr-1.5">PASS</span>;
              } else if (log.type === "heal") {
                color = "text-amber-300 font-bold";
                badge = <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 border border-amber-800 text-amber-300 mr-1.5">STONITH</span>;
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
                    &lt;ApprovalGate id=&quot;cluster-constraint-review&quot;&gt;
                  </span>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold">
                  OPERATOR SIGN-OFF REQUIRED
                </span>
              </div>

              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 font-mono text-xs space-y-2">
                <div className="text-zinc-400 flex items-center justify-between pb-1 border-b border-zinc-800 text-[11px]">
                  <span>CRM Constraints Policy Proposal</span>
                  <span className="text-emerald-400">Score: INFINITY</span>
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed font-mono space-y-1">
                  <div><span className="text-cyan-400">colocation</span> col_mysql_vip_drbd INFINITY: VIP fs_mysql ms_drbd_mysql:Master</div>
                  <div><span className="text-purple-400">order</span> ord_drbd_fs_vip Mandatory: ms_drbd_mysql:promote fs_mysql:start VIP:start</div>
                  <div className="text-[10px] text-zinc-500">Enforces: Virtual IP &amp; MySQL can ONLY start where DRBD is in Primary state.</div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-body">
                Corosync dual-ring quorum is formed and STONITH agents are armed. Please verify that these atomic colocation and ordering constraints match your enterprise topology before activating resources.
              </p>

              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  onClick={handleApproveGate}
                  className="px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>AUTHORIZE &amp; ACTIVATE RESOURCES</span>
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
              <span>PRIMARY: <strong className="text-cyan-400">{activeNode}</strong></span>
              <span>VIP: <strong className="text-purple-400">10.10.10.100</strong></span>
            </div>
            {currentStep === 5 && simState === "completed" && (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> CLUSTER ATTESTED (RTO 8.4s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
