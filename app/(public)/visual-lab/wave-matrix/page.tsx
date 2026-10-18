import React from "react";
import WaveMatrixVisualizer from "@/components/visual-lab/WaveMatrixVisualizer";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wave Matrix 2D Harmonic Dispersion Demo",
  description: "GPU-accelerated Anime.js radial stagger simulation demonstrating 2D harmonic wave propagation.",
};

export default function WaveMatrixPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/visual-lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyber-cyan transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO VISUAL LAB</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyber-cyan" />
          <span>2D Harmonic Wave Dispersion</span>
        </h1>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          Interactive radial stagger wave propagation modeling discrete 2D field oscillations. Built with Anime.js v3.2 and IntersectionObserver.
        </p>
      </div>

      <WaveMatrixVisualizer />
    </div>
  );
}
