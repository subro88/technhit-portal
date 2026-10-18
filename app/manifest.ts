import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechNHIT // Industrial Systems & AI Cluster Publication",
    short_name: "TechNHIT",
    description:
      "Developer publication and visual engineering lab for Enterprise Linux, Proxmox/Ceph Clusters, Local AI Compute, and 10+2 STEM Mathematics.",
    start_url: "/",
    display: "standalone",
    background_color: "#07090e",
    theme_color: "#07090e",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
