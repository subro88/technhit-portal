"use client";

import dynamic from "next/dynamic";
import CanvasLoader from "@/components/3d/CanvasLoader";

const ServerRackHero = dynamic(() => import("@/components/3d/ServerRackHero"), {
  ssr: false,
  loading: () => <CanvasLoader label="Mounting 3D Cluster Rack Engine..." />,
});

export default function ServerRackWrapper() {
  return <ServerRackHero />;
}
