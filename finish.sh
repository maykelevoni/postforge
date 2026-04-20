#!/bin/bash
# finish.sh — Complete the PostForge server setup
# Run on the VPS after the repo is cloned to /var/www/postforge
set -e

APP_DIR="/var/www/postforge"
DOMAIN="getpostforge.cloud"

GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

info() { echo -e "${GREEN}[setup]${NC} $1"; }
warn() { echo -e "${YELLOW}[setup]${NC} $1"; }

# ── nginx ────────────────────────────────────────────────────────────────────

info "Configuring nginx..."
cp "$APP_DIR/nginx/getpostforge.conf" /etc/nginx/sites-available/getpostforge
ln -sf /etc/nginx/sites-available/getpostforge /etc/nginx/sites-enabled/getpostforge
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# ── .env ─────────────────────────────────────────────────────────────────────

if [ ! -f "$APP_DIR/.env" ]; then
  info "Creating .env..."
  echo ""
  read -rp "Paste your DATABASE_URL (Neon connection string): " DB_URL

  AUTH_SECRET=$(openssl rand -base64 32)
  info "Generated AUTH_SECRET."

  cat > "$APP_DIR/.env" <<EOF
DATABASE_URL=${DB_URL}
AUTH_SECRET=${AUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}
EOF

  info ".env created."
else
  warn ".env already exists — skipping."
fi

# ── deploy ───────────────────────────────────────────────────────────────────

info "Running deploy setup (install, migrate, build, PM2)..."
chmod +x "$APP_DIR/deploy.sh"
cd "$APP_DIR" && ./deploy.sh setup

# ── SSL ──────────────────────────────────────────────────────────────────────

echo ""
info "Checking if DNS is pointing to this server..."
RESOLVED=$(dig +short ${DOMAIN} 2>/dev/null || true)
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || true)

if [ "$RESOLVED" = "$SERVER_IP" ]; then
  info "DNS is live. Running certbot for SSL..."
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@${DOMAIN} --redirect
  info "SSL configured. App is live at https://${DOMAIN}"
else
  warn "DNS not yet pointing to this server (resolved: '${RESOLVED}', server: '${SERVER_IP}')."
  warn "Point your domain DNS A record to ${SERVER_IP}, wait a few minutes, then run:"
  warn "  certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m your@email.com --redirect"
  warn ""
  warn "App is running at http://${SERVER_IP} in the meantime."
fi

echo ""
info "Done."
