# Task 002: Services CRUD API

## Description
API routes for creating, listing, updating, and deleting services.

## Files
- `app/api/services/route.ts` (create)
- `app/api/services/[id]/route.ts` (create)

## Requirements

### GET /api/services
- Auth check (401 if no session)
- Return all services for userId, include `_count: { tickets: true }` for each
- Order by createdAt desc

### POST /api/services
- Body: `{ name, description, deliverablesTemplate, priceMin, priceMax, turnaroundDays, funnelUrl? }`
- Create Service with userId from session, status "active"
- Return created service

### PATCH /api/services/[id]
- Verify service belongs to userId (404 if not found/wrong user)
- Update any provided fields
- Return updated service

### DELETE /api/services/[id]
- Verify ownership
- Delete service (cascades to tickets via Prisma)
- Return `{ success: true }`

## Existing Code to Reference
- `app/api/promote/route.ts` — GET pattern
- `app/api/promote/[id]/route.ts` — PATCH/DELETE pattern

## Acceptance Criteria
- [ ] GET returns services with ticket counts
- [ ] POST creates a service
- [ ] PATCH updates fields
- [ ] DELETE removes service
- [ ] All routes return 401 for unauthenticated requests

## Dependencies
- Task 001

## Commit Message
feat: add services CRUD API routes
