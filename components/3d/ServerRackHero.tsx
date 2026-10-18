"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Server, Cpu, Database, Activity, Terminal, ShieldCheck, Zap, BookOpen } from "lucide-react";
import Link from "next/link";

interface BladeData {
  id: string;
  name: string;
  track: string;
  href: string;
  color: string;
  hex: string;
  specs: string;
  status: string;
  load: string;
}

const RACK_BLADES: BladeData[] = [
  {
    id: "blade-1",
    name: "NODE-01: Linux & Kernel Stack",
    track: "linux-server-admin",
    href: "/linux-server-admin",
    color: "cyan",
    hex: "#00f5d4",
    specs: "Debian 12 / Ubuntu 24.04 • ZFS RAIDZ2 • nftables",
    status: "HEALTHY",
    load: "18% CPU • 4.2 GB RAM",
  },
  {
    id: "blade-2",
    name: "NODE-02: Hypervisor & Ceph Mesh",
    track: "clustering-virtualization",
    href: "/clustering-virtualization",
    color: "emerald",
    hex: "#10b981",
    specs: "Proxmox VE 8.2 • 3-Node Quorum • Ceph NVMe Pool",
    status: "QUORUM OK",
    load: "34% CPU • 32 GB RAM",
  },
  {
    id: "blade-3",
    name: "NODE-03: Local AI & GPU Cluster",
    track: "local-ai-inference",
    href: "/local-ai-inference",
    color: "purple",
    hex: "#bd00ff",
    specs: "Dual RTX 3090 • CUDA 12.4 • Ollama / vLLM 24k ctx",
    status: "ACTIVE INFERENCE",
    load: "86% GPU • 48 GB VRAM",
  },
  {
    id: "blade-4",
    name: "NODE-04: STEM 10+2 Simulation Unit",
    track: "stem-10-plus-2",
    href: "/stem-10-plus-2",
    color: "amber",
    hex: "#f59e0b",
    specs: "Symbolic Calculus Engine • Vector Field Matrix • Physics Sim",
    status: "READY",
    load: "12% CPU • 60 FPS Engine",
  },
];

// Inner 3D Blade Mesh Component
function ServerBladeMesh({
  position,
  blade,
  isSelected,
  onSelect,
}: {
  position: [number, number, number];
  blade: BladeData;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slight smooth hover pop on Z axis
    const targetZ = isSelected ? 0.35 : hovered ? 0.18 : 0;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.12);
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Blade Main Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.45, 2.2]} />
        <meshStandardMaterial
          color={isSelected ? "#141d2e" : hovered ? "#101622" : "#0b0f17"}
          roughness={0.35}
          metalness={0.85}
        />
      </mesh>

      {/* Front Faceplate */}
      <mesh position={[0, 0, 1.11]}>
        <boxGeometry args={[3.16, 0.42, 0.02]} />
        <meshStandardMaterial
          color={isSelected ? "#1c283d" : "#0d131f"}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Drive Bays Slots */}
      {[-1.1, -0.6, -0.1, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0, 1.125]}>
          <boxGeometry args={[0.38, 0.3, 0.01]} />
          <meshStandardMaterial color="#05070a" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Dynamic Status LED */}
      <mesh position={[1.2, 0.08, 1.125]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={blade.hex} />
      </mesh>

      {/* Network Activity LED (Blinking) */}
      <mesh position={[1.35, 0.08, 1.125]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color={hovered || isSelected ? "#00f5d4" : "#10b981"} />
      </mesh>
    </group>
  );
}

// 3D Scene Container
function ServerRackScene({
  activeBladeId,
  onSelectBlade,
}: {
  activeBladeId: string;
  onSelectBlade: (id: string) => void;
}) {
  const { mouse } = useThree();
  const rackGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!rackGroupRef.current) return;
    // Mouse orbital parallax
    const targetRotY = mouse.x * 0.35;
    const targetRotX = -mouse.y * 0.2;
    rackGroupRef.current.rotation.y = THREE.MathUtils.lerp(rackGroupRef.current.rotation.y, targetRotY, 0.06);
    rackGroupRef.current.rotation.x = THREE.MathUtils.lerp(rackGroupRef.current.rotation.x, targetRotX, 0.06);
  });

  return (
    <group ref={rackGroupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Rack Outer Chassis Rails */}
        <mesh position={[-1.75, 0, 0]}>
          <boxGeometry args={[0.1, 3.2, 2.4]} />
          <meshStandardMaterial color="#07090e" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[1.75, 0, 0]}>
          <boxGeometry args={[0.1, 3.2, 2.4]} />
          <meshStandardMaterial color="#07090e" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[3.6, 0.08, 2.4]} />
          <meshStandardMaterial color="#0a0d14" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.6, 0]}>
          <boxGeometry args={[3.6, 0.08, 2.4]} />
          <meshStandardMaterial color="#0a0d14" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* 4 Rack Mounted Blades */}
        {RACK_BLADES.map((blade, idx) => {
          const yPos = 0.95 - idx * 0.65;
          return (
            <ServerBladeMesh
              key={blade.id}
              blade={blade}
              position={[0, yPos, 0]}
              isSelected={activeBladeId === blade.id}
              onSelect={() => onSelectBlade(blade.id)}
            />
          );
        })}
      </Float>
    </group>
  );
}

