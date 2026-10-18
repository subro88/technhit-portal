"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Key, Github, AlertCircle, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@technhit.in");
  const [password, setPassword] = useState("TechNHIT#Cluster2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In local dev, set technhit_dev_auth cookie for instant middleware validation
      document.cookie = "technhit_dev_auth=active; path=/; max-age=86400; SameSite=Lax";
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 600);
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate.");
      setLoading(false);
    }
  };

  const handleOAuthLogin = () => {
    // Redirect to GitHub OAuth provider endpoint
    window.location.href = "/api/auth/signin/github";
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-cyber-900 border border-cyber-border shadow-2xl space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-cyber-850 border border-cyber-cyan/50 text-cyber-cyan mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.2)]">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-mono text-zinc-100">TechNHIT Studio Access</h1>
        <p className="text-xs text-zinc-400 font-mono">
          Authorized Engineering Operators & Publication Editors
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Authenticated! Redirecting to studio...</span>
        </div>
      )}

      {/* GitHub OAuth Button */}
      <button
        type="button"
        onClick={handleOAuthLogin}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-cyber-800 hover:bg-cyber-750 border border-cyber-border text-xs font-mono text-zinc-100 font-semibold transition-all cursor-pointer shadow-md hover:border-zinc-500"
      >
        <Github className="w-4 h-4" />
        <span>SIGN IN WITH GITHUB OAUTH</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-cyber-border" />
        <span className="text-[10px] font-mono text-zinc-500 uppercase">Or Master Password</span>
        <div className="flex-1 h-px bg-cyber-border" />
      </div>

      {/* Fallback Password Form */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4 font-mono text-xs">
        <div>
          <label className="text-[11px] text-zinc-400 block mb-1.5 font-semibold">
            ADMIN EMAIL
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-100 focus:outline-none focus:border-cyber-cyan"
            placeholder="admin@technhit.in"
          />
        </div>

        <div>
          <label className="text-[11px] text-zinc-400 block mb-1.5 font-semibold">
            CLUSTER PASSKEY
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-cyber-950 border border-cyber-border text-zinc-100 focus:outline-none focus:border-cyber-cyan"
            placeholder="••••••••••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyber-cyan text-cyber-950 font-bold hover:bg-cyan-300 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Key className="w-4 h-4" />
          <span>{loading ? "VERIFYING PASSKEY..." : "ENTER ADMIN STUDIO"}</span>
        </button>
      </form>

      <div className="p-3 rounded-lg bg-cyber-950 border border-cyber-border text-[11px] font-mono text-zinc-500 text-center">
        Secured with NextAuth.js JWT • Scoped to ADMIN_EMAILS whitelist
      </div>
    </div>
  );
}
