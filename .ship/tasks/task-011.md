# Task 011: Create landing page renderer route

## Description
Create the dynamic route that renders landing pages at `/l/[slug]`. Server component that reads the DB and renders the correct template.

## Files
- `app/(landing)/l/[slug]/page.tsx` (create)

## Requirements
1. Server component (no `"use client"`)
2. Receives `params: { slug: string }`
3. Query DB: `LandingPage.findUnique({ where: { slug }, include: { service: true } })`
4. If not found or status !== "published" → return 404
5. Parse `variables` and `sections` JSON
6. Render the correct template based on `page.template`:
   - `"saas"` → import Saas template
   - `"service"` → import Service template
   - `"lead_magnet"` → import LeadMagnet template
7. Pass landingPageId, variables, and sections to the template
8. Set proper page metadata (title, description from variables)
9. Handle errors gracefully

## Existing Code to Reference
- `app/(dashboard)/services/page.tsx` (for DB query patterns)
- `app/(landing)/l/[slug]/layout.tsx` (from Task 001)

## Acceptance Criteria
- [ ] `/l/[slug]` renders the correct template for published pages
- [ ] Unpublished/non-existent slugs return 404
- [ ] Page metadata set correctly
- [ ] No client-side rendering flicker
- [ ] Works without JavaScript (form degrades gracefully)

## Dependencies
- Task 001, Task 002, Task 009, Task 010

## Commit Message
feat: create dynamic landing page renderer route
