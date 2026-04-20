#!/bin/bash
# setup-server.sh — Run once on a fresh Ubuntu VPS as root
# Usage: bash setup-server.sh <github-repo-url>
# Example: bash setup-server.sh https://github.com/youruser/postforge.git
set -e

REPO_URL="${1:-}"
APP_DIR="/var/www/postforge"
NODE_VERSION="20"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

info() { echo -e "${GREEN}[setup]${NC} $1"; }
warn() { echo -e "${YELLOW}[setup]${NC} $1"; }
die()  { echo -e "${RED}[setup] ERROR:${NC} $1"; exit 1; }

[ "$EUID" -eq 0 ] || die "Run as root: sudo bash setup-server.sh <repo-url>"
[ -n "$REPO_URL" ] || die "Usage: bash setup-server.sh <github-repo-url>"

# ── System packages ───────────────────────────────────────────────────────────

info "Updating packages..."
apt-get update -y && apt-get upgrade -y

info "Installing system dependencies..."
apt-get install -y git curl build-essential nginx certbot python3-certbot-nginx ufw

# ── Node.js 20 ────────────────────────────────────────────────────────────────

info "Installing Node.js $NODE_VERSION..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

node --version
npm --version

# ── pnpm ─────────────────────────────────────────────────────────────────────

info "Installing pnpm..."
npm install -g pnpm@latest
pnpm --version

# ── PM2 ──────────────────────────────────────────────────────────────────────

info "Installing PM2..."
npm install -g pm2
pm2 startup systemd -u root --hp /root
systemctl enable pm2-root 2>/dev/null || true

# ── Firewall ─────────────────────────────────────────────────────────────────

info "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── Clone repo ───────────────────────────────────────────────────────────────

info "Creating app directory..."
mkdir -p "$APP_DIR"

info "Cloning repo from $REPO_URL..."
git clone "$REPO_URL" "$APP_DIR"

# ── Nginx ────────────────────────────────────────────────────────────────────

info "Setting up nginx..."
cp "$APP_DIR/nginx/getpostforge.conf" /etc/nginx/sites-available/getpostforge
ln -sf /etc/nginx/sites-available/getpostforge /etc/nginx/sites-enabled/getpostforge
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ── Done ─────────────────────────────────────────────────────────────────────

echo ""
warn "=== Next steps ==="
warn "1. Create the .env file:"
warn "   nano $APP_DIR/.env"
warn ""
warn "   Required values:"
warn "   DATABASE_URL=your-neon-url"
warn "   AUTH_SECRET=\$(openssl rand -base64 32)"
warn "   NEXTAUTH_URL=https://getpostforge.cloud"
warn ""
warn "2. Point your domain DNS to this server IP, then run:"
warn "   sudo certbot --nginx -d getpostforge.cloud -d www.getpostforge.cloud"
warn ""
warn "3. Deploy the app:"
warn "   cd $APP_DIR && ./deploy.sh setup"
echo ""
info "Server bootstrap complete."
