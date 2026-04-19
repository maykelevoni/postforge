# Task 007: Create landing page API routes

## Description
Create CRUD API routes for managing landing pages (create, update, delete, list).

## Files
- `app/api/landing-pages/route.ts` (create)
- `app/api/landing-pages/[id]/route.ts` (create)

## Requirements
1. **POST /api/landing-pages** (auth required):
   - Accept: `{ serviceId, template, variables, sections }`
   - Validate serviceId exists and belongs to user
   - Generate unique slug from service name + random suffix
   - Create LandingPage with status "published"
   - Update Service.landingPageId
   - Return: `{ id, slug, url: "/l/[slug]" }`

2. **PATCH /api/landing-pages/[id]** (auth required):
   - Accept: partial `{ variables?, sections?, status? }`
   - Verify landing page belongs to user
   - Update and return updated page

3. **DELETE /api/landing-pages/[id]** (auth required):
   - Verify landing page belongs to user
   - Delete landing page
   - Null out Service.landingPageId
   - Return: `{ success: true }`

4. **GET /api/landing-pages** (auth required):
   - List all landing pages for current user
   - Include service name in response
   - Return: `[{ id, slug, template, status, service: { name } }]`

## Existing Code to Reference
- `app/api/settings/route.ts` (auth + DB pattern)
- `app/api/services/route.ts` (CRUD pattern for similar resource)

## Acceptance Criteria
- [ ] All 4 endpoints work correctly
- [ ] Auth checks prevent cross-user access
- [ ] Slug generation is unique
- [ ] Service.landingPageId updated on create/delete
- [ ] TypeScript compiles without errors

## Dependencies
- Task 002

## Commit Message
feat: add landing page CRUD API routes
