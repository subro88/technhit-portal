"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useTheme } from "@/components/theme/ThemeContext";

type FnKey = "sin" | "x2" | "x3" | "exp" | "log";

interface FnDef {
  name: string;
  f: (x: number) => number;
  fp: (x: number) => number;
  view: { xMin: number; xMax: number; yMin: number; yMax: number };
}

const FN_LIBRARY: Record<FnKey, FnDef> = {
  sin: {
    name: "sin(x)",
    f: (x) => Math.sin(x),
    fp: (x) => Math.cos(x),
    view: { xMin: -Math.PI * 1.2, xMax: Math.PI * 1.2, yMin: -2, yMax: 2 },
  },
  x2: {
    name: "x²",
    f: (x) => x * x,
    fp: (x) => 2 * x,
    view: { xMin: -3, xMax: 3, yMin: -2, yMax: 6 },
  },
  x3: {
    name: "x³",
    f: (x) => x * x * x,
    fp: (x) => 3 * x * x,
    view: { xMin: -2.2, xMax: 2.2, yMin: -5, yMax: 5 },
  },
  exp: {
    name: "eˣ",
    f: (x) => Math.exp(x),
    fp: (x) => Math.exp(x),
    view: { xMin: -2, xMax: 2, yMin: -1, yMax: 9 },
  },
  log: {
    name: "ln(x)",
    f: (x) => (x > 0.01 ? Math.log(x) : -5),
    fp: (x) => (x > 0.01 ? 1 / x : 100),
    view: { xMin: 0.05, xMax: 6, yMin: -3, yMax: 2.5 },
  },
};

