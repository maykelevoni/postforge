FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── install all deps (dev included — needed for build + prisma generate) ──────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# ── build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Skip runtime env validation during build
ENV NEXT_PHASE=phase-production-build
RUN pnpm build

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production deps only (tsx is now in dependencies so it's included)
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --prod

# Copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/worker ./worker
COPY next.config.js tsconfig.json ./

EXPOSE 3000

# Runs: next start + tsx worker/index.ts (via concurrently)
CMD ["pnpm", "start"]
