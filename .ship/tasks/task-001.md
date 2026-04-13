# Task 001: Project Scaffold & Config

## Description
Bootstrap the Next.js 14 project with all config files, dependencies, and environment setup. This is the foundation every other task builds on.

## Files
- `package.json` (create)
- `tsconfig.json` (create)
- `next.config.js` (create)
- `postcss.config.js` (create)
- `env.mjs` (create)
- `components.json` (create)
- `.env.example` (create)
- `.gitignore` (create)

## Requirements
1. Next.js 14.2.x, React 18, TypeScript 5
2. pnpm only — never npm
3. Dependencies: `next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/node`, `next-auth@5.0.0-beta.19`, `@prisma/client`, `prisma`, `node-cron`, `@types/node-cron`, `tsx`, `concurrently`, `zod`, `bcryptjs`, `@types/bcryptjs`
4. shadcn/ui deps: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `@radix-ui/react-switch`, `@radix-ui/react-select`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tailwindcss`, `autoprefixer`
5. fal.ai: `@fal-ai/client`
6. `env.mjs` validates: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` — optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
7. `package.json` scripts: `dev: concurrently "next dev" "tsx watch worker/index.ts"`, `build: next build`, `start: concurrently "next start" "tsx worker/index.ts"`, `worker: tsx worker/index.ts`, `postinstall: prisma generate`
8. `tsconfig.json` path alias: `@/*` → `./*`
9. `components.json` for shadcn/ui with style `default`, baseColor `slate`, cssVariables `true`
10. `.env.example` lists all required and optional env vars with comments

## Acceptance Criteria
- [ ] `pnpm install` runs without errors
- [ ] TypeScript compiles (`pnpm tsc --noEmit`)
- [ ] All env vars documented in `.env.example`

## Commit Message
chore: scaffold project with Next.js 14, pnpm, and config files
