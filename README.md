# TechNHIT // Industrial Systems & AI Cluster Publication

[![TechNHIT CI](https://github.com/subro88/technhit-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/subro88/technhit-portal/actions/workflows/ci.yml)
[![Production Domain](https://img.shields.io/badge/Production-technhit.in-00F5D4?style=flat-square&logo=nginx&logoColor=black)](https://technhit.in)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-white?style=flat-square&logo=next.js&logoColor=black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22_LTS-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage_Standalone-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

TechNHIT is a developer publication and visual laboratory dedicated to **Enterprise Linux**, **Proxmox VE & Ceph Clustering**, **Local AI Compute (Ollama/vLLM)**, and **10+2 Multivariable Mathematics & Technical Drafting**.

Paired with YouTube channel [@TechBlogTutorial](https://youtube.com/@TechBlogTutorial).

---

## Architecture & Visual System

- **Cyber-Terminal Shell**: Dark base (`#07090e`), neon cyan (`#00f5d4`), emerald (`#10b981`), and industrial amber accents for system engineering tracks.
- **Archimedean Field Guide**: Warm drafting parchment (`#F5EEDC`), deep Prussian blueprint ink (`#0B2545`), KaTeX formula typesetting, and DPI-scaled HTML5 Canvas 2D simulators for Senior Secondary STEM (`/stem-10-plus-2/*`) and Visual Lab (`/visual-lab/*`).
- **Interactive Visual Labs**:
  - **Vector Field Simulator**: Real-time particle advection across continuous vector fields with dynamic theme color inversion.
  - **Wave Matrix & Packet Routing**: Canvas & SVG simulations of cluster packet routing and physical wave propagation.
- **Standalone Docker Deployment**: Multi-stage standalone output with non-root security execution and automated health monitoring.

---

## Core Tracks

1. **Linux Server Administration** (`/linux-server-admin`): Production Rocky Linux, kernel hardening, systemd tuning, and firewall configurations.
2. **Clustering & Virtualization** (`/clustering-virtualization`): Proxmox VE 8, Ceph SDS distributed storage, high-availability quorum, and software-defined networking.
3. **Local AI Inference** (`/local-ai-inference`): vLLM, Ollama, AWQ/GGUF quantization, and private multi-GPU deployment topologies.
4. **10+2 STEM Mathematics** (`/stem-10-plus-2`): Calculus, limits, epsilon-delta proofs, and Riemann integration with step-through problem cards and reading companion dock.
5. **Video Companions** (`/video-companions`): Code snippets, terminal walk-throughs, and configurations paired with [@TechBlogTutorial](https://youtube.com/@TechBlogTutorial).
6. **Admin Studio** (`/admin`): Monaco code editor, Markdown live preview, YouTube synchronization, and Octokit GitOps publishing engine.

---

## Quickstart & Local Development

### Prerequisites
- Node.js 22 LTS or later
- npm 10+
- Docker & Docker Compose (optional for containerized run)

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/subro88/technhit-portal.git
cd technhit-portal

# 2. Install dependencies
npm ci

# 3. Configure environment
cp .env.example .env.local
# (Edit .env.local with your credentials)

# 4. Start development server
npm run dev
# -> http://localhost:3000
```

---

## Production Deployment via Docker

```bash
# Build and run production standalone container
docker compose up -d --build

# Verify container health
curl -I http://127.0.0.1:3000/api/health
```

### Zero-Downtime Hot Deployment Script

To deploy updates cleanly on the production host (`/www/wwwroot/technhit.in`):

```bash
sudo bash /www/wwwroot/technhit.in/scripts/update-technhit.sh
```

The script automatically:
1. Backs up production `.env` to prevent credential loss.
2. Performs `git fetch origin main` and `git reset --hard origin/main`.
3. Restores verified production environment configuration.
4. Rebuilds and restarts the container using parallel Docker caching.
5. Polls `/api/health` in a verification retry loop.
6. Prunes dangling images.

---

## Production Security & Reverse Proxy

TechNHIT includes a hardened Nginx reverse proxy configuration at [`nginx/technhit.conf`](nginx/technhit.conf) providing:
- Full SSL termination (TLS 1.2/1.3) with HTTP $\to$ HTTPS redirection.
- Strict security headers (`HSTS`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`).
- 1-Year immutable caching for static chunks (`/_next/static/*`).
- Dual-zone rate limiting for general browsing (`30r/s`) and Admin Studio (`5r/s`).

---

## License & Copyright

© 2026 TechNHIT Engineering. All rights reserved.  
Companion YouTube: [@TechBlogTutorial](https://youtube.com/@TechBlogTutorial)
