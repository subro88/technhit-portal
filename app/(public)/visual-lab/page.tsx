import React from "react";
import Link from "next/link";
import { Compass, Sparkles, Send, ArrowRight, Activity } from "lucide-react";
import WaveMatrixVisualizer from "@/components/visual-lab/WaveMatrixVisualizer";
import PacketRoutingDiagram from "@/components/visual-lab/PacketRoutingDiagram";
import VectorFieldVisualizer from "@/components/visual-lab/VectorFieldVisualizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Engineering & STEM Visual Lab",
  description: "GPU-accelerated visual simulations for harmonic wave matrices, cluster packet routing, and 10+2 vector fields with zero CPU waste.",
};

export default function VisualLabPage() {
  return (
    <div className="space-y-12">
      {/* Visual Lab Header */}
      <div className="p-8 rounded-2xl bg-cyber-900 border border-cyber-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-48 h-48 text-cyber-cyan" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono w-fit mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>INTERACTIVE COMPUTATIONAL SIMULATIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-100">
            Interactive Engineering & STEM Visual Lab
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-3 leading-relaxed">
            Hands-on visual simulations powered by Anime.js and WebGL/Canvas. Built with IntersectionObserver to completely halt animation loops when scrolled offscreen, guaranteeing 60 FPS and 0% background CPU waste.
          </p>
        </div>
      </div>

      {/* Lab 1: 2D Wave Matrix */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyber-cyan" />
            <span>Lab 01: 2D Harmonic Wave Matrix Dispersion</span>
          </h2>
          <Link
            href="/visual-lab/wave-matrix"
            className="text-xs font-mono text-cyber-cyan hover:underline flex items-center gap-1"
          >
            <span>STANDALONE DEMO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <WaveMatrixVisualizer />
      </section>

      {/* Lab 2: Cluster Packet Routing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
            <Send className="w-5 h-5 text-cyber-emerald" />
            <span>Lab 02: Cluster Ingress Mesh & Packet Routing</span>
          </h2>
          <Link
            href="/visual-lab/packet-routing"
            className="text-xs font-mono text-cyber-emerald hover:underline flex items-center gap-1"
          >
            <span>STANDALONE DEMO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <PacketRoutingDiagram />
      </section>

      {/* Lab 3: 10+2 Vector Field Visualizer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-mono text-zinc-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyber-amber" />
            <span>Lab 03: 10+2 Calculus & STEM Vector Field Phase Portrait</span>
          </h2>
          <Link
            href="/visual-lab/vector-field"
            className="text-xs font-mono text-cyber-amber hover:underline flex items-center gap-1"
          >
            <span>STANDALONE DEMO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <VectorFieldVisualizer />
      </section>
    </div>
  );
}
