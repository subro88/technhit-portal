"use client";

import React, { useState } from "react";
import Image from "next/image";

interface TuxGearLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function TuxGearLogo({ size = 48, className = "", showText = true }: TuxGearLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Outer Gear Container with Dynamic Rotation */}
      <div
        className="relative flex items-center justify-center transition-transform duration-700 ease-out"
        style={{ width: size, height: size }}
      >
        {/* Animated Cyber-Gold Halo */}
        <div
          className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-500/40 via-cyber-cyan/30 to-orange-600/40 blur-sm transition-opacity duration-500 ${
            isHovered ? "opacity-100 scale-110" : "opacity-30"
          }`}
        />

        {/* Rotating Mechanical Gear Ring */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute inset-0 w-full h-full text-amber-400 pointer-events-none transition-transform duration-1000 ease-out ${
            isHovered ? "rotate-90 scale-105" : "rotate-0"
          }`}
        >
          <defs>
            <linearGradient id="gearGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="gearGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.5" />
            </filter>
          </defs>
          {/* Outer Gear Teeth Outline */}
          <path
            d="M 50,5
               L 54,12 A 42,42 0 0,1 62,15 L 69,10 L 73,15 L 69,22 A 42,42 0 0,1 75,28 L 83,27 L 85,34 L 79,38 A 42,42 0 0,1 81,46 L 89,48 L 89,55 L 81,57 A 42,42 0 0,1 78,65 L 85,69 L 82,75 L 75,74 A 42,42 0 0,1 68,80 L 71,87 L 65,90 L 60,84 A 42,42 0 0,1 52,86 L 50,94 L 44,93 L 44,86 A 42,42 0 0,1 36,83 L 31,89 L 26,85 L 29,78 A 42,42 0 0,1 23,72 L 15,73 L 13,67 L 20,62 A 42,42 0 0,1 18,54 L 10,52 L 10,46 L 18,44 A 42,42 0 0,1 21,36 L 15,31 L 18,25 L 25,27 A 42,42 0 0,1 32,21 L 29,14 L 35,11 L 40,17 A 42,42 0 0,1 48,15 Z"
            fill="url(#gearGold)"
            stroke="#b45309"
            strokeWidth="1.5"
            filter="url(#gearGlow)"
          />
        </svg>

        {/* Center Circular Badge with Tux Image */}
        <div className="relative z-10 w-[78%] h-[78%] rounded-full overflow-hidden border-2 border-amber-400/80 bg-zinc-950 shadow-inner">
          <Image
            src="/images/tux-logo.jpg"
            alt="TechNHIT Tux Logo"
            fill
            sizes="96px"
            className="object-cover scale-110"
            priority
          />
        </div>
      </div>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-display text-2xl tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors leading-none">
            <span>TECH</span>
            <span className="text-amber-400 font-bold">NHIT</span>
          </div>
          <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 uppercase mt-0.5 group-hover:text-cyber-cyan transition-colors">
            &gt;_TECH BLOG TUTORIAL
          </div>
        </div>
      )}
    </div>
  );
}
export default TuxGearLogo;
