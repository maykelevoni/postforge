# Task 002: Add LandingPage, LandingPageSubmission, and Subscriber models to Prisma

## Description
Add new database models for landing pages, form submissions, and the subscriber email list. Modify Service model to link to landing pages.

## Files
- `prisma/schema.prisma` (modify)

## Requirements
1. Add `LandingPage` model with: id, userId, serviceId (unique), slug (unique), template, variables (JSON text), sections (JSON text), status, timestamps
2. Add `LandingPageSubmission` model with: id, landingPageId, name, email, source, status, createdAt
3. Add `Subscriber` model with: id, name, email, userId, serviceId (optional), landingPageId (optional), source (optional), createdAt. Add @@unique([email, userId]) to prevent duplicate subscribers per user
4. Add `landingPageId String? @unique` to Service model
5. Add `landingPage LandingPage?` relation to Service
6. Add `landingPages LandingPage[]`, `submissions LandingPageSubmission[]`, and `subscribers Subscriber[]` relations to relevant models
7. Run migration: `pnpm dlx "prisma@5.20.0" migrate dev --name add_landing_pages_submissions_subscribers`

## Existing Code to Reference
- `prisma/schema.prisma` (existing Service model, User model for relation patterns)

## Acceptance Criteria
- [ ] Prisma schema updated with all three new models and relations
- [ ] Subscriber model has @@unique([email, userId]) constraint
- [ ] Migration runs successfully
- [ ] `pnpm dlx "prisma@5.20.0" generate` completes without errors

## Dependencies
- None

## Commit Message
feat: add landing page, submission, and subscriber prisma models
