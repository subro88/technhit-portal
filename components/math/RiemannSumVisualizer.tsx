"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme/ThemeContext";

type SliceMethod = "left" | "right" | "mid" | "trap";

export default function RiemannSumVisualizer() {
  const { isFieldGuide } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n, setN] = useState<number>(16);
  const [method, setMethod] = useState<SliceMethod>("mid");

  const a = 0;
  const b = 6;
  const f = (x: number) => 0.4 * x * x + 0.5;
  const F = (x: number) => (0.4 * x * x * x) / 3 + 0.5 * x; // Antiderivative
  const exact = F(b) - F(a); // 17.280

  const view = { xMin: -0.5, xMax: 7, yMin: -0.5, yMax: 16 };

  const mathToPx = (mx: number, my: number, w: number, h: number) => [
    ((mx - view.xMin) / (view.xMax - view.xMin)) * w,
    h - ((my - view.yMin) / (view.yMax - view.yMin)) * h,
  ];

  const computeRiemann = useCallback(() => {
    const dx = (b - a) / n;
    let sum = 0;
    const rects: Array<{
      xL: number;
      xR: number;
      hVal: number;
      fL: number;
      fR: number;
    }> = [];

    for (let i = 0; i < n; i++) {
      const xL = a + i * dx;
      const xR = a + (i + 1) * dx;
      let hVal = 0;
      if (method === "left") hVal = f(xL);
      else if (method === "right") hVal = f(xR);
      else if (method === "mid") hVal = f((xL + xR) / 2);
      else if (method === "trap") hVal = (f(xL) + f(xR)) / 2;

      rects.push({ xL, xR, hVal, fL: f(xL), fR: f(xR) });
      sum += hVal * dx;
    }

    return { sum, rects, dx };
  }, [n, method]);

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
    const rectFillColor = isFieldGuide ? "rgba(42, 117, 83, 0.22)" : "rgba(16, 185, 129, 0.25)";
    const rectStrokeColor = isFieldGuide ? "rgba(42, 117, 83, 0.75)" : "rgba(16, 185, 129, 0.85)";
    const trapTopStroke = isFieldGuide ? "rgba(42, 117, 83, 0.95)" : "rgba(16, 185, 129, 0.95)";
    const gridColor = isFieldGuide ? "rgba(11, 37, 69, 0.08)" : "rgba(255, 255, 255, 0.05)";
    const axisColor = isFieldGuide ? "rgba(11, 37, 69, 0.4)" : "rgba(0, 245, 212, 0.45)";
    const endpointFill = isFieldGuide ? "#0B2545" : "#00F5D4";
    const endpointStroke = isFieldGuide ? "#FCF9EF" : "#0d1117";

    // 1. Grid
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridColor;
    ctx.beginPath();
    const minor = 0.5;
    for (let gx = 0; gx <= view.xMax; gx += minor) {
      const px = ((gx - view.xMin) / (view.xMax - view.xMin)) * w;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
    }
    for (let gy = 0; gy <= view.yMax; gy += minor) {
      const py = h - ((gy - view.yMin) / (view.yMax - view.yMin)) * h;
      ctx.moveTo(0, py);
      ctx.lineTo(w, py);
    }
    ctx.stroke();

    // Axes
    const x0 = ((0 - view.xMin) / (view.xMax - view.xMin)) * w;
    const y0 = h - ((0 - view.yMin) / (view.yMax - view.yMin)) * h;
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = axisColor;
    ctx.beginPath();
    if (x0 >= 0 && x0 <= w) {
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, h);
    }
    if (y0 >= 0 && y0 <= h) {
      ctx.moveTo(0, y0);
      ctx.lineTo(w, y0);
    }
    ctx.stroke();

    // 2. Rectangles
    const { rects } = computeRiemann();
    ctx.fillStyle = rectFillColor;
    ctx.strokeStyle = rectStrokeColor;
    ctx.lineWidth = 1;

    rects.forEach((r) => {
      const [px1, py1] = mathToPx(r.xL, 0, w, h);
      const [px2, py2] = mathToPx(r.xR, r.hVal, w, h);
      ctx.beginPath();
      ctx.rect(px1, py2, px2 - px1, py1 - py2);
      ctx.fill();
      ctx.stroke();

      if (method === "trap") {
        const [, pyL] = mathToPx(r.xL, r.fL, w, h);
        const [, pyR] = mathToPx(r.xR, r.fR, w, h);
        ctx.beginPath();
        ctx.moveTo(px1, pyL);
        ctx.lineTo(px2, pyR);
        ctx.strokeStyle = trapTopStroke;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.strokeStyle = rectStrokeColor;
        ctx.lineWidth = 1;
      }
    });

    // 3. Curve on top
    ctx.strokeStyle = primaryCurveColor;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const samples = 300;
    const dxStep = (view.xMax - view.xMin) / samples;
    let started = false;
    for (let i = 0; i <= samples; i++) {
      const vx = view.xMin + i * dxStep;
      const vy = f(vx);
      const [px, py] = mathToPx(vx, vy, w, h);
      if (!started) {
        ctx.moveTo(px, py);
        started = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Endpoints
    [a, b].forEach((vx) => {
      const vy = f(vx);
      const [px, py] = mathToPx(vx, vy, w, h);
      ctx.fillStyle = endpointFill;
      ctx.strokeStyle = endpointStroke;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [computeRiemann, method, isFieldGuide]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  const { sum, dx } = computeRiemann();
  const error = sum - exact;

  return (
    <div className="my-8 max-w-4xl mx-auto space-y-4">
      {/* Canvas */}
      <div className="canvas-frame h-[320px] sm:h-[400px] relative">
        <div className="canvas-corner tl" />
        <div className="canvas-corner tr" />
        <div className="canvas-corner bl" />
        <div className="canvas-corner br" />
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-2.5 left-3 bg-[var(--paper-white,rgba(0,0,0,0.75))] px-2.5 py-0.5 border border-[var(--ink-faint,rgba(255,255,255,0.15))] text-[11px] font-grotesk font-semibold text-[var(--green,#10B981)]">
          <span className="inline-block w-2 h-2 mr-1.5 bg-[var(--green,#10B981)]" />
          f(x) = 0.4x² + 0.5 &nbsp;·&nbsp; on [0, 6]
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="p-4 rounded-b border border-[var(--ink,#1f2937)] bg-[var(--paper-white,#0d1117)] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)] font-semibold">
            <span>Partitions (n)</span>
            <span className="font-mono text-[var(--green,#10B981)] font-bold">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={80}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="field-slider green w-full"
          />
        </div>

        <div className="space-y-2">
          <span className="block text-xs font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)] font-semibold">
            Slice Method
          </span>
          <div className="flex border border-[var(--green,#10B981)] rounded overflow-hidden">
            {(["left", "right", "mid", "trap"] as SliceMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-1 text-[11px] font-grotesk uppercase tracking-wider transition-colors cursor-pointer border-r border-[var(--green-soft,#10B981)] last:border-r-0 ${
                  method === m
                    ? "bg-[var(--green,#10B981)] text-white font-bold"
                    : "text-[var(--green,#10B981)] hover:bg-[var(--green-soft,rgba(16,185,129,0.15))]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-[var(--ink-faint,#1f2937)] sm:pl-6">
          <div className="text-[10px] font-grotesk uppercase tracking-wider text-[var(--ink-soft,#a1a1aa)]">
            Exact Integral (FTC)
          </div>
          <div className="font-mono text-xl font-bold text-[var(--green,#10B981)]">
            {exact.toFixed(3)}
          </div>
          <div className="text-[10px] font-mono text-[var(--ink-soft,#71717a)]">
            ∫₀⁶ f(x)dx = F(6) - F(0)
          </div>
        </div>
      </div>

      {/* Numerical Stats Ribbon */}
      <div className="field-readout grid grid-cols-3">
        <div className="field-readout-cell">
          <div className="field-readout-label">Riemann Sum Approx</div>
          <div className="field-readout-value text-[var(--green,#10B981)]">
            {sum.toFixed(4)}
          </div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">Numerical Error</div>
          <div className="field-readout-value text-[var(--orange,#FF7A33)]">
            {error >= 0 ? "+" : "−"}{Math.abs(error).toFixed(4)}
          </div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">Partition Width Δx</div>
          <div className="field-readout-value">
            {dx.toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}
