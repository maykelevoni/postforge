FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── install & build ───────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
# Full install so prisma CLI is available for postinstall (prisma generate)
RUN pnpm install --frozen-lockfile

COPY . .
# Skip runtime env validation during build
ENV NEXT_PHASE=phase-production-build
RUN pnpm build

# ── runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy everything from builder — full node_modules keeps the prisma generated
# client intact without having to locate pnpm's internal store path
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/worker ./worker
COPY --from=builder /app/prisma ./prisma
COPY package.json next.config.js tsconfig.json ./

EXPOSE 3000

# Runs: next start + tsx worker/index.ts (via concurrently)
CMD ["pnpm", "start"]
