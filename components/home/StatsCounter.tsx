"use client";

import React, { useEffect, useState, useRef } from "react";

interface StatItem {
  count: number;
  suffix?: string;
  label: string;
  color?: string;
}

const STATS: StatItem[] = [
  { count: 12, suffix: "+", label: "YEARS SYSTEMS ENGINEERING", color: "text-zinc-100" },
  { count: 14200, suffix: "+", label: "ENGINEERS IN HOMELAB SYNDICATE", color: "text-amber-400" },
  { count: 99.9, suffix: "%", label: "HIGH-AVAILABILITY UPTIME TARGET", color: "text-cyber-cyan" },
  { count: 100, suffix: "%", label: "REPRODUCIBLE GITOPS RECIPES", color: "text-cyber-emerald" },
];

export function StatsCounter() {
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);

            setCounts(
              STATS.map((stat) => {
                if (stat.count < 100 && !Number.isInteger(stat.count)) {
                  return Number((easeOutCubic * stat.count).toFixed(1));
                }
                return Math.floor(easeOutCubic * stat.count);
              })
            );

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts(STATS.map((s) => s.count));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="border-b border-zinc-800 bg-[#050609] py-16 lg:py-20">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-8">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="border-l-2 border-zinc-800 hover:border-amber-500 pl-6 transition-colors">
              <div className={`font-display text-5xl sm:text-6xl md:text-7xl font-bold ${stat.color} tracking-tight`}>
                {counts[i].toLocaleString()}
                <span className="text-amber-500">{stat.suffix}</span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400 tracking-[0.2em] uppercase mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default StatsCounter;
