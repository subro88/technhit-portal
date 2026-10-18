"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme/ThemeContext";

export default function EpsilonDeltaExplorer() {
  const { isFieldGuide } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [eps, setEps] = useState<number>(0.4);
  const [delta, setDelta] = useState<number>(0.0975);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  const a = 2; // limit point
  const L = 4; // limit value (a^2)
  const view = { xMin: 1, xMax: 3, yMin: 0.5, yMax: 8 };

  const computeDelta = (targetEps: number) => {
    if (targetEps >= 4) return 1;
    const lo = Math.sqrt(4 - targetEps);
    const hi = Math.sqrt(4 + targetEps);
    return Math.min(2 - lo, hi - 2);
  };

  const mathToPx = (mx: number, my: number, w: number, h: number) => [
    ((mx - view.xMin) / (view.xMax - view.xMin)) * w,
    h - ((my - view.yMin) / (view.yMax - view.yMin)) * h,
  ];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(2, Math.floor(rect.width * dpr));
    canvas.height = Math.max(2, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Dynamic Theme Color Palette
    const primaryCurveColor = isFieldGuide ? "#0B2545" : "#00F5D4";
    const gridColor = isFieldGuide ? "rgba(11, 37, 69, 0.08)" : "rgba(255, 255, 255, 0.05)";
    const axisColor = isFieldGuide ? "rgba(11, 37, 69, 0.4)" : "rgba(0, 245, 212, 0.45)";
    const annotColor = isFieldGuide ? "rgba(11, 37, 69, 0.85)" : "rgba(255, 255, 255, 0.85)";
    const epsFill = isFieldGuide ? "rgba(42, 117, 83, 0.16)" : "rgba(16, 185, 129, 0.20)";
    const epsStroke = isFieldGuide ? "rgba(42, 117, 83, 0.75)" : "rgba(16, 185, 129, 0.85)";
    const deltaFill = isFieldGuide ? "rgba(215, 92, 42, 0.14)" : "rgba(255, 122, 51, 0.18)";
    const deltaStroke = isFieldGuide ? "rgba(215, 92, 42, 0.75)" : "rgba(255, 122, 51, 0.85)";
    const critPointStroke = isFieldGuide ? "#0B2545" : "#00F5D4";
    const critPointFill = isFieldGuide ? "#FCF9EF" : "#0d1117";
    const deltaPointFill = isFieldGuide ? "#D75C2A" : "#FF7A33";
    const deltaPointStroke = isFieldGuide ? "#FCF9EF" : "#0d1117";

    // 1. Grid
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    for (let gx = view.xMin; gx <= view.xMax; gx += 0.2) {
      const px = ((gx - view.xMin) / (view.xMax - view.xMin)) * w;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
    }
    for (let gy = view.yMin; gy <= view.yMax; gy += 0.5) {
      const py = h - ((gy - view.yMin) / (view.yMax - view.yMin)) * h;
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
    }
    ctx.stroke();

    // 2. ε Band (Horizontal, Green)
    const [, pyE1] = mathToPx(0, L - eps, w, h);
    const [, pyE2] = mathToPx(0, L + eps, w, h);
    ctx.fillStyle = epsFill;
    ctx.fillRect(0, pyE2, w, pyE1 - pyE2);
    ctx.strokeStyle = epsStroke;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(0, pyE1);
    ctx.lineTo(w, pyE1);
    ctx.moveTo(0, pyE2);
    ctx.lineTo(w, pyE2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. δ Band (Vertical, Orange)
    const [pxD1] = mathToPx(a - delta, 0, w, h);
    const [pxD2] = mathToPx(a + delta, 0, w, h);
    ctx.fillStyle = deltaFill;
    ctx.fillRect(pxD1, 0, pxD2 - pxD1, h);
    ctx.strokeStyle = deltaStroke;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(pxD1, 0);
    ctx.lineTo(pxD1, h);
    ctx.moveTo(pxD2, 0);
    ctx.lineTo(pxD2, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Curve f(x) = x²
    ctx.strokeStyle = primaryCurveColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const samples = 300;
    const dx = (view.xMax - view.xMin) / samples;
    let started = false;
    for (let i = 0; i <= samples; i++) {
      const vx = view.xMin + i * dx;
      const vy = vx * vx;
      const [px, py] = mathToPx(vx, vy, w, h);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // 5. Critical Points
    const [pa, pL] = mathToPx(a, L, w, h);
    ctx.fillStyle = critPointFill;
    ctx.strokeStyle = critPointStroke;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pa, pL, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // End points on delta boundaries
    [a - delta, a + delta].forEach((vx) => {
      const vy = vx * vx;
      const [px, py] = mathToPx(vx, vy, w, h);
      ctx.fillStyle = deltaPointFill;
      ctx.strokeStyle = deltaPointStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Annotations
    ctx.fillStyle = annotColor;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`L + ε = ${(L + eps).toFixed(3)}`, w - 120, pyE2 - 4);
    ctx.fillText(`L − ε = ${(L - eps).toFixed(3)}`, w - 120, pyE1 + 12);
  }, [eps, delta, L, a, view, isFieldGuide]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const handleEpsChange = (newEps: number) => {
    setEps(newEps);
    const newDelta = computeDelta(newEps);
    setDelta(newDelta);
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
  };

  return (
    <div className="my-8 max-w-4xl mx-auto space-y-4">
      {/* Canvas */}
      <div className="canvas-frame h-[320px] sm:h-[400px] relative">
        <div className="canvas-corner tl" />
        <div className="canvas-corner tr" />
        <div className="canvas-corner bl" />
        <div className="canvas-corner br" />
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-2.5 left-3 bg-[var(--paper-white,rgba(0,0,0,0.75))] px-2.5 py-0.5 border border-[var(--ink-faint,rgba(255,255,255,0.15))] text-[11px] font-grotesk font-semibold text-[var(--ink,#e4e4e7)]">
          f(x) = x² &nbsp;·&nbsp; lim_(x→2) f(x) = 4
        </div>
      </div>

      {/* Sliders & Contract Status */}
      <div className="p-4 rounded border border-[var(--ink,#1f2937)] bg-[var(--paper-white,#0d1117)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)] font-semibold">
              <span>Target Tolerance (ε)</span>
              <span className="font-mono text-[var(--green,#10B981)] font-bold">{eps.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.5}
              step={0.01}
              value={eps}
              onChange={(e) => handleEpsChange(parseFloat(e.target.value))}
              className="field-slider green w-full"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)] font-semibold">
              <span>Auto Neighborhood (δ)</span>
              <span className="font-mono text-[var(--orange,#FF7A33)] font-bold">{delta.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.5}
              step={0.001}
              value={delta}
              readOnly
              className="field-slider orange w-full opacity-80"
            />
          </div>
        </div>

        {/* Contract Statement */}
        <div
          className={`p-3 rounded border-l-4 font-newsreader italic text-xs sm:text-sm transition-all duration-300 ${
            isFlashing
              ? "bg-[var(--green,#10B981)] text-white border-[var(--green-deep,#064e3b)]"
              : "bg-[var(--green-soft,rgba(16,185,129,0.1))] text-[var(--ink,#e4e4e7)] border-[var(--green,#10B981)]"
          }`}
        >
          For every tolerance <strong className="font-mono not-italic font-bold">ε = {eps.toFixed(3)}</strong>, choosing <strong className="font-mono not-italic font-bold">δ = {delta.toFixed(4)}</strong> guarantees that whenever <span className="font-mono not-italic">0 &lt; |x − 2| &lt; δ</span>, the function strictly satisfies <span className="font-mono not-italic">|x² − 4| &lt; ε</span>. ∎
        </div>
      </div>
    </div>
  );
}
