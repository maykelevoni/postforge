#!/bin/bash
set -e
APP_DIR="/var/www/postforge"
DOMAIN="getpostforge.cloud"
EMAIL="maykelevoni@gmail.com"

cp "$APP_DIR/nginx/getpostforge.conf" /etc/nginx/sites-available/getpostforge
ln -sf /etc/nginx/sites-available/getpostforge /etc/nginx/sites-enabled/getpostforge
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "nginx configured."

RESOLVED=$(dig +short "$DOMAIN" 2>/dev/null || true)
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || true)

if [ "$RESOLVED" = "$SERVER_IP" ]; then
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
  echo "SSL done. App is live at https://$DOMAIN"
else
  echo "DNS not yet pointing here (resolved: '$RESOLVED', server: '$SERVER_IP')."
  echo "Point your A record to $SERVER_IP then run:"
  echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL --redirect"
fi
