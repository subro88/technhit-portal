"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Hand } from "lucide-react";

interface CaseStudy {
  id: string;
  caseNum: string;
  badge: string;
  title: string;
  timeframe: string;
  quote: string;
  author: string;
  stats: { value: string; label: string }[];
  image: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "ceph-migration",
    caseNum: "01",
    badge: "40 TB STORAGE",
    title: "MIGRATING 40TB BARE-METAL TO CEPH SDS",
    timeframe: "3 WEEKS",
    quote:
      "Following the TechNHIT Ceph Reef guide, we migrated 40TB of critical virtual machine disks across 3 nodes with zero service interruption. Latency dropped by 42%.",
    author: "DEVON M. // SYSADMIN @ CLOUDCORE",
    stats: [
      { value: "40TB", label: "Ceph NVMe" },
      { value: "0 ms", label: "Downtime" },
      { value: "-42%", label: "Latency" },
    ],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "deepseek-local",
    caseNum: "02",
    badge: "DEEPSEEK-R1",
    title: "SELF-HOSTED LOCAL AI CLUSTER WITH vLLM",
    timeframe: "4 DAYS",
    quote:
      "We turned two surplus RTX 3090 workstations into a high-throughput vLLM cluster serving DeepSeek-R1 32B. We now process 150k token prompts offline with zero cloud API bills.",
    author: "ARJUN K. // AI LAB LEAD",
    stats: [
      { value: "32B", label: "Model Size" },
      { value: "45 t/s", label: "Throughput" },
      { value: "$0", label: "Cloud Cost" },
    ],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "stem-calculus",
    caseNum: "03",
    badge: "10+2 STEM",
    title: "FROM 10+2 DERIVATIVES TO 3D FLUID SIMULATION",
    timeframe: "2 MONTHS",
    quote:
      "The visual approach to multivariable vector calculus in the TechNHIT lab helped me see gradient fields geometrically. I ended up coding an interactive Navier-Stokes solver for my senior science fair.",
    author: "PRIYA S. // GRADE 12 CANDIDATE",
    stats: [
      { value: "98%", label: "Board Math" },
      { value: "3D", label: "Fluid Engine" },
      { value: "10+2", label: "STEM Grade" },
    ],
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "k3s-homelab",
    caseNum: "04",
    badge: "K3s GITOPS",
    title: "REPRODUCIBLE MULTI-NODE HOMELAB SYNDICATE",
    timeframe: "1 WEEK",
    quote:
      "Automated the entire cluster provisioning using Ansible and ArgoCD. From bare-metal flashing to ingress cert-manager in under 15 minutes.",
    author: "LEO V. // DEVOPS ENGINEER",
    stats: [
      { value: "5 Nodes", label: "Micro-Cluster" },
      { value: "100%", label: "GitOps Paved" },
      { value: "15 min", label: "Zero-To-Live" },
    ],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
  },
];

export function ClusterStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentTranslateRef = useRef(0);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(CASE_STUDIES.length - 1, index));
    setCurrentIndex(clamped);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % CASE_STUDIES.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length);
  };

  // Mouse / Touch Drag Support
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startXRef.current;

    if (diff > 60) {
      prev();
    } else if (diff < -60) {
      next();
    }
  };

  return (
    <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#07090e] overflow-hidden" id="stories">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mb-14">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="section-marker">
              <span>04 — FORGED IN THE HOMELAB</span>
            </div>
            <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
              REAL DEPLOYMENTS.<br />
              <span className="text-[#FF5400]">PROVEN</span> RESULTS.
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="text-zinc-400 text-base leading-relaxed font-body mb-4">
              Every case study below was engineered and tested in live labs. No theoretical slop—just verified configurations and real architecture benchmarks.
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              <Hand className="w-3.5 h-3.5 text-amber-500" />
              <span>SWIPE / DRAG TO ADVANCE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Track Viewport */}
      <div
        className="max-w-[1600px] mx-auto px-6 lg:px-10 overflow-hidden select-none"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="w-full flex-shrink-0 grid md:grid-cols-12 gap-8 bg-[#0d1117] border border-zinc-800 p-8 lg:p-10 notch-corner"
            >
              {/* Left Image & Badge */}
              <div className="md:col-span-5 relative h-64 md:h-full min-h-[260px] rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-full object-cover filter grayscale contrast-125 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 font-mono text-[11px] text-amber-400 tracking-widest bg-black/70 px-2 py-0.5">
                  CASE // {study.caseNum}
                </div>
                <div className="absolute bottom-4 right-4 bg-amber-500 text-black font-mono text-xs font-bold px-2.5 py-1">
                  {study.badge}
                </div>
              </div>

              {/* Right Details */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2">
                    <span>TIMEFRAME: {study.timeframe}</span>
                    <span className="text-amber-400">VERIFIED HOMELAB</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl text-zinc-100 leading-tight">
                    {study.title}
                  </h3>
                  <blockquote className="text-zinc-300 text-base italic leading-relaxed mt-4 font-body border-l-2 border-amber-500 pl-4">
                    &ldquo;{study.quote}&rdquo;
                  </blockquote>
                  <div className="font-mono text-xs text-zinc-400 tracking-wider mt-3">
                    — {study.author}
                  </div>
                </div>

                {/* Metrics Matrix */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
                  {study.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-3xl sm:text-4xl text-amber-400">
                        {stat.value}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-between pt-8">
          <div className="flex items-center gap-2">
            {CASE_STUDIES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 ${
                  currentIndex === i ? "w-8 h-1.5 bg-amber-500" : "w-2.5 h-1.5 bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 border border-zinc-700 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center text-zinc-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="w-11 h-11 border border-zinc-700 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-colors flex items-center justify-center text-zinc-300"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default ClusterStoriesCarousel;
