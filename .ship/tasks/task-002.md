# Task 002: Prisma Schema & Database Setup

## Description
Define the full database schema and generate the Prisma client. All 11 models from plan.md.

## Files
- `prisma/schema.prisma` (create)
- `lib/db.ts` (create)

## Requirements
1. Implement all models exactly as defined in plan.md Section 2:
   - Auth.js models: `Account`, `Session`, `VerificationToken`
   - App models: `User`, `ResearchTopic`, `DiscoverItem`, `AppIdea`, `AffiliateProduct`, `Promotion`, `ContentPiece`, `Newsletter`, `ScheduleEntry`, `EngineRun`, `Setting`
2. All `@db.Text` annotations on long string fields (content, body, html, description, rules)
3. All `@@index([userId])` on user-scoped models
4. `lib/db.ts` exports `db` (PrismaClient singleton, safe for Next.js hot reload)
5. Provider: `postgresql`, URL from `env("DATABASE_URL")`

## Acceptance Criteria
- [ ] `pnpm prisma generate` runs without errors
- [ ] `pnpm prisma migrate dev --name init` creates migration successfully
- [ ] `lib/db.ts` exports singleton `db`

## Dependencies
- Task 001

## Commit Message
feat: add Prisma schema with all 11 models