export default function DerivativePlotter() {
  const { isFieldGuide } = useTheme();
  const [fnKey, setFnKey] = useState<FnKey>("sin");
  const [xVal, setXVal] = useState<number>(0.6);

  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const botCanvasRef = useRef<HTMLCanvasElement>(null);

  const isDragging = useRef<boolean>(false);
  const zoom = useRef<number>(1);
  const panX = useRef<number>(0);
  const panY = useRef<number>(0);

  const fn = FN_LIBRARY[fnKey];

  const getViewTop = useCallback(() => {
    const v = fn.view;
    const cx = (v.xMin + v.xMax) / 2 + panX.current;
    const cy = (v.yMin + v.yMax) / 2 + panY.current;
    const hw = ((v.xMax - v.xMin) / 2) / zoom.current;
    const hh = ((v.yMax - v.yMin) / 2) / zoom.current;
    return { xMin: cx - hw, xMax: cx + hw, yMin: cy - hh, yMax: cy + hh };
  }, [fn]);

  const getViewBot = useCallback(() => {
    const v = fn.view;
    const cx = (v.xMin + v.xMax) / 2 + panX.current;
    const hw = ((v.xMax - v.xMin) / 2) / zoom.current;
    const yRange = (v.yMax - v.yMin) / 2;
    return {
      xMin: cx - hw,
      xMax: cx + hw,
      yMin: -yRange * 0.8 + panY.current,
      yMax: yRange * 0.8 + panY.current,
    };
  }, [fn]);

  const mathToPx = (
    mx: number,
    my: number,
    view: { xMin: number; xMax: number; yMin: number; yMax: number },
    w: number,
    h: number
  ) => [
    ((mx - view.xMin) / (view.xMax - view.xMin)) * w,
    h - ((my - view.yMin) / (view.yMax - view.yMin)) * h,
  ];

  const pxToMath = (
    px: number,
    py: number,
    view: { xMin: number; xMax: number; yMin: number; yMax: number },
    w: number,
    h: number
  ) => [
    (px / w) * (view.xMax - view.xMin) + view.xMin,
    ((h - py) / h) * (view.yMax - view.yMin) + view.yMin,
  ];

  const draw = useCallback(() => {
    const topCanvas = topCanvasRef.current;
    const botCanvas = botCanvasRef.current;
    if (!topCanvas || !botCanvas) return;

    const setup = (c: HTMLCanvasElement) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const rect = c.getBoundingClientRect();
      c.width = Math.max(2, Math.floor(rect.width * dpr));
      c.height = Math.max(2, Math.floor(rect.height * dpr));
      const ctx = c.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w: rect.width, h: rect.height };
    };

    const top = setup(topCanvas);
    const bot = setup(botCanvas);
    if (!top.ctx || !bot.ctx) return;

    const viewTop = getViewTop();
    const viewBot = getViewBot();

    // Theme-calibrated canvas color palette
    const primaryCurveColor = isFieldGuide ? "#0B2545" : "#00F5D4";
    const tangentColor = isFieldGuide ? "#D75C2A" : "#FF7A33";
    const gridColor = isFieldGuide ? "rgba(11, 37, 69, 0.08)" : "rgba(255, 255, 255, 0.05)";
    const axisColor = isFieldGuide ? "rgba(11, 37, 69, 0.45)" : "rgba(0, 245, 212, 0.45)";
    const guideLineColor = isFieldGuide ? "rgba(11, 37, 69, 0.25)" : "rgba(255, 255, 255, 0.25)";
    const pointStroke = isFieldGuide ? "#FCF9EF" : "#0d1117";
    const pointFill = isFieldGuide ? "#D75C2A" : "#FF7A33";
    const botPointFill = isFieldGuide ? "#0B2545" : "#00F5D4";

    const drawGrid = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      v: typeof viewTop
    ) => {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = gridColor;
      ctx.beginPath();
      const minor = 0.2;
      const xStartM = Math.ceil(v.xMin / minor) * minor;
      for (let gx = xStartM; gx <= v.xMax; gx += minor) {
        const px = ((gx - v.xMin) / (v.xMax - v.xMin)) * w;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }
      const yStartM = Math.ceil(v.yMin / minor) * minor;
      for (let gy = yStartM; gy <= v.yMax; gy += minor) {
        const py = h - ((gy - v.yMin) / (v.yMax - v.yMin)) * h;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }
      ctx.stroke();

      // Axes
      const x0 = ((0 - v.xMin) / (v.xMax - v.xMin)) * w;
      const y0 = h - ((0 - v.yMin) / (v.yMax - v.yMin)) * h;
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
    };

    const plot = (
      ctx: CanvasRenderingContext2D,
      f: (v: number) => number,
      v: typeof viewTop,
      w: number,
      h: number,
      color: string,
      lw = 2.4
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.beginPath();
      const samples = 400;
      const dx = (v.xMax - v.xMin) / samples;
      let started = false;
      for (let i = 0; i <= samples; i++) {
        const curX = v.xMin + i * dx;
        let curY = f(curX);
        if (!isFinite(curY) || Math.abs(curY) > 1e4) {
          started = false;
          continue;
        }
        const [px, py] = mathToPx(curX, curY, v, w, h);
        if (py < -500 || py > h + 500) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    };

    // 1. TOP PLOT
    top.ctx.clearRect(0, 0, top.w, top.h);
    drawGrid(top.ctx, top.w, top.h, viewTop);
    plot(top.ctx, fn.f, viewTop, top.w, top.h, primaryCurveColor, 2.5);

    // Tangent
    const y = fn.f(xVal);
    const m = fn.fp(xVal);
    const x1 = viewTop.xMin;
    const x2 = viewTop.xMax;
    const y1 = y + m * (x1 - xVal);
    const y2 = y + m * (x2 - xVal);
    const [tx1, ty1] = mathToPx(x1, y1, viewTop, top.w, top.h);
    const [tx2, ty2] = mathToPx(x2, y2, viewTop, top.w, top.h);

    top.ctx.strokeStyle = tangentColor;
    top.ctx.lineWidth = 2;
    top.ctx.beginPath();
    top.ctx.moveTo(tx1, ty1);
    top.ctx.lineTo(tx2, ty2);
    top.ctx.stroke();

    // Draggable point
    const [px, py] = mathToPx(xVal, y, viewTop, top.w, top.h);
    top.ctx.fillStyle = pointFill;
    top.ctx.strokeStyle = pointStroke;
    top.ctx.lineWidth = 2.5;
    top.ctx.beginPath();
    top.ctx.arc(px, py, 7.5, 0, Math.PI * 2);
    top.ctx.fill();
    top.ctx.stroke();

    // 2. BOTTOM PLOT
    bot.ctx.clearRect(0, 0, bot.w, bot.h);
    drawGrid(bot.ctx, bot.w, bot.h, viewBot);
    plot(bot.ctx, fn.fp, viewBot, bot.w, bot.h, tangentColor, 2.2);

    // Bottom guide lines and point
    const [bpx, bpy] = mathToPx(xVal, m, viewBot, bot.w, bot.h);
    bot.ctx.strokeStyle = guideLineColor;
    bot.ctx.lineWidth = 1;
    bot.ctx.setLineDash([3, 4]);
    bot.ctx.beginPath();
    bot.ctx.moveTo(bpx, 0);
    bot.ctx.lineTo(bpx, bot.h);
    bot.ctx.moveTo(0, bpy);
    bot.ctx.lineTo(bot.w, bpy);
    bot.ctx.stroke();
    bot.ctx.setLineDash([]);

    bot.ctx.fillStyle = botPointFill;
    bot.ctx.strokeStyle = pointStroke;
    bot.ctx.lineWidth = 2.5;
    bot.ctx.beginPath();
    bot.ctx.arc(bpx, bpy, 6, 0, Math.PI * 2);
    bot.ctx.fill();
    bot.ctx.stroke();
  }, [fn, getViewTop, getViewBot, mathToPx, xVal, isFieldGuide]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  // Mouse interaction on top canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = topCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const [mathX] = pxToMath(mx, my, getViewTop(), rect.width, rect.height);
    setXVal(mathX);
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const canvas = topCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const view = getViewTop();
    const [mathX] = pxToMath(mx, my, view, rect.width, rect.height);
    const clamped = Math.max(view.xMin + 0.05, Math.min(view.xMax - 0.05, mathX));
    setXVal(clamped);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const yVal = fn.f(xVal);
  const dfxVal = fn.fp(xVal);

  return (
    <div className="my-8 max-w-4xl mx-auto space-y-4">
      {/* Function Selector Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex border border-[var(--ink,#1f2937)] bg-[var(--paper-white,#0d1117)] overflow-hidden rounded">
          {(Object.keys(FN_LIBRARY) as FnKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setFnKey(key);
                zoom.current = 1;
                panX.current = 0;
                panY.current = 0;
                const v = FN_LIBRARY[key].view;
                setXVal(Math.max(v.xMin + 0.3, Math.min(v.xMax - 0.3, 0.8)));
              }}
              className={`px-3 py-1.5 font-mono text-xs border-r border-[var(--ink-faint,#1f2937)] last:border-r-0 transition-colors cursor-pointer ${
                fnKey === key
                  ? "bg-[var(--ink,#1f2937)] text-[var(--paper,#f4f4f5)] font-bold"
                  : "text-[var(--ink,#a1a1aa)] hover:bg-[var(--paper-warm,#161b22)]"
              }`}
            >
              {FN_LIBRARY[key].name}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-[var(--ink-soft,#a1a1aa)]">
          Drag point along the curve to pivot tangent
        </span>
      </div>

      {/* Dual Stacked Canvas Frame */}
      <div className="space-y-3">
        <div className="canvas-frame h-[260px] relative">
          <div className="canvas-corner tl" />
          <div className="canvas-corner tr" />
          <div className="canvas-corner bl" />
          <div className="canvas-corner br" />
          <canvas
            ref={topCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="w-full h-full cursor-ew-resize"
          />
          <div className="absolute top-2.5 left-3 bg-[var(--paper-white,rgba(0,0,0,0.75))] px-2.5 py-0.5 border border-[var(--ink-faint,rgba(255,255,255,0.15))] text-[11px] font-grotesk font-semibold text-[var(--ink,#e4e4e7)]">
            <span className="inline-block w-2 h-2 mr-1.5 bg-[var(--canvas-primary,#00F5D4)]" />
            f(x)
          </div>
        </div>

        <div className="canvas-frame h-[180px] relative">
          <div className="canvas-corner tl" />
          <div className="canvas-corner tr" />
          <div className="canvas-corner bl" />
          <div className="canvas-corner br" />
          <canvas ref={botCanvasRef} className="w-full h-full" />
          <div className="absolute top-2.5 left-3 bg-[var(--paper-white,rgba(0,0,0,0.75))] px-2.5 py-0.5 border border-[var(--ink-faint,rgba(255,255,255,0.15))] text-[11px] font-grotesk font-semibold text-[var(--orange,#FF7A33)]">
            <span className="inline-block w-2 h-2 mr-1.5 bg-[var(--orange,#FF7A33)]" />
            f′(x) — derivative
          </div>
        </div>
      </div>

      {/* Numerical Readout */}
      <div className="field-readout grid grid-cols-3">
        <div className="field-readout-cell">
          <div className="field-readout-label">Point x</div>
          <div className="field-readout-value font-mono">
            {xVal >= 0 ? "+" : ""}{xVal.toFixed(2)}
          </div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">f(x)</div>
          <div className="field-readout-value font-mono">
            {yVal >= 0 ? "+" : ""}{yVal.toFixed(2)}
          </div>
        </div>
        <div className="field-readout-cell">
          <div className="field-readout-label">slope f′(x)</div>
          <div className="field-readout-value font-mono text-[var(--orange,#FF7A33)]">
            {dfxVal >= 0 ? "+" : ""}{dfxVal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
