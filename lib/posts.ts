import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMetadata {
  id?: string;
  title: string;
  slug: string;
  date: string;
  category: "linux-server-admin" | "clustering-virtualization" | "local-ai-inference" | "stem-10-plus-2" | "video-companions" | "software-engineering";
  status: "Published" | "Draft";
  summary: string;
  youtubeId?: string;
  wordCount?: number;
  readTime?: number;
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
}

export interface Post extends PostMetadata {
  content: string;
}

const CONTENT_PATH = path.join(process.cwd(), "content");

export const CATEGORIES = [
  {
    slug: "linux-server-admin",
    name: "Linux & Kernel Admin",
    description: "Enterprise Linux, ZFS storage pools, kernel hardening, systemd, and high-throughput networking.",
    badge: "Kernel / SysAdmin",
    color: "cyan",
  },
  {
    slug: "clustering-virtualization",
    name: "Clustering & Virtualization",
    description: "High-Availability Proxmox VE 8, Ceph storage clusters, Kubernetes bare-metal, and Docker Swarm mesh.",
    badge: "HA Clusters",
    color: "emerald",
  },
  {
    slug: "local-ai-inference",
    name: "Local AI & GPU Compute",
    description: "Self-hosted LLMs, Ollama, vLLM, CUDA containerization, and private multi-node inference clusters.",
    badge: "GPU Inference",
    color: "purple",
  },
  {
    slug: "software-engineering",
    name: "Software & Web Systems",
    description: "Modern full-stack web engineering, Laravel, React, Node.js runtimes, API design, and distributed architectures.",
    badge: "Full Stack Dev",
    color: "teal",
  },
  {
    slug: "stem-10-plus-2",
    name: "10+2 Math & STEM Lab",
    description: "Interactive Senior Secondary (10+2) Calculus, Vectors, 3D Geometry, Linear Algebra, and Classical Physics simulations.",
    badge: "STEM 10+2 Foundation",
    color: "amber",
  },
  {
    slug: "video-companions",
    name: "YouTube Video Companions",
    description: "Code snippets, configuration diffs, and companion documentation for @TechBlogTutorial tutorials.",
    badge: "@TechBlogTutorial",
    color: "red",
  },
] as const;

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  if (!fs.existsSync(CONTENT_PATH)) {
    return getFallbackPosts();
  }

  const categoryDirs = fs.readdirSync(CONTENT_PATH, { withFileTypes: true });

  for (const catDir of categoryDirs) {
    if (!catDir.isDirectory()) continue;
    const catPath = path.join(CONTENT_PATH, catDir.name);
    const files = fs.readdirSync(catPath);

    for (const file of files) {
      if (!file.endsWith(".mdx") && !file.endsWith(".md")) continue;
      const fullPath = path.join(catPath, file);
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(rawContent);

      const wordCount = content.replace(/^---[\s\S]*?---/, "").trim().split(/\s+/).length;
      const readTime = Math.ceil(wordCount / 200);

      posts.push({
        id: file.replace(/\.mdx?$/, ""),
        slug: data.slug || file.replace(/\.mdx?$/, ""),
        title: data.title || "Untitled Article",
        date: data.date || new Date().toISOString().split("T")[0],
        category: (data.category || catDir.name) as PostMetadata["category"],
        status: (data.status || "Published") as "Published" | "Draft",
        summary: data.summary || "",
        youtubeId: data.youtubeId || "",
        wordCount,
        readTime,
        tags: data.tags || [],
        author: data.author || {
          name: "TechNHIT Engineering",
          role: "Systems Architect",
        },
        content,
      });
    }
  }

  if (posts.length === 0) {
    return getFallbackPosts();
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostBySlug(category: string, slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.category === category && p.slug === slug) || null;
}

