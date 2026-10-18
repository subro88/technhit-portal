#!/usr/bin/env bash
# =============================================================================
#  TechNHIT Engineering Portal & Studio — aaPanel Installer
#  Repository   : https://github.com/subro88/technhit-portal.git
#  Target Domain: https://technhit.in (and www.technhit.in)
#  Host Port    : 127.0.0.1:3000 (Protected from public direct access)
#  Container    : technhit_app
#
#  Usage:
#    bash scripts/install-technhit.sh
#    bash scripts/install-technhit.sh --dry-run
# =============================================================================

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

info()    { echo -e "${CYAN}[TECHNHIT]${RESET}   $*"; }
success() { echo -e "${GREEN}[TECHNHIT ✓]${RESET} $*"; }
warn()    { echo -e "${YELLOW}[TECHNHIT !]${RESET} $*"; }
error()   { echo -e "${RED}[TECHNHIT ✗]${RESET} $*" >&2; }

# ── Dry-run support ───────────────────────────────────────────────────────────
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1 && warn "DRY-RUN mode — no modifications will be applied"

run() {
    if [[ "$DRY_RUN" -eq 1 ]]; then
        echo -e "${YELLOW}[DRY]${RESET} $*"
    else
        eval "$@"
    fi
}

# ── Constants ─────────────────────────────────────────────────────────────────
DEFAULT_INSTALL_DIR="/www/wwwroot/technhit.in"
REPO_URL="https://github.com/subro88/technhit-portal.git"
APP_PORT=3000
APP_CONTAINER="technhit_app"

# ── Resolve install directory ─────────────────────────────────────────────────
if [[ -n "${APP_DIR:-}" ]]; then
    INSTALL_DIR="$APP_DIR"
elif [[ -f "$(pwd)/docker-compose.yml" && -f "$(pwd)/package.json" ]]; then
    INSTALL_DIR="$(pwd)"
else
    INSTALL_DIR="$DEFAULT_INSTALL_DIR"
fi

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo -e "${BOLD}${CYAN}  TechNHIT Engineering Portal — aaPanel Reverse Proxy Installer${RESET}"
echo -e "${BOLD}${CYAN}  Target Host   : 127.0.0.1:${APP_PORT}${RESET}"
echo -e "${BOLD}${CYAN}  Public Domain : https://technhit.in${RESET}"
echo -e "${BOLD}${CYAN}  Install Dir   : ${INSTALL_DIR}${RESET}"
echo -e "${BOLD}${CYAN}============================================================${RESET}"
echo ""

# ── 1. Check Prerequisites ────────────────────────────────────────────────────
info "Checking system requirements (Docker & Docker Compose)..."
if ! command -v docker >/dev/null 2>&1; then
    error "Docker is not installed! Please install Docker via aaPanel App Store or 'curl -fsSL https://get.docker.com | bash'."
    exit 1
fi

if ! docker compose version >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then
    error "Docker Compose is not installed! Please install docker-compose-plugin."
    exit 1
fi
success "Docker & Docker Compose detected."

# ── 2. Clone or Update Repository ─────────────────────────────────────────────
if [[ -d "$INSTALL_DIR/.git" ]]; then
    info "Found existing git repository in $INSTALL_DIR. Synchronizing origin/main..."
    run "cd '$INSTALL_DIR'"
    run "git stash || true"
    run "git fetch origin main"
    run "git reset --hard origin/main"
else
    info "Cloning repository from $REPO_URL to $INSTALL_DIR..."
    run "mkdir -p '$INSTALL_DIR'"
    run "git clone '$REPO_URL' '$INSTALL_DIR'"
    run "cd '$INSTALL_DIR'"
fi

# ── 3. Configure Production Environment (.env) ────────────────────────────────
ENV_FILE="$INSTALL_DIR/.env"
if [[ ! -f "$ENV_FILE" ]]; then
    info "Generating production environment secrets..."

    # Generate 32-byte cryptographic secret
    if command -v openssl >/dev/null 2>&1; then
        GEN_SECRET=$(openssl rand -hex 32)
        GEN_PASSWORD="TechNHIT#$(openssl rand -hex 4 | tr '[:lower:]' '[:upper:]')!"
    else
        GEN_SECRET=$(head -c 32 /dev/urandom | xxd -p)
        GEN_PASSWORD="TechNHIT#Cluster2026!"
    fi

    cat > "$ENV_FILE" <<EOF
# TechNHIT Portal & Studio Production Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_SITE_URL=https://technhit.in

# Cryptographic NextAuth Secret
AUTH_SECRET=${GEN_SECRET}

