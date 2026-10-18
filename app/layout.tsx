import type { Metadata, Viewport } from "next";

import Link from "next/link";
import { Server, Terminal, Cpu, BookOpen, Compass, Youtube, Shield } from "lucide-react";
import { TuxGearLogo } from "@/components/brand/TuxGearLogo";
import { ThemeProvider } from "@/components/theme/ThemeContext";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://technhit.in"),
  title: {
    default: "TechNHIT // Industrial Systems & AI Cluster Publication",
    template: "%s | TechNHIT",
  },
  description:
    "Developer publication and technical visual lab for Enterprise Linux, Proxmox/Ceph Clusters, Local AI Compute, and 10+2 STEM Mathematics. Paired with YouTube channel @TechBlogTutorial.",
  keywords: [
    "Linux Server Administration",
    "Proxmox VE 8",
    "Ceph Storage",
    "Local AI Inference",
    "Ollama",
    "vLLM",
    "10+2 STEM Mathematics",
    "Calculus",
    "TechBlogTutorial",
  ],
  authors: [{ name: "TechNHIT Engineering" }],
  creator: "TechNHIT",
  publisher: "TechNHIT",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://technhit.in",
    siteName: "TechNHIT Engineering",
    title: "TechNHIT // Industrial Systems & AI Cluster Publication",
    description: "Enterprise Linux, Virtualization Clusters, Local AI Compute, and 10+2 STEM Visualizations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNHIT // Engineering Portal",
    description: "Enterprise Linux, Virtualization Clusters, Local AI Compute, and 10+2 STEM Visualizations.",
    creator: "@TechBlogTutorial",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Oswald:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg,#07090e)] text-[var(--fg,#f5f5f5)] min-h-screen flex flex-col font-body selection:bg-amber-500/30 selection:text-amber-400 transition-colors">
        <ThemeProvider>
        {/* Grain overlay */}
        <div className="grain" />

        {/* Top Industrial Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/85 border-b border-white/10 shadow-xl">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <TuxGearLogo size={46} showText={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 font-heading text-xs tracking-[0.18em] uppercase">
              <Link
                href="/linux-server-admin"
                className="text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>Linux Admin</span>
              </Link>
              <Link
                href="/clustering-virtualization"
                className="text-zinc-300 hover:text-cyber-emerald transition-colors flex items-center gap-2"
              >
                <Server className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>Clustering</span>
              </Link>
              <Link
                href="/local-ai-inference"
                className="text-zinc-300 hover:text-cyber-purple transition-colors flex items-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5 text-cyber-purple" />
                <span>Local AI</span>
              </Link>
              <Link
                href="/stem-10-plus-2"
                className="text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>10+2 STEM</span>
              </Link>
              <Link
                href="/visual-lab"
                className="text-zinc-300 hover:text-cyber-cyan transition-colors flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Visual Lab</span>
              </Link>
              <Link
                href="/video-companions"
                className="text-zinc-300 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube</span>
              </Link>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center gap-4">
              <ThemeSwitcher />

              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="tracking-wider">CLUSTER: ONLINE</span>
              </div>

              <Link
                href="/admin"
                className="font-heading text-xs tracking-[0.2em] uppercase text-black bg-amber-400 hover:bg-amber-300 px-4 py-2.5 transition-colors shadow-sm flex items-center gap-2 font-bold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>STUDIO</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Global Industrial Footer */}
        <footer className="border-t border-zinc-900 bg-black py-16 relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
            {/* Watermark in background */}
            <div className="font-display text-[16vw] md:text-[13vw] leading-none text-stroke opacity-15 absolute bottom-0 left-0 right-0 text-center pointer-events-none select-none">
              TECHNHIT
            </div>

            <div className="relative grid md:grid-cols-12 gap-10 mb-12">
              <div className="md:col-span-5">
                <div className="mb-5">
                  <TuxGearLogo size={42} showText={true} />
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md mb-6 font-body">
                  High-performance systems engineering publication and laboratory. Production Rocky Linux, Proxmox VE clustering, Ceph SDS, local LLM quantization, and 10+2 multivariable mathematics.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://youtube.com/@TechBlogTutorial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-zinc-800 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center text-zinc-300"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/technhit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-zinc-800 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center text-zinc-300"
                  >
                    <Terminal className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase mb-4">Core Tracks</h5>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><Link href="/linux-server-admin" className="hover:text-zinc-100 transition-colors">Linux Admin</Link></li>
                  <li><Link href="/clustering-virtualization" className="hover:text-zinc-100 transition-colors">Clustering</Link></li>
                  <li><Link href="/local-ai-inference" className="hover:text-zinc-100 transition-colors">Local AI</Link></li>
                  <li><Link href="/stem-10-plus-2" className="hover:text-zinc-100 transition-colors">10+2 STEM</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase mb-4">Visual Lab</h5>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li><Link href="/visual-lab/wave-matrix" className="hover:text-zinc-100 transition-colors">Wave Matrix</Link></li>
                  <li><Link href="/visual-lab/packet-routing" className="hover:text-zinc-100 transition-colors">Packet Routing</Link></li>
                  <li><Link href="/visual-lab/vector-field" className="hover:text-zinc-100 transition-colors">Vector Field</Link></li>
                  <li><Link href="/video-companions" className="hover:text-zinc-100 transition-colors">Video Guides</Link></li>
                </ul>
              </div>

              <div className="md:col-span-3">
                <h5 className="font-mono text-[10px] text-amber-400 tracking-[0.2em] uppercase mb-4">Engineering Dispatch</h5>
                <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                  Weekly kernel patches, cluster configs, vLLM recipes, and code companions delivered directly to your terminal.
                </p>
                <div className="flex border border-zinc-800 focus-within:border-amber-500 transition-colors">
                  <input
                    type="email"
                    placeholder="engineer@domain.com"
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 font-mono text-xs"
                  />
                  <button className="px-4 bg-amber-500 text-black hover:bg-amber-400 transition-colors font-bold text-xs uppercase font-heading tracking-wider">
                    Join
                  </button>
                </div>
              </div>
            </div>

            <div className="relative border-t border-zinc-900 pt-6 flex flex-col md:flex-row justify-between gap-4 text-zinc-500 font-mono text-[11px] tracking-[0.15em] uppercase">
              <div>© 2026 TECHNHIT ENGINEERING • REPO: GITHUB.COM/TECHNHIT</div>
              <div className="flex gap-6">
                <span>COMPANION: @TECHBLOGTUTORIAL</span>
                <span>CLUSTER: ACTIVE</span>
              </div>
            </div>
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
