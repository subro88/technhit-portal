import React from "react";
import Link from "next/link";
import { HeroReelWithRack } from "@/components/home/HeroReelWithRack";
import { StatsCounter } from "@/components/home/StatsCounter";
import { TrackGrid } from "@/components/home/TrackGrid";
import { ArchitectFlipCards } from "@/components/home/ArchitectFlipCards";
import { ClusterStoriesCarousel } from "@/components/home/ClusterStoriesCarousel";
import { SyndicateTerminalForm } from "@/components/home/SyndicateTerminalForm";
import { StickyCtaBar } from "@/components/home/StickyCtaBar";
import WaveMatrixVisualizer from "@/components/visual-lab/WaveMatrixVisualizer";
import VectorFieldVisualizer from "@/components/visual-lab/VectorFieldVisualizer";
import { getAllPosts } from "@/lib/posts";
import { ArrowRight, Terminal, BookOpen, Compass, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const posts = getAllPosts();
  const latestPosts = posts.slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. Industrial Brutalist Hero with Live Reel & 3D Cluster Switcher */}
      <HeroReelWithRack />

      {/* 2. Number Counter Stats Strip */}
      <StatsCounter />

      {/* 3. Five Core Engineering Tracks with Corner Notch Cards */}
      <TrackGrid />

      {/* 4. Interactive Visual Lab Showcase (Wave Matrix & 10+2 Vector Field) */}
      <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#050609]" id="visual-lab">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-8 mb-16 items-end">
            <div className="lg:col-span-7 space-y-4">
              <div className="section-marker">
                <span>03.5 — VISUAL SIMULATION LAB</span>
              </div>
              <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
                PHYSICS IN MOTION.<br />
                <span className="text-[#00F5D4]">MATHEMATICS</span> IN REAL-TIME.
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-end">
              <p className="text-zinc-400 text-base leading-relaxed font-body mb-4">
                Powered by Anime.js and WebGL. Every simulation below dynamically computes differential equations, cluster packet paths, or gradient curls with zero UI stutter.
              </p>
              <Link
                href="/visual-lab"
                className="font-heading text-xs tracking-[0.2em] uppercase text-cyber-cyan hover:text-white transition-colors flex items-center gap-2"
              >
                <span>OPEN FULL INTERACTIVE LAB</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Wave Matrix Demo */}
            <div className="bg-[#0d1117] border border-zinc-800 p-6 notch-corner space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="font-mono text-xs text-cyber-cyan tracking-widest uppercase">
                  SIMULATION / 01: HARMONIC WAVE MATRIX
                </span>
                <span className="font-mono text-[10px] text-zinc-400">ANIME.JS ENGINE</span>
              </div>
              <WaveMatrixVisualizer />
            </div>

            {/* 10+2 Vector Field Demo */}
            <div className="bg-[#0d1117] border border-zinc-800 p-6 notch-corner space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                  SIMULATION / 02: 10+2 VECTOR FIELD & GRADIENT CURL
                </span>
                <span className="font-mono text-[10px] text-zinc-400">CALCULUS LAB</span>
              </div>
              <VectorFieldVisualizer />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3D Perspective Flip Cards for Architects & Instructors */}
      <ArchitectFlipCards />

      {/* 6. Drag-and-Swipe Real Homelab Case Studies Carousel */}
      <ClusterStoriesCarousel />

      {/* 7. Latest Technical Articles & Publication Directory */}
      <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#07090e]" id="publications">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <div className="section-marker">
                <span>04.5 — PEER-REVIEWED ARCHITECTURE</span>
              </div>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none text-zinc-100">
                LATEST TECHNICAL <span className="text-[#FF5400]">PUBLICATIONS</span>
              </h2>
            </div>
            <Link
              href="/linux-server-admin"
              className="font-heading text-xs tracking-[0.2em] uppercase text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-2"
            >
              <span>VIEW FULL REPOSITORY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.category}/${post.slug}`}
                className="bg-[#0d1117] border border-zinc-800 hover:border-amber-500/80 p-6 transition-all duration-300 flex flex-col justify-between group notch-corner"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-amber-400 tracking-widest uppercase">
                      {post.category}
                    </span>
                    <span className="text-zinc-500">{post.date}</span>
                  </div>

                  <h3 className="font-display text-2xl text-zinc-100 group-hover:text-amber-400 transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 font-body">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono mt-6">
                  <span className="text-zinc-500">{post.readTime} MIN READ</span>
                  <span className="text-amber-500 font-bold group-hover:translate-x-1 transition-transform">
                    READ GUIDE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Conversion Terminal / Homelab Syndicate Form */}
      <SyndicateTerminalForm />

      {/* 9. Sticky CTA Bar */}
      <StickyCtaBar />
    </div>
  );
}
