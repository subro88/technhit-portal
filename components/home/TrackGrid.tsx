"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Server, Cpu, BookOpen, Youtube, ArrowRight } from "lucide-react";

interface Track {
  id: string;
  category: string;
  tag: string;
  title: string;
  desc: string;
  image: string;
  complexity: string;
  duration: string;
  hardware: string;
  level: string;
  href: string;
  accentColor: string;
}

const TRACKS: Track[] = [
  {
    id: "linux",
    category: "LINUX SYSTEMS",
    tag: "01 / BARE-METAL",
    title: "LINUX SERVER ADMINISTRATION",
    desc: "Production hardening of Rocky Linux & Debian. eBPF packet filters, ZFS pooled storage, systemd slicing, and low-latency network tuning.",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    complexity: "85%",
    duration: "4 WEEKS",
    hardware: "BARE-METAL X86_64",
    level: "INTERMEDIATE+",
    href: "/linux-server-admin",
    accentColor: "text-amber-400",
  },
  {
    id: "clustering",
    category: "VIRTUALIZATION",
    tag: "02 / HIGH AVAILABILITY",
    title: "CLUSTERING & CEPH STORAGE",
    desc: "Enterprise 3-node hyper-converged Proxmox VE clusters with Ceph Reef SDS, automated live migration, and K3s micro-cluster orchestration.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    complexity: "95%",
    duration: "6 WEEKS",
    hardware: "3× NODE HOMELAB",
    level: "ADVANCED",
    href: "/clustering-virtualization",
    accentColor: "text-cyber-emerald",
  },
  {
    id: "ai",
    category: "LOCAL COMPUTE",
    tag: "03 / GPU INFERENCE",
    title: "LOCAL AI INFERENCE RIGS",
    desc: "Deploying DeepSeek-R1, Llama-3, and Mistral on local workstation GPUs using vLLM, PagedAttention, AWQ quantization, and Ollama.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    complexity: "90%",
    duration: "3 WEEKS",
    hardware: "NVIDIA RTX / CUDA",
    level: "INTERMEDIATE+",
    href: "/local-ai-inference",
    accentColor: "text-cyber-purple",
  },
  {
    id: "stem",
    category: "FOUNDATION STEM",
    tag: "04 / 10+2 MATHEMATICS",
    title: "10+2 MULTIVARIABLE CALCULUS & VECTORS",
    desc: "Physical and geometric meaning of derivatives, vector fields, dot/cross products, gradients, and flux integrals with interactive simulations.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    complexity: "75%",
    duration: "SELF-PACED",
    hardware: "BROWSER VISUAL LAB",
    level: "HIGH SCHOOL / 10+2",
    href: "/stem-10-plus-2",
    accentColor: "text-amber-400",
  },
  {
    id: "video",
    category: "VIDEO MEDIA",
    tag: "05 / YOUTUBE COMPANIONS",
    title: "@TECHBLOGTUTORIAL COMPANIONS",
    desc: "Complete companion code repositories, step-by-step schematics, and terminal logs matching video tutorials on YouTube.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    complexity: "80%",
    duration: "WEEKLY DROPS",
    hardware: "HOMELAB GEAR",
    level: "ALL LEVELS",
    href: "/video-companions",
    accentColor: "text-red-400",
  },
];

export function TrackGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTracks =
    activeFilter === "all"
      ? TRACKS
      : TRACKS.filter((t) => t.id === activeFilter);

  return (
    <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#07090e]" id="tracks">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Header Block */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-6 space-y-4">
            <div className="section-marker">
              <span>02 — ENGINEERING TRACKS</span>
            </div>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
              FIVE PATHS.<br />
              <span className="text-stroke">ONE OUTCOME:</span><br />
              <span className="text-[#FF5400]">UNRELENTING RELIABILITY.</span>
            </h2>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-end space-y-6">
            <p className="text-zinc-400 text-lg leading-relaxed font-body">
              Every track at TechNHIT is reverse-engineered from production homelab environments and mathematical first principles. Choose your track. We supply the verified configs, architecture blueprints, and zero-compromise discipline.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`goal-pill ${activeFilter === "all" ? "active" : ""}`}
              >
                All Tracks
              </button>
              <button
                onClick={() => setActiveFilter("linux")}
                className={`goal-pill ${activeFilter === "linux" ? "active" : ""}`}
              >
                Linux Admin
              </button>
              <button
                onClick={() => setActiveFilter("clustering")}
                className={`goal-pill ${activeFilter === "clustering" ? "active" : ""}`}
              >
                Clustering & Ceph
              </button>
              <button
                onClick={() => setActiveFilter("ai")}
                className={`goal-pill ${activeFilter === "ai" ? "active" : ""}`}
              >
                Local AI Compute
              </button>
              <button
                onClick={() => setActiveFilter("stem")}
                className={`goal-pill ${activeFilter === "stem" ? "active" : ""}`}
              >
                10+2 STEM Math
              </button>
            </div>
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTracks.map((track) => (
            <article
              key={track.id}
              className="notch-corner bg-[#0d1117] border border-zinc-800 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Card Image Banner */}
              <div className="relative h-64 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[11px] text-amber-400 tracking-[0.2em] bg-black/60 px-2 py-1 backdrop-blur-sm">
                  {track.tag}
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500 text-black font-mono text-[10px] font-bold tracking-[0.15em]">
                  COMPLEXITY {track.complexity}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-7 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-display text-3xl sm:text-4xl leading-tight text-zinc-100 group-hover:text-amber-400 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mt-3 font-body">
                    {track.desc}
                  </p>
                </div>

                {/* Specs Matrix */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-zinc-800 font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">DURATION</div>
                    <div className="text-zinc-200 font-bold mt-0.5">{track.duration}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">LEVEL</div>
                    <div className="text-zinc-200 font-bold mt-0.5">{track.level}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest">HARDWARE TARGET</div>
                    <div className="text-amber-400 font-bold mt-0.5">{track.hardware}</div>
                  </div>
                </div>

                {/* Card Action Link */}
                <Link
                  href={track.href}
                  className="flex items-center justify-between font-heading text-sm tracking-[0.2em] uppercase text-zinc-200 hover:text-amber-400 pt-2 transition-colors group-hover:translate-x-1 duration-300"
                >
                  <span>ACCESS TRACK GUIDES</span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export default TrackGrid;
