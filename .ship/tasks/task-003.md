# Task 003: Tickets CRUD API

## Description
API routes for listing, getting detail, and updating service tickets.

## Files
- `app/api/tickets/route.ts` (create)
- `app/api/tickets/[id]/route.ts` (create)

## Requirements

### GET /api/tickets
- Auth check
- Query params: `?status=&serviceId=`
- Return tickets for userId with service included (name, type)
- Order by createdAt desc

### GET /api/tickets/[id]
- Auth + ownership check
- Return full ticket with service included

### PATCH /api/tickets/[id]
- Auth + ownership check
- Updatable fields: `status`, `notes`, `quote`
- Return updated ticket

## Existing Code to Reference
- `app/api/research/route.ts` — GET with query params pattern
- `app/api/research/[id]/route.ts` — PATCH pattern

## Acceptance Criteria
- [ ] GET lists tickets, filterable by status and serviceId
- [ ] GET [id] returns full detail
- [ ] PATCH updates status, notes, or quote
- [ ] All routes return 401 / 404 correctly

## Dependencies
- Task 001

## Commit Message
feat: add tickets CRUD API routes
