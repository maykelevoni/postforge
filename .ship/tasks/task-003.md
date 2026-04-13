# Task 003: Auth.js Setup (Credentials + Google OAuth)

## Description
Configure Auth.js v5 with credentials (email/password) and Google OAuth. Includes middleware to protect dashboard routes and a register API route.

## Files
- `auth.config.ts` (create)
- `auth.ts` (create)
- `middleware.ts` (create)
- `app/api/auth/[...nextauth]/route.ts` (create)
- `app/api/auth/register/route.ts` (create)

## Requirements
1. Auth.js v5 (`next-auth@5.0.0-beta.19`) pattern — same as launch/ reference
2. `auth.config.ts` — Google provider (optional, only if env vars set)
3. `auth.ts` — credentials provider with bcryptjs password check, Prisma adapter
4. `middleware.ts` — protects all `/(dashboard)` routes, redirects to `/sign-in`
5. Register route: `POST /api/auth/register` — validates email/password, hashes with bcryptjs, creates User
6. Session strategy: JWT
7. Callbacks: include `user.id` in session token

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/auth.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/auth.config.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/middleware.ts`
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/app/api/auth/register/route.ts`

## Acceptance Criteria
- [ ] `/api/auth/register` creates a user with hashed password
- [ ] Credentials sign-in works
- [ ] Unauthenticated requests to `/` redirect to `/sign-in`
- [ ] Session contains `user.id`

## Dependencies
- Task 002

## Commit Message
feat: add Auth.js v5 with credentials and Google OAuth
