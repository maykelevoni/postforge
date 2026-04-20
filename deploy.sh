#!/bin/bash
set -e

APP_DIR="/var/www/postforge"
APP_NAME="postforge"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

info()    { echo -e "${GREEN}[deploy]${NC} $1"; }
warn()    { echo -e "${YELLOW}[deploy]${NC} $1"; }
die()     { echo -e "${RED}[deploy] ERROR:${NC} $1"; exit 1; }

# ── helpers ──────────────────────────────────────────────────────────────────

check_deps() {
  for cmd in git pnpm pm2 node; do
    command -v "$cmd" &>/dev/null || die "'$cmd' not found. Run the server setup steps first."
  done
}

env_check() {
  [ -f "$APP_DIR/.env" ] || die ".env file missing at $APP_DIR/.env — create it before deploying."
  grep -q "DATABASE_URL" "$APP_DIR/.env" || die "DATABASE_URL missing from .env"
  grep -q "AUTH_SECRET"  "$APP_DIR/.env" || die "AUTH_SECRET missing from .env"
  grep -q "NEXTAUTH_URL" "$APP_DIR/.env" || die "NEXTAUTH_URL missing from .env"
}

pm2_action() {
  # start on first deploy, restart on subsequent ones
  if pm2 list | grep -q "$APP_NAME"; then
    info "Restarting PM2 process '$APP_NAME'..."
    pm2 restart "$APP_NAME"
  else
    info "Starting PM2 process '$APP_NAME' for the first time..."
    pm2 start pnpm --name "$APP_NAME" -- start
    pm2 save
  fi
}

# ── commands ─────────────────────────────────────────────────────────────────

cmd_update() {
  info "Pulling latest code..."
  git -C "$APP_DIR" pull

  info "Installing dependencies..."
  cd "$APP_DIR" && pnpm install --frozen-lockfile

  info "Running DB migrations..."
  cd "$APP_DIR" && pnpm exec prisma migrate deploy

  info "Building app..."
  cd "$APP_DIR" && pnpm build

  pm2_action
  info "Done. App is live."
}

cmd_setup() {
  info "=== First-time server setup ==="

  check_deps
  env_check

  info "Installing dependencies..."
  cd "$APP_DIR" && pnpm install --frozen-lockfile

  info "Running DB migrations..."
  cd "$APP_DIR" && pnpm exec prisma migrate deploy

  info "Building app..."
  cd "$APP_DIR" && pnpm build

  pm2_action

  echo ""
  warn "Next steps:"
  warn "  1. Set up nginx (see README or deployment guide)"
  warn "  2. Run: sudo certbot --nginx -d yourdomain.com"
  warn "  3. Log in to the app and fill in API keys in Settings"
  echo ""
  info "Setup complete."
}

cmd_logs() {
  pm2 logs "$APP_NAME" --lines 100
}

cmd_status() {
  pm2 status
}

cmd_rollback() {
  warn "Rolling back to previous git commit..."
  git -C "$APP_DIR" reset --hard HEAD~1
  cmd_update
}

# ── main ─────────────────────────────────────────────────────────────────────

CMD="${1:-update}"

case "$CMD" in
  setup)    check_deps && env_check && cmd_setup ;;
  update)   check_deps && env_check && cmd_update ;;
  logs)     cmd_logs ;;
  status)   cmd_status ;;
  rollback) check_deps && env_check && cmd_rollback ;;
  *)
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup     First-time deploy (install, migrate, build, start PM2)"
    echo "  update    Pull latest code and redeploy (default)"
    echo "  logs      Tail PM2 logs"
    echo "  status    Show PM2 process status"
    echo "  rollback  Revert last commit and redeploy"
    exit 1
    ;;
esac