export function savePostLocally(category: string, slug: string, content: string): string {
  const catPath = path.join(CONTENT_PATH, category);
  if (!fs.existsSync(catPath)) {
    fs.mkdirSync(catPath, { recursive: true });
  }
  const filePath = path.join(catPath, `${slug}.mdx`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function getFallbackPosts(): Post[] {
  return [
    {
      id: "deploying-local-ai-cluster-ollama-docker",
      slug: "deploying-local-ai-cluster-ollama-docker",
      title: "Deploying Local AI Cluster with Ollama & Docker GPU Passthrough",
      category: "local-ai-inference",
      status: "Published",
      date: "2026-10-14",
      summary: "High-performance inference clustering with NVIDIA GPU pass-through and automated failover on Ubuntu 24.04 LTS.",
      youtubeId: "dQw4w9WgXcQ",
      wordCount: 1420,
      readTime: 7,
      tags: ["Ollama", "CUDA", "vLLM", "Docker Swarm", "GPU"],
      content: `---
title: "Deploying Local AI Cluster with Ollama & Docker GPU Passthrough"
date: "2026-10-14"
category: "local-ai-inference"
status: "Published"
youtubeId: "dQw4w9WgXcQ"
summary: "High-performance inference clustering with NVIDIA GPU pass-through and automated failover on Ubuntu 24.04 LTS."
---

# Deploying Local AI Cluster with Ollama & Docker GPU Passthrough

In this companion guide to our **@TechBlogTutorial** video, we construct a scalable compute cluster for hosting LLMs (Llama 3, Mistral, DeepSeek) completely offline without public cloud lock-in.

<InfoBox title="Hardware Requisites">
Ensure NVIDIA CUDA drivers (v550+) and the NVIDIA Container Toolkit are installed prior to starting the Docker swarm.
</InfoBox>

### 1. Verify NVIDIA GPU Container Runtime

Execute telemetry verification to confirm container GPU access:

<TerminalBlock command="docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi" title="NVIDIA Core Driver Verification" os="Ubuntu 24.04" />

### 2. Multi-Node Cluster Architecture

Below is our primary reverse proxy routing architecture diagram:

<ArchitectureDiagram type="cluster" title="Inference Routing Mesh" />

### 3. Deploying Ollama Service Stack

Run the containerized inference cluster daemon with automated restart policies:

<TerminalBlock command="docker compose -f docker-compose.ai.yml up -d --scale worker=2" title="Cluster Startup" os="Debian/Ubuntu" />

\`\`\`yaml
# docker-compose.ai.yml
version: '3.8'
services:
  ollama-primary:
    image: ollama/ollama:latest
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    ports:
      - "11434:11434"
    volumes:
      - /mnt/fast-nvme/models:/root/.ollama
\`\`\`

Now test prompt generation via curl:

<TerminalBlock command="curl http://192.168.1.120:11434/api/generate -d '{\\"model\\": \\"llama3\\", \\"prompt\\": \\"Explain ZFS RAIDZ2 in 2 lines\\"}'" title="Local Inference Test" os="bash" />
`,
    },
    {
      id: "proxmox-ve-8-ha-cluster-ceph",
      slug: "proxmox-ve-8-ha-cluster-ceph",
      title: "High Availability Proxmox VE 8 Cluster with Ceph Storage",
      category: "clustering-virtualization",
      status: "Published",
      date: "2026-10-10",
      summary: "Step-by-step configuration of a 3-node enterprise hypervisor cluster with shared Ceph block storage and redundant Corosync.",
      youtubeId: "eBGIQ7ZuuiU",
      wordCount: 2150,
      readTime: 11,
      tags: ["Proxmox", "Ceph", "Virtualization", "Corosync", "High Availability"],
      content: `---
title: "High Availability Proxmox VE 8 Cluster with Ceph Storage"
date: "2026-10-10"
category: "clustering-virtualization"
status: "Published"
summary: "Step-by-step configuration of a 3-node enterprise hypervisor cluster with shared Ceph block storage and redundant Corosync."
---

# High Availability Proxmox VE 8 Cluster

Building a quorum-backed 3-node cluster allows virtual machine live migration without 1 millisecond of packet loss.

<TerminalBlock command="pvecm create technhit-cluster --link0 10.10.10.1" title="Corosync Cluster Initialization" os="Proxmox 8.2" />

<ArchitectureDiagram type="network" title="3-Node Corosync & Ceph Network Map" />

<InfoBox title="Quorum Safety">
Never build a two-node cluster without a low-cost QDevice Raspberry Pi witness to avoid split-brain failure scenarios.
</InfoBox>
`,
    },
    {
      id: "hardening-linux-kernel-sysctl-nftables",
      slug: "hardening-linux-kernel-sysctl-nftables",
      title: "Hardening Linux Kernel with sysctl & nftables Firewall rules",
      category: "linux-server-admin",
      status: "Published",
      date: "2026-10-17",
      summary: "Kernel-level TCP stack hardening and modern packet filtering replacing legacy iptables.",
      youtubeId: "3fumBcKC6RE",
      wordCount: 1680,
      readTime: 9,
      tags: ["Linux", "Kernel", "sysctl", "nftables", "Security"],
      content: `---
title: "Hardening Linux Kernel with sysctl & nftables Firewall rules"
date: "2026-10-17"
category: "linux-server-admin"
status: "Published"
summary: "Kernel-level TCP stack hardening and modern packet filtering replacing legacy iptables."
---

# Hardening Linux Server Kernels

Enterprise Linux servers exposed to the open internet require defense-in-depth at the kernel TCP/IP layer.

<TerminalBlock command="sysctl -p /etc/sysctl.d/99-hardened.conf" title="Apply Sysctl Rules" os="Linux" />

### Key Kernel Hardening Parameters

\`\`\`ini
# /etc/sysctl.d/99-hardened.conf
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.icmp_echo_ignore_broadcasts = 1
\`\`\`
`,
    },
    {
      id: "10-plus-2-calculus-derivatives-rate-of-change",
      slug: "10-plus-2-calculus-derivatives-rate-of-change",
      title: "10+2 Calculus: Physical & Geometric Meaning of Derivatives",
      category: "stem-10-plus-2",
      status: "Published",
      date: "2026-10-16",
      summary: "Interactive exploration of differentiation, instantaneous velocity, slopes of tangents, and Taylor approximations for Grade 11 & 12 students.",
      youtubeId: "WUvTyaaNjfo",
      wordCount: 1850,
      readTime: 10,
      tags: ["Calculus", "STEM", "10+2 Math", "Physics", "Derivatives"],
      content: `---
title: "10+2 Calculus: Physical & Geometric Meaning of Derivatives"
date: "2026-10-16"
category: "stem-10-plus-2"
status: "Published"
summary: "Interactive exploration of differentiation, instantaneous velocity, slopes of tangents, and Taylor approximations for Grade 11 & 12 students."
---

# 10+2 Calculus: Physical & Geometric Meaning of Derivatives

Welcome to the **TechNHIT 10+2 STEM Foundation Series**. Calculus is the mathematical language of change in physics and computer engineering.

### 1. The Derivative as an Instantaneous Limit

Consider a particle moving along an axis with position $s(t)$. The average velocity over an interval $\\Delta t$ is:

<MathFormulaBlock formula="v_{avg} = \\frac{s(t + \\Delta t) - s(t)}{\\Delta t}" label="Average Velocity" />

As $\\Delta t \\to 0$, we arrive at the instantaneous velocity—the derivative:

<MathFormulaBlock formula="f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}" label="First Principle Definition" />

<InfoBox title="Engineering Intuition">
In server cluster telemetry, CPU load average is simply the discrete moving integral of the arrival rate $\\frac{d\\lambda}{dt}$.
</InfoBox>

### 2. Tangent Slope & Normal Vectors

For any smooth curve $y = f(x)$, the slope of the tangent at $(x_0, y_0)$ is $m = f'(x_0)$. The slope of the orthogonal normal line is $m_n = -\\frac{1}{f'(x_0)}$.

<TerminalBlock command="python3 -c 'import sympy as sp; x = sp.Symbol(\"x\"); print(sp.diff(sp.sin(x)*sp.exp(x), x))'" title="Symbolic Differentiation in Python" os="Python 3" />
`,
    },
  ];
}
