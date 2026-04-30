#!/bin/sh
set -e

CONFIG_FILE="/app/config/.env"

# Load saved config from persistent volume (written by /api/setup)
if [ -f "$CONFIG_FILE" ]; then
  echo "[entrypoint] Loading config from $CONFIG_FILE"
  while IFS= read -r line; do
    # Skip comments and blank lines
    case "$line" in
      '#'*|'') continue ;;
    esac
    # Strip surrounding quotes from value if present
    key="${line%%=*}"
    val="${line#*=}"
    val="${val#\"}"
    val="${val%\"}"
    export "$key=$val"
  done < "$CONFIG_FILE"
fi

# Run migrations if database is configured
if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Running database migrations..."
  pnpm exec prisma migrate deploy
  echo "[entrypoint] Migrations done."
else
  echo "[entrypoint] No DATABASE_URL — starting in setup mode."
fi

echo "[entrypoint] Starting app..."
exec pnpm start
