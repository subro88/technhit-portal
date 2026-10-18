import React from "react";
import VectorFieldVisualizer from "@/components/visual-lab/VectorFieldVisualizer";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10+2 Calculus & STEM Vector Field Simulation",
  description: "Phase portrait vector field visualizer demonstrating differential trajectories, divergence, and curl for Senior Secondary students.",
};

export default function VectorFieldPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/visual-lab"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--ink-soft,#a1a1aa)] hover:text-[var(--orange,#FF7A33)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO VISUAL LAB</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-grotesk text-[var(--ink,#f4f4f5)] flex items-center gap-2">
          <Compass className="w-6 h-6 text-[var(--orange,#FF7A33)]" />
          <span>10+2 Calculus & STEM Vector Fields</span>
        </h1>
        <p className="text-sm sm:text-base text-[var(--ink-2,#a1a1aa)] font-newsreader leading-relaxed">
          Interactive phase space trajectories visualizing velocity fields, rotational vortices, and central attraction potentials for high school mathematics and physics students.
        </p>
      </div>

      <VectorFieldVisualizer />
    </div>
  );
}