# GitHub OAuth Credentials (Optional - can be configured later)
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Authorized Admin Emails (comma-separated)
ADMIN_EMAILS=admin@technhit.in,subroto@technhit.in,editor@technhit.in

# Admin Fallback Password
ADMIN_FALLBACK_PASSWORD=${GEN_PASSWORD}

# GitHub GitOps Publishing Engine
GITHUB_PERSONAL_ACCESS_TOKEN=
GITHUB_OWNER=subro88
GITHUB_REPO=technhit-portal
GITHUB_BRANCH=main

# YouTube Data API Ingest (@TechBlogTutorial)
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_HANDLE=@TechBlogTutorial
EOF

    chmod 600 "$ENV_FILE"
    cp -f "$ENV_FILE" "$INSTALL_DIR/.env.local" 2>/dev/null || true
    success "Generated secure production .env configuration."
    info "Admin Studio Credentials:"
    info "  URL     : https://technhit.in/admin"
    info "  Email   : admin@technhit.in"
    info "  Password: ${GEN_PASSWORD}"
else
    info "Found existing .env. Preserving existing secrets."
fi

# ── 4. Verify Persistent Volume Directories & Permissions ─────────────────────
info "Setting up storage permissions for media and markdown content..."
run "mkdir -p '$INSTALL_DIR/content' '$INSTALL_DIR/public/uploads'"
run "chmod -R 775 '$INSTALL_DIR/content' '$INSTALL_DIR/public/uploads'"
success "Storage directories initialized."

# ── 5. Build and Launch Standalone Docker Container ───────────────────────────
info "Building and launching Docker container ($APP_CONTAINER) on port $APP_PORT..."
run "cd '$INSTALL_DIR'"
run "docker compose up -d --build --remove-orphans"

# ── 6. Health Check Validation ────────────────────────────────────────────────
info "Verifying cluster container health (http://127.0.0.1:${APP_PORT}/api/health)..."
MAX_ATTEMPTS=15
ATTEMPT=1
HEALTHY=0

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "  Attempt $ATTEMPT/$MAX_ATTEMPTS: Checking health endpoint..."
    if command -v curl >/dev/null 2>&1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${APP_PORT}/api/health" || true)
    else
        HTTP_CODE=$(wget --spider -S "http://127.0.0.1:${APP_PORT}/api/health" 2>&1 | awk '/HTTP\// {print $2}' | tail -1 || true)
    fi

    if [ "$HTTP_CODE" = "200" ]; then
        HEALTHY=1
        break
    fi
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $HEALTHY -eq 1 ]; then
    success "TechNHIT container is ONLINE and HEALTHY (HTTP 200) on 127.0.0.1:${APP_PORT}!"
else
    warn "Health endpoint did not reply with HTTP 200 within timeout."
    warn "Container logs:"
    docker logs --tail 25 "$APP_CONTAINER" || true
fi

# ── 7. Summary & aaPanel Reverse Proxy Instructions ───────────────────────────
echo ""
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo -e "${BOLD}${GREEN}  🎉  TechNHIT Backend Installation Complete!${RESET}"
echo -e "${BOLD}${GREEN}============================================================${RESET}"
echo ""
echo -e "${BOLD}  aaPanel Reverse Proxy Setup Instructions:${RESET}"
echo "  1. In aaPanel, navigate to: 'Website' -> 'Add site'"
echo "     - Domain Name: technhit.in, www.technhit.in"
echo "     - Root Dir   : /www/wwwroot/technhit.in"
echo "     - Database   : No (handled in container)"
echo "     - PHP Version: Pure static"
echo ""
echo "  2. Setup SSL Certificate:"
echo "     - Open website settings -> 'SSL' tab"
echo "     - Select 'Let's Encrypt' -> check 'technhit.in' and 'www.technhit.in' -> 'Apply'"
echo "     - Enable 'Force HTTPS'"
echo ""
echo "  3. Configure Reverse Proxy in aaPanel:"
echo "     - In website settings, go to the 'Reverse Proxy' tab -> click 'Add reverse proxy'"
echo "     - Proxy Name : technhit_proxy"
echo "     - Target URL : http://127.0.0.1:3000"
echo "     - Sent Domain: \$host"
echo "     - Enable 'Advanced' / WebSocket support"
echo ""
echo "  4. (Optional Recommended) Advanced Nginx Cache Rules:"
echo "     - In website settings -> 'Config' tab, review or include the snippet from:"
echo "       $INSTALL_DIR/nginx/aapanel-technhit.conf"
echo ""
echo -e "${BOLD}  Container Status:${RESET}"
docker ps --filter "name=$APP_CONTAINER" --format "  Name: {{.Names}}\n  Status: {{.Status}}\n  Ports: {{.Ports}}"
echo ""
