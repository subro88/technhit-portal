"use client";

import React, { useState } from "react";
import { CheckCircle2, Terminal } from "lucide-react";

interface Architect {
  id: string;
  number: string;
  name: string;
  role: string;
  track: string;
  exp: string;
  image: string;
  credentials: string[];
  signatureStack: string;
  signatureCommand: string;
}

const ARCHITECTS: Architect[] = [
  {
    id: "subhro",
    number: "01",
    name: "SUBHRO BANERJEE",
    role: "PRINCIPAL SYSTEMS ARCHITECT",
    track: "Bare-Metal & Hypervisors",
    exp: "14 YRS · RHCE · CKA",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    credentials: [
      "Red Hat Certified Engineer (RHCE)",
      "Certified Kubernetes Administrator (CKA)",
      "Proxmox VE Cluster Specialist",
      "Linux Foundation Systems Auditor",
    ],
    signatureStack: "KERNEL // eBPF // PROXMOX",
    signatureCommand: "sysctl -p /etc/sysctl.d/99-cluster-lowlatency.conf",
  },
  {
    id: "alex",
    number: "02",
    name: "ALEX CHEN",
    role: "DISTRIBUTED STORAGE LEAD",
    track: "Ceph SDS & Network Fabric",
    exp: "10 YRS · LINUX SDS",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    credentials: [
      "Ceph Storage Administrator",
      "BGP / EVPN Fabric Engineer",
      "ZFS Storage Pool Performance Tuner",
      "40G/100G Fiber SAN Integrator",
    ],
    signatureStack: "CEPH REEF // NVMe-oF",
    signatureCommand: "ceph osd pool autoscale-status && ceph health detail",
  },
  {
    id: "priya",
    number: "03",
    name: "DR. PRIYA RAMAN",
    role: "LOCAL AI & GPU RESEARCHER",
    track: "LLM Inference & Quantization",
    exp: "8 YRS · CUDA · vLLM",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    credentials: [
      "NVIDIA Deep Learning Institute Certified",
      "vLLM & PagedAttention Contributor",
      "AWQ & GGUF Quantization Specialist",
      "PyTorch Distributed Inference Lead",
    ],
    signatureStack: "vLLM // DEEPSEEK // TRITON",
    signatureCommand: "vllm serve deepseek-ai/R1-Distill-32B --tp 2",
  },
  {
    id: "marcus",
    number: "04",
    name: "MARCUS WEBER",
    role: "MATHEMATICAL FOUNDATIONS LEAD",
    track: "10+2 STEM & Physics Fields",
    exp: "12 YRS · APPLIED MATH",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    credentials: [
      "M.Sc. Theoretical Physics & Dynamics",
      "Multivariable Calculus Curriculum Designer",
      "Vector Field Simulation Developer",
      "SymPy & NumPy Scientific Computing",
    ],
    signatureStack: "CALCULUS // FLUX // SYM-PY",
    signatureCommand: "python3 -c 'import sympy as sp; print(sp.curl)'",
  },
];

export function ArchitectFlipCards() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#050609]" id="architects">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7 space-y-4">
            <div className="section-marker">
              <span>03 — FORGE ARCHITECTS</span>
            </div>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
              ENGINEERS WHO <span className="text-[#FF5400]">BUILD.</span><br />
              MASTERS WHO <span className="text-stroke">DELIVER.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-zinc-400 text-base leading-relaxed font-body">
              Every instructor and homelab architect holds verified enterprise certifications and real production battle-scars. Hover or tap any card to inspect their verified credentials and signature cluster command.
            </p>
          </div>
        </div>

        {/* 3D Flip Card Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ARCHITECTS.map((architect) => {
            const isFlipped = flippedCards[architect.id];

            return (
              <div
                key={architect.id}
                className={`flip-card cursor-pointer ${isFlipped ? "flipped" : ""}`}
                onClick={() => toggleFlip(architect.id)}
              >
                <div className="flip-card-inner">
                  {/* Front Face */}
                  <div className="flip-face flip-front bg-[#0d1117] border border-zinc-800 hover:border-amber-500/80 transition-colors flex flex-col justify-between">
                    {/* Image Wrap */}
                    <div className="relative h-[68%] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={architect.image}
                        alt={architect.name}
                        className="w-full h-full object-cover filter grayscale contrast-125 brightness-75 transition-all duration-750"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 font-mono text-[10px] text-amber-400 tracking-[0.2em] bg-black/70 px-2 py-0.5">
                        / {architect.number}
                      </div>
                      <div className="absolute top-4 right-4 px-2 py-0.5 bg-black/70 backdrop-blur-sm font-mono text-[10px] text-zinc-300 tracking-wider">
                        ARCHITECT
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="font-mono text-[10px] text-amber-500 tracking-[0.2em] uppercase">
                          {architect.track}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-zinc-100 leading-tight">
                          {architect.name}
                        </h3>
                        <p className="text-zinc-500 text-xs font-heading tracking-wider uppercase mt-1">
                          {architect.role}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[10px] font-mono">
                        <span className="text-zinc-400">{architect.exp}</span>
                        <span className="text-amber-400 font-bold tracking-widest uppercase">
                          TAP // HOVER →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Back Face (3D Rotated) */}
                  <div className="flip-face flip-back bg-[#0d1117] border border-amber-500/70 p-6 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase mb-3">
                        / {architect.name} — CREDENTIALS
                      </div>

                      <h4 className="font-display text-2xl text-zinc-100 mb-4">
                        VERIFIED AUDIT
                      </h4>

                      <ul className="space-y-2.5 text-xs text-zinc-300 font-body">
                        {architect.credentials.map((cred) => (
                          <li key={cred} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 space-y-2">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                        SIGNATURE PROTOCOL
                      </div>
                      <div className="font-display text-lg text-amber-400">
                        {architect.signatureStack}
                      </div>
                      <div className="p-2 rounded bg-black border border-zinc-800 text-[10px] font-mono text-cyber-cyan flex items-center gap-1.5 overflow-x-auto">
                        <Terminal className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{architect.signatureCommand}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default ArchitectFlipCards;