// 2D Cyber Fallback Component when WebGL is unavailable or context lost
function ServerRackWireframeFallback({
  activeBlade,
  onSelectBlade,
}: {
  activeBlade: BladeData;
  onSelectBlade: (id: string) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-cyber-900 border border-cyber-border rounded-xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-cyber-cyan" />
          <span className="font-mono text-sm font-semibold text-zinc-100">RACK_CLUSTER_U42 TELEMETRY</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyber-800 text-cyber-emerald border border-cyber-emerald/30">
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {RACK_BLADES.map((blade) => {
          const isSelected = activeBlade.id === blade.id;
          return (
            <button
              key={blade.id}
              onClick={() => onSelectBlade(blade.id)}
              className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? "bg-cyber-800/90 border-cyber-cyan shadow-[0_0_15px_rgba(0,245,212,0.15)]"
                  : "bg-cyber-850/60 border-cyber-border hover:border-zinc-600 hover:bg-cyber-800/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-zinc-200">{blade.name}</span>
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: blade.hex }}
                />
              </div>
              <p className="text-[11px] text-zinc-400 font-mono truncate">{blade.specs}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-cyber-border/40 text-[10px] font-mono text-zinc-400">
                <span>{blade.status}</span>
                <span className="text-zinc-300">{blade.load}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-cyber-border text-xs font-mono text-zinc-400">
        <span>INTERCONNECT: 10GbE SFP+ MESH</span>
        <span className="text-cyber-cyan">ORBITAL SIMULATION READY</span>
      </div>
    </div>
  );
}

// Main Export Component
export default function ServerRackHero() {
  const [activeBladeId, setActiveBladeId] = useState("blade-1");
  const [webglError, setWebglError] = useState(false);

  const activeBlade = useMemo(
    () => RACK_BLADES.find((b) => b.id === activeBladeId) || RACK_BLADES[0],
    [activeBladeId]
  );

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[560px] bg-cyber-950 border border-cyber-border rounded-xl overflow-hidden shadow-2xl group">
      {/* Background terminal grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1623_1px,transparent_1px),linear-gradient(to_bottom,#0f1623_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Telemetry Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-900/90 backdrop-blur-md border border-cyber-border pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
          <span className="text-xs font-mono font-medium text-zinc-200">RACK_42 // COMPUTE CLUSTER</span>
          <span className="text-[10px] font-mono text-zinc-500">| 4 NODES LIVE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-900/90 backdrop-blur-md border border-cyber-border text-[11px] font-mono text-zinc-400 pointer-events-auto">
          <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
          <span>DRAG TO ORBIT • CLICK BLADE TO INSPECT</span>
        </div>
      </div>

      {/* 3D WebGL Canvas or Resilient Fallback */}
      <div className="w-full h-full">
        {webglError ? (
          <ServerRackWireframeFallback
            activeBlade={activeBlade}
            onSelectBlade={setActiveBladeId}
          />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (event) => {
                event.preventDefault();
                setWebglError(true);
              });
            }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <pointLight position={[-4, -2, -2]} color="#00f5d4" intensity={1.5} />
            <pointLight position={[4, 2, 2]} color="#bd00ff" intensity={1.8} />

            <Suspense fallback={null}>
              <ServerRackScene
                activeBladeId={activeBladeId}
                onSelectBlade={setActiveBladeId}
              />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Active Blade Telemetry Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-cyber-900/90 backdrop-blur-md border border-cyber-border pointer-events-auto shadow-xl">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${activeBlade.hex}15`,
              borderColor: `${activeBlade.hex}40`,
              color: activeBlade.hex,
            }}
          >
            {activeBlade.track === "linux-server-admin" && <Terminal className="w-5 h-5" />}
            {activeBlade.track === "clustering-virtualization" && <Server className="w-5 h-5" />}
            {activeBlade.track === "local-ai-inference" && <Cpu className="w-5 h-5" />}
            {activeBlade.track === "stem-10-plus-2" && <BookOpen className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-mono text-sm font-semibold text-zinc-100">{activeBlade.name}</h4>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: `${activeBlade.hex}15`,
                  borderColor: `${activeBlade.hex}40`,
                  color: activeBlade.hex,
                }}
              >
                {activeBlade.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{activeBlade.specs}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <span className="text-[11px] font-mono text-zinc-400 hidden lg:inline-block">
            TELEMETRY: {activeBlade.load}
          </span>
          <Link
            href={activeBlade.href}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border shadow-lg"
            style={{
              backgroundColor: activeBlade.hex,
              color: "#05070a",
              borderColor: activeBlade.hex,
            }}
          >
            <span>ENTER TRACK</span>
            <Zap className="w-3.5 h-3.5 fill-current" />
          </Link>
        </div>
      </div>
    </div>
  );
}
