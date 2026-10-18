"use client";

import React, { useRef, useEffect, useState } from "react";

export default function CalculusFieldGuideHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [readout, setReadout] = useState({
    x: "+0.000",
    fx: "+0.000",
    slope: "+1.000",
    eq: "y = 0.00 + 1.00(x - 0.00)",
  });
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let isVisible = true;
    let x = -Math.PI;
    const speed = 0.7;
    let direction = 1;
    const range = Math.PI * 1.5;
    let lastT = performance.now();

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const setupCanvas = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.floor(rect.width * dpr));
      canvas.height = Math.max(2, Math.floor(rect.height * dpr));
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w: rect.width, h: rect.height };
    };

    let { ctx, w, h } = setupCanvas();
    const handleResize = () => {
      const res = setupCanvas();
      ctx = res.ctx;
      w = res.w;
      h = res.h;
    };
    window.addEventListener("resize", handleResize);

    const mathToPx = (
      mx: number,
      my: number,
      view: { xMin: number; xMax: number; yMin: number; yMax: number },
      bw: number,
      bh: number
    ) => [
      ((mx - view.xMin) / (view.xMax - view.xMin)) * bw,
      bh - ((my - view.yMin) / (view.yMax - view.yMin)) * bh,
    ];

    const drawGrid = (
      context: CanvasRenderingContext2D,
      bw: number,
      bh: number,
      view: { xMin: number; xMax: number; yMin: number; yMax: number }
    ) => {
      // Minor lines
      context.lineWidth = 0.5;
      context.strokeStyle = "rgba(11, 37, 69, 0.08)";
      context.beginPath();
      const minor = 0.2;
      const xStartM = Math.ceil(view.xMin / minor) * minor;
      for (let gx = xStartM; gx <= view.xMax; gx += minor) {
        const px = ((gx - view.xMin) / (view.xMax - view.xMin)) * bw;
        context.moveTo(px, 0);
        context.lineTo(px, bh);
      }
      const yStartM = Math.ceil(view.yMin / minor) * minor;
      for (let gy = yStartM; gy <= view.yMax; gy += minor) {
        const py = bh - ((gy - view.yMin) / (view.yMax - view.yMin)) * bh;
        context.moveTo(0, py);
        context.lineTo(bw, py);
      }
      context.stroke();

      // Major axes
      const x0 = ((0 - view.xMin) / (view.xMax - view.xMin)) * bw;
      const y0 = bh - ((0 - view.yMin) / (view.yMax - view.yMin)) * bh;
      context.lineWidth = 1.2;
      context.strokeStyle = "rgba(11, 37, 69, 0.35)";
      context.beginPath();
      if (x0 >= 0 && x0 <= bw) {
        context.moveTo(x0, 0);
        context.lineTo(x0, bh);
      }
      if (y0 >= 0 && y0 <= bh) {
        context.moveTo(0, y0);
        context.lineTo(bw, y0);
      }
      context.stroke();
    };

    const plotFn = (
      context: CanvasRenderingContext2D,
      f: (v: number) => number,
      view: { xMin: number; xMax: number; yMin: number; yMax: number },
      bw: number,
      bh: number,
      color: string,
      lineWidth = 2
    ) => {
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.beginPath();
      const samples = 400;
      const dx = (view.xMax - view.xMin) / samples;
      let started = false;
      for (let i = 0; i <= samples; i++) {
        const vx = view.xMin + i * dx;
        const vy = f(vx);
        const px = ((vx - view.xMin) / (view.xMax - view.xMin)) * bw;
        const py = bh - ((vy - view.yMin) / (view.yMax - view.yMin)) * bh;
        if (!started) {
          context.moveTo(px, py);
          started = true;
        } else {
          context.lineTo(px, py);
        }
      }
      context.stroke();
    };

    const renderLoop = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      if (isPlaying && isVisible) {
        x += direction * speed * dt;
        if (x > range) {
          x = range;
          direction = -1;
        }
        if (x < -range) {
          x = -range;
          direction = 1;
        }
      }

      if (ctx && isVisible) {
        ctx.clearRect(0, 0, w, h);
        const split = h * 0.62;
        const viewTop = {
          xMin: -Math.PI * 1.2,
          xMax: Math.PI * 1.2,
          yMin: -1.6,
          yMax: 1.6,
        };
        const viewBot = {
          xMin: -Math.PI * 1.2,
          xMax: Math.PI * 1.2,
          yMin: -1.6,
          yMax: 1.6,
        };

        // TOP: sin(x) with Tangent
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, split);
        ctx.clip();
        drawGrid(ctx, w, split, viewTop);

        plotFn(ctx, Math.sin, viewTop, w, split, "#0B2545", 2.4);

        // Tangent
        const slope = Math.cos(x);
        const yVal = Math.sin(x);
        const x1 = viewTop.xMin;
        const x2 = viewTop.xMax;
        const y1 = yVal + slope * (x1 - x);
        const y2 = yVal + slope * (x2 - x);
        const [tx1, ty1] = mathToPx(x1, y1, viewTop, w, split);
        const [tx2, ty2] = mathToPx(x2, y2, viewTop, w, split);

        ctx.strokeStyle = "rgba(215, 92, 42, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();

        // Dropline
        const [px, py] = mathToPx(x, yVal, viewTop, w, split);
        const [pxBase] = mathToPx(x, 0, viewTop, w, split);
        ctx.strokeStyle = "rgba(215, 92, 42, 0.35)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(pxBase, py);
        ctx.lineTo(pxBase, split);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draggable point on curve
        ctx.fillStyle = "#D75C2A";
        ctx.strokeStyle = "#FCF9EF";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Small slope triangle
        const triDx = 0.35;
        const triDy = slope * triDx;
        const [tp1x, tp1y] = mathToPx(x, yVal, viewTop, w, split);
        const [tp2x, tp2y] = mathToPx(x + triDx, yVal, viewTop, w, split);
        const [tp3x, tp3y] = mathToPx(x + triDx, yVal + triDy, viewTop, w, split);
        ctx.strokeStyle = "rgba(215, 92, 42, 0.6)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tp1x, tp1y);
        ctx.lineTo(tp2x, tp2y);
        ctx.lineTo(tp3x, tp3y);
        ctx.stroke();

        ctx.restore();

        // Divider
        ctx.strokeStyle = "rgba(11, 37, 69, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, split);
        ctx.lineTo(w, split);
        ctx.stroke();

        // BOTTOM: cos(x) derivative trace
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, split, w, h - split);
        ctx.clip();
        ctx.translate(0, split);
        const bh = h - split;
        drawGrid(ctx, w, bh, viewBot);

        plotFn(ctx, Math.cos, viewBot, w, bh, "rgba(11, 37, 69, 0.35)", 1.5);

        // Filled trace from -range to current x
        const samples = 150;
        const xStart = -range;
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= samples; i++) {
          const xi = xStart + (x - xStart) * (i / samples);
          const yi = Math.cos(xi);
          const [cxPx, cyPx] = mathToPx(xi, yi, viewBot, w, bh);
          if (!started) {
            ctx.moveTo(cxPx, cyPx);
            started = true;
          } else {
            ctx.lineTo(cxPx, cyPx);
          }
        }
        ctx.strokeStyle = "#D75C2A";
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Point on derivative
        const [dpx, dpy] = mathToPx(x, Math.cos(x), viewBot, w, bh);
        ctx.fillStyle = "#0B2545";
        ctx.strokeStyle = "#FCF9EF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dpx, dpy, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // Update readouts
        setReadout({
          x: (x >= 0 ? "+" : "") + x.toFixed(3),
          fx: (yVal >= 0 ? "+" : "") + yVal.toFixed(3),
          slope: (slope >= 0 ? "+" : "") + slope.toFixed(3),
          eq: `y = ${yVal.toFixed(2)} ${slope >= 0 ? "+" : "−"} ${Math.abs(slope).toFixed(2)}(x − ${x.toFixed(2)})`,
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="my-10 max-w-5xl mx-auto">
      {/* Meta epigraph */}
      <div className="flex items-center gap-3 mb-4 font-mono text-xs uppercase tracking-widest text-[var(--ink-soft,#a1a1aa)]">
        <span className="w-8 h-[1px] bg-[var(--ink,#e4e4e7)]" />
        <span>§ 00 — A Visual Field Guide to Continuous Change</span>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-3">
        <h2 className="font-grotesk text-3xl sm:text-5xl font-bold tracking-tight text-[var(--ink,#f4f4f5)]">
          Calcu<span className="font-newsreader italic text-[var(--orange,#FF7A33)] font-normal">·</span>lus
        </h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--orange,#FF7A33)] text-[var(--orange,#FF7A33)] text-[10px] font-grotesk tracking-widest uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange,#FF7A33)]" />
            Derivatives
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--green,#10B981)] text-[var(--green,#10B981)] text-[10px] font-grotesk tracking-widest uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green,#10B981)]" />
            Integrals
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--ink,#71717a)] text-[var(--ink,#e4e4e7)] text-[10px] font-grotesk tracking-widest uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink,#71717a)]" />
            Limits
          </span>
        </div>
      </div>

      <p className="font-newsreader italic text-base sm:text-lg text-[var(--ink-2,#d4d4d8)] max-w-2xl mb-6 leading-snug">
        The architecture of change — rendered across three foundations, one language, and the slope of a single line.
      </p>

      {/* Main Drafting Canvas Frame */}
      <div className="canvas-frame h-[380px] sm:h-[480px] relative cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
        <div className="canvas-corner tl" />
        <div className="canvas-corner tr" />
        <div className="canvas-corner bl" />
        <div className="canvas-corner br" />
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Function tag in top corner */}
        <div className="absolute top-3 left-3 bg-[var(--paper-white,rgba(0,0,0,0.75))] px-3 py-1 border border-[var(--ink-faint,rgba(255,255,255,0.15))] text-[11px] font-mono text-[var(--ink-soft,#d4d4d8)] pointer-events-none">
          f(x) = sin(x) &nbsp;·&nbsp; f′(x) = cos(x) {isPlaying ? "• (Click to Pause)" : "⏸ (Paused)"}
        </div>
      </div>

      {/* Readout Ribbon (4 Cells) */}
      <div className="field-readout grid grid-cols-2 sm:grid-cols-4">
        <div className="field-readout-cell">
          <div className="field-readout-label">Point x</div>
          <div className="field-readout-value">{readout.x}</div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">f(x)</div>
          <div className="field-readout-value">{readout.fx}</div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">slope f′(x)</div>
          <div className="field-readout-value text-[var(--orange,#FF7A33)]">{readout.slope}</div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">tangent line</div>
          <div className="field-readout-value text-xs sm:text-sm font-mono truncate">{readout.eq}</div>
        </div>
      </div>
    </div>
  );
}
