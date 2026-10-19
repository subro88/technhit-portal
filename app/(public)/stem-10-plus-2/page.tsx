import React from "react";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { BookOpen, Calendar, Clock, ArrowRight, FunctionSquare, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10+2 Mathematics & STEM Engineering Foundation",
  description: "Senior Secondary (Grade 11 & 12) Calculus, Vectors, Coordinate Geometry, Differential Equations, and Classical Physics simulation lab.",
};

export const revalidate = 60;

export default function Stem10Plus2Page() {
  const posts = getPostsByCategory("stem-10-plus-2");

  return (
    <div className="space-y-10">
      <div className="p-8 rounded-2xl bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-[var(--ink,#e4e4e7)]">
          <BookOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--orange-soft,rgba(255,84,0,0.1))] border border-[var(--orange,#FF7A33)] text-[var(--orange,#FF7A33)] text-xs font-mono w-fit mb-3">
            <FunctionSquare className="w-3.5 h-3.5" />
            <span>10+2 SENIOR SECONDARY & ENGINEERING DRAWINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-grotesk text-[var(--ink,#f4f4f5)]">
            10+2 Math & STEM Field Guide Lab
          </h1>
          <p className="text-sm font-newsreader italic text-[var(--ink-2,#a1a1aa)] mt-3 leading-relaxed">
            Rigorous mathematical and engineering fundamentals for 10+2 students (CBSE, ISC, WBCHSE, State Boards). Interactive visual models for Differential Calculus, Vector Fields, Riemann Accumulation, and Engineering Drafting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/stem-10-plus-2/${post.slug}`}
            className="group p-6 rounded-xl bg-[var(--paper-white,#0d1117)] border border-[var(--ink-faint,#1f2937)] hover:border-[var(--orange,#FF7A33)] hover:bg-[var(--paper-warm,#161b22)] transition-all flex flex-col justify-between cursor-pointer shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-soft,#a1a1aa)] mb-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime} MIN</span>
                </span>
              </div>

              <h2 className="text-lg font-bold font-grotesk text-[var(--ink,#f4f4f5)] group-hover:text-[var(--orange,#FF7A33)] transition-colors mt-2">
                {post.title}
              </h2>
              <p className="text-xs text-[var(--ink-soft,#a1a1aa)] font-newsreader mt-2 line-clamp-3 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--ink-trace,rgba(255,255,255,0.1))] text-xs font-mono text-[var(--ink-soft,#a1a1aa)] group-hover:text-[var(--ink,#f4f4f5)]">
              <span className="text-[var(--orange,#FF7A33)] font-bold font-grotesk uppercase tracking-wider">OPEN FIELD GUIDE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
