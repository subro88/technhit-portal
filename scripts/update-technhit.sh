#!/usr/bin/env bash
# =============================================================================
# Zero-Downtime Hot Deployment Script for TechNHIT (technhit.in)
# NHIT Suite Industrial Systems & AI Cluster Publication
# =============================================================================

set -e

INSTALL_DIR="/www/wwwroot/technhit.in"
if [[ -f "$(pwd)/docker-compose.yml" && -d "$(pwd)/app" ]]; then
    INSTALL_DIR="$(pwd)"
fi

echo "============================================================"
echo " 🚀 Starting Zero-Downtime Hot Deployment for TechNHIT"
echo " Production Directory: $INSTALL_DIR"
echo " Time: $(date -u +"%Y-%m-%d %H:%M:%SZ")"
echo "============================================================"

cd "$INSTALL_DIR"

# 1. Backup production .env before any git operations
if [[ -f "$INSTALL_DIR/.env" ]]; then
    cp -f "$INSTALL_DIR/.env" "$INSTALL_DIR/.env.prod.bak" 2>/dev/null || true
elif [[ -f "$INSTALL_DIR/.env.local" ]]; then
    cp -f "$INSTALL_DIR/.env.local" "$INSTALL_DIR/.env.prod.bak" 2>/dev/null || true
fi

# 2. Git Safe Directory & Sync
echo "[1/6] Synchronizing repository from origin/main..."
git config --global --add safe.directory "$INSTALL_DIR" 2>/dev/null || true
git config --system --add safe.directory "$INSTALL_DIR" 2>/dev/null || true

# Auto-configure authenticated git origin if GITHUB_PERSONAL_ACCESS_TOKEN is present in .env
if [[ -f "$INSTALL_DIR/.env" ]]; then
    ENV_TOKEN=$(grep -E '^GITHUB_PERSONAL_ACCESS_TOKEN=' "$INSTALL_DIR/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'" | tr -d ' ' || true)
    if [[ -n "$ENV_TOKEN" && "$ENV_TOKEN" != "ghp_placeholder_pat_token" && "$ENV_TOKEN" == ghp_* ]]; then
        git remote set-url origin "https://${ENV_TOKEN}@github.com/subro88/technhit-portal.git" 2>/dev/null || true
    fi
fi

PREV_REV=$(git rev-parse HEAD 2>/dev/null || echo "")

git stash || true
git fetch origin main
git reset --hard origin/main
git stash pop 2>/dev/null || true

CURR_REV=$(git rev-parse HEAD 2>/dev/null || echo "")

# 3. Restore verified production .env
if [[ -f "$INSTALL_DIR/.env.prod.bak" ]]; then
    echo "[2/6] Restoring verified production environment configuration..."
    cp -f "$INSTALL_DIR/.env.prod.bak" "$INSTALL_DIR/.env"
    cp -f "$INSTALL_DIR/.env.prod.bak" "$INSTALL_DIR/.env.local" 2>/dev/null || true
fi

# 4. Ensure persistent directories exist and have proper permissions
echo "[3/6] Verifying storage permissions for media and markdown content..."
mkdir -p "$INSTALL_DIR/content" "$INSTALL_DIR/public/uploads"
chmod -R 775 "$INSTALL_DIR/content" "$INSTALL_DIR/public/uploads" 2>/dev/null || true

# 5. Smart Deployment Engine: Differentiate Content vs Code Changes
echo "[4/6] Analyzing deployment changes..."

MODE="auto"
for arg in "$@"; do
    case "$arg" in
        --clean|--rebuild|--no-cache)
            MODE="clean"
            ;;
        --content|--fast|--restart)
            MODE="restart"
            ;;
    esac
done

if [[ "$MODE" == "auto" ]]; then
    if [[ -n "$PREV_REV" && -n "$CURR_REV" && "$PREV_REV" != "$CURR_REV" ]]; then
        CODE_CHANGES=$(git diff --name-only "$PREV_REV" "$CURR_REV" | grep -v -E '^content/|^public/uploads/|\.md$' || true)
        if [[ -z "$CODE_CHANGES" ]]; then
            MODE="restart"
            echo "  ⚡ Only Markdown / Content changes detected ($PREV_REV..$CURR_REV)."
        else
            MODE="cached-build"
            echo "  🔨 Code or configuration changes detected:"
            echo "$CODE_CHANGES" | head -n 5 | sed 's/^/     - /'
        fi
    else
        MODE="cached-build"
    fi
fi

if [[ "$MODE" == "restart" ]]; then
    echo "[5/6] ⚡ Performing instant container hot-restart (0s build time)..."
    docker compose restart technhit-portal
elif [[ "$MODE" == "clean" ]]; then
    echo "[5/6] 🧹 Building production standalone container from scratch (--no-cache)..."
    docker compose build --no-cache technhit-portal
    docker compose up -d --force-recreate --remove-orphans technhit-portal
else
    echo "[5/6] 🚀 Building production container with layer cache (~30s build time)..."
    docker compose build technhit-portal
    docker compose up -d --remove-orphans technhit-portal
fi

# 6. Automated Health Check Verification
echo "[6/6] Verifying cluster health status..."
HEALTH_URL="http://127.0.0.1:3000/api/health"
MAX_ATTEMPTS=12
ATTEMPT=1
HEALTHY=0

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "  Attempt $ATTEMPT/$MAX_ATTEMPTS: Pinging $HEALTH_URL..."
    if command -v curl >/dev/null 2>&1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" || true)
    else
        HTTP_CODE=$(wget --spider -S "$HEALTH_URL" 2>&1 | awk '/HTTP\// {print $2}' | tail -1 || true)
    fi

    if [ "$HTTP_CODE" = "200" ]; then
        HEALTHY=1
        break
    fi
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $HEALTHY -eq 1 ]; then
    echo "============================================================"
    echo " ✅ TechNHIT is ONLINE and HEALTHY (HTTP 200)"
    echo " Domain: https://technhit.in"
    echo " Version: $(git rev-parse --short HEAD 2>/dev/null || echo 'production')"
    echo "============================================================"
else
    echo "============================================================"
    echo " ⚠️ WARNING: Health check did not return HTTP 200 within timeout."
    echo " Recent container diagnostics:"
    docker logs --tail 40 technhit_app || true
    echo "============================================================"
    exit 1
fi

# Clean up dangling images
docker image prune -f >/dev/null 2>&1 || true

# Reload host Nginx if installed
if command -v nginx >/dev/null 2>&1; then
    nginx -t 2>/dev/null && systemctl reload nginx 2>/dev/null || true
fi

echo "Deployment complete."
