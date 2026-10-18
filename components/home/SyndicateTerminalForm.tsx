"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Terminal, Shield, Cpu, Clock, Mail } from "lucide-react";

export function SyndicateTerminalForm() {
  const [goal, setGoal] = useState("Proxmox Clustering");
  const [tier, setTier] = useState("Mid-Tower (Dual GPU)");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
    setName("");
    setEmail("");
  };

  return (
    <section className="relative py-28 lg:py-36 border-b border-zinc-800 bg-[#050609]" id="syndicate">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="mb-14">
          <div className="section-marker mb-3">
            <span>05 — JOIN THE SYNDICATE</span>
          </div>
          <h2 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] text-zinc-100">
            STOP WAITING.<br />
            <span className="text-stroke">START</span>{" "}
            <span className="text-[#FF5400]">DEPLOYING.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form Panel */}
          <div className="lg:col-span-7 bg-[#0d1117] border border-zinc-800 p-8 sm:p-12 notch-corner">
            <div className="font-mono text-[11px] text-amber-400 tracking-[0.2em] uppercase mb-2">
              // TERMINAL DISPATCH & LAB ACCESS INGEST
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-zinc-100 mb-2">
              JOIN 14,200+ SYSTEMS ENGINEERS
            </h3>
            <p className="text-zinc-400 text-sm mb-8 font-body">
              Receive weekly kernel tuning patches, verified Ceph automation playbooks, local vLLM model weights recipes, and 10+2 STEM mathematical simulations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-mono text-[10px] text-zinc-400 tracking-[0.2em] uppercase block mb-1">
                    OPERATOR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Linus Torvalds"
                    className="w-full bg-black/60 border-b border-zinc-700 focus:border-amber-500 py-3 text-zinc-100 font-mono text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-zinc-400 tracking-[0.2em] uppercase block mb-1">
                    DISPATCH EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@domain.com"
                    className="w-full bg-black/60 border-b border-zinc-700 focus:border-amber-500 py-3 text-zinc-100 font-mono text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Goal Pills */}
              <div>
                <label className="font-mono text-[10px] text-zinc-400 tracking-[0.2em] uppercase block mb-3">
                  PRIMARY FOCUS AREA
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Proxmox Clustering",
                    "Local LLM Compute",
                    "10+2 STEM Math",
                    "Bare-Metal Linux",
                    "Ceph SDS",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGoal(item)}
                      className={`goal-pill ${goal === item ? "active" : ""}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Tier Selector */}
              <div>
                <label className="font-mono text-[10px] text-zinc-400 tracking-[0.2em] uppercase block mb-3">
                  HOMELAB ARCHITECTURE TIER
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: "MICRO-LAB", spec: "NUC / Pi 5 / Mini PC" },
                    { title: "MID-TOWER", spec: "Dual GPU / Workstation" },
                    { title: "ENTERPRISE", spec: "3-Node Ceph Rack" },
                  ].map((t) => (
                    <div
                      key={t.title}
                      onClick={() => setTier(t.title)}
                      className={`p-3.5 border cursor-pointer transition-all text-center ${
                        tier === t.title
                          ? "bg-amber-500/10 border-amber-500 text-amber-400"
                          : "border-zinc-800 hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      <div className="font-heading text-xs font-bold tracking-wider uppercase">
                        {t.title}
                      </div>
                      <div className="font-mono text-[9px] text-zinc-500 mt-1">
                        {t.spec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="pulse-btn w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black py-4 font-display text-2xl tracking-wider transition-all flex items-center justify-center gap-3 font-bold shadow-xl"
              >
                <span>REQUEST LAB DISPATCH</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-widest pt-2">
                <span>ZERO SLOP // PRIVACY GUARANTEED</span>
                <span>DISPATCH: ONCE WEEKLY</span>
              </div>
            </form>
          </div>

          {/* Right Info Matrix */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0d1117] border border-zinc-800 p-7 notch-corner">
              <div className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase mb-2">
                // HOMELAB SYNDICATE HUB
              </div>
              <h4 className="font-display text-2xl text-zinc-100 mb-2">
                LAB NODE LOCATION
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 font-body">
                Open Systems Homelab Cluster & Telemetry Network.<br />
                Dedicated Fiber Uplink // Ceph SDS Fabric.
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>ssh syndicate@technhit.in -p 2202</span>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-zinc-800 p-7 notch-corner">
              <div className="font-mono text-[10px] text-cyber-cyan tracking-[0.2em] uppercase mb-2">
                // COMPANION MEDIA
              </div>
              <h4 className="font-display text-2xl text-zinc-100 mb-2">
                YOUTUBE BROADCAST
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 font-body">
                Weekly deep-dive homelab builds, live migration simulations, and GPU benchmarks on channel:
              </p>
              <div className="flex items-center gap-2 font-mono text-xs text-red-400 font-bold">
                <span>@TechBlogTutorial // YOUTUBE</span>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-zinc-800 p-7 notch-corner">
              <div className="font-mono text-[10px] text-emerald-400 tracking-[0.2em] uppercase mb-2">
                // AUDIT STATUS
              </div>
              <h4 className="font-display text-2xl text-zinc-100 mb-2">
                CLUSTER TELEMETRY
              </h4>
              <div className="space-y-2 font-mono text-xs text-zinc-400">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span>PROXMOX CLUSTER</span>
                  <span className="text-emerald-400">QUORUM 3/3</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span>CEPH HEALTH</span>
                  <span className="text-emerald-400">HEALTH_OK</span>
                </div>
                <div className="flex justify-between">
                  <span>vLLM INFERENCE</span>
                  <span className="text-cyber-cyan">ONLINE (AWQ)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Toast */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#0d1117] border-l-4 border-amber-500 border border-zinc-800 p-4 shadow-2xl flex items-start gap-3 max-w-md animate-in slide-in-from-right">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-black flex-shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="font-heading text-sm uppercase tracking-wider text-zinc-100 font-bold">
              Dispatch Request Registered
            </div>
            <div className="text-zinc-400 text-xs mt-0.5 font-mono">
              Welcome to the Syndicate. Check your inbox for the initial cluster configuration bundle.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default SyndicateTerminalForm;
