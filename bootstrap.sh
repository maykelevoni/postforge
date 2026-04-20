#!/bin/bash
# bootstrap.sh — Full server setup from a clean Ubuntu install
# Run as root (or with sudo) on a fresh VPS
set -e

REPO_URL="https://github.com/maykelevoni/postforge.git"
APP_DIR="/var/www/postforge"
DOMAIN="getpostforge.cloud"
EMAIL="maykelevoni@gmail.com"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m"

info() { echo -e "${GREEN}[bootstrap]${NC} $1"; }
warn() { echo -e "${YELLOW}[bootstrap]${NC} $1"; }
die()  { echo -e "${RED}[bootstrap] ERROR:${NC} $1"; exit 1; }

# ── 1. system update ─────────────────────────────────────────────────────────

info "Updating system packages..."
apt-get update -y
apt-get upgrade -y
apt-get install -y curl git nginx certbot python3-certbot-nginx

# ── 2. install docker ────────────────────────────────────────────────────────

info "Installing Docker..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker
info "Docker $(docker --version) installed."

# ── 3. clone repo ─────────────────────────────────────────────────────────────

if [ -d "$APP_DIR/.git" ]; then
  warn "$APP_DIR already exists — pulling latest instead."
  git -C "$APP_DIR" pull
else
  info "Cloning repo to $APP_DIR..."
  git clone "$REPO_URL" "$APP_DIR"
fi

# ── 4. create .env ────────────────────────────────────────────────────────────

if [ ! -f "$APP_DIR/.env" ]; then
  echo ""
  warn "Creating .env — paste your Neon connection string:"
  read -rp "DATABASE_URL: " DB_URL

  AUTH_SECRET=$(openssl rand -base64 32)

  cat > "$APP_DIR/.env" <<EOF
DATABASE_URL=${DB_URL}
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}
EOF

  info ".env created (AUTH_SECRET auto-generated)."
else
  warn ".env already exists — skipping."
fi

# ── 5. build & start container ───────────────────────────────────────────────

info "Building and starting Docker container..."
cd "$APP_DIR"
docker compose up -d --build
info "Container is up."

# ── 6. run database migrations ───────────────────────────────────────────────

info "Running Prisma migrations..."
docker compose exec -T app pnpm exec prisma migrate deploy
info "Migrations done."

# ── 7. configure nginx ────────────────────────────────────────────────────────

info "Configuring nginx..."
cp "$APP_DIR/nginx/getpostforge.conf" /etc/nginx/sites-available/getpostforge
ln -sf /etc/nginx/sites-available/getpostforge /etc/nginx/sites-enabled/getpostforge
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ── 8. ssl ────────────────────────────────────────────────────────────────────

info "Checking DNS..."
RESOLVED=$(dig +short "$DOMAIN" 2>/dev/null || true)
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || true)

if [ "$RESOLVED" = "$SERVER_IP" ]; then
  info "DNS is live. Running certbot..."
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" \
    --non-interactive --agree-tos -m "$EMAIL" --redirect
  info "SSL configured."
else
  warn "DNS not yet pointing here (resolved: '${RESOLVED}', this server: '${SERVER_IP}')."
  warn "Point your domain A record to ${SERVER_IP}, wait a few minutes, then run:"
  warn "  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m ${EMAIL} --redirect"
  warn ""
  warn "App is running at http://${SERVER_IP} in the meantime."
fi

# ── done ─────────────────────────────────────────────────────────────────────

echo ""
info "Bootstrap complete."
info "  App:    https://${DOMAIN}  (or http://${SERVER_IP} if DNS not set)"
info "  Logs:   cd ${APP_DIR} && docker compose logs -f"
info "  Update: cd ${APP_DIR} && git pull && docker compose up -d --build"
