# Task 011: Promotion Auto-Create for Active Services

## Description
When a Service is created or activated, automatically create/update a corresponding Promotion record so PostForge starts generating promotional content for it. When paused, pause the Promotion.

## Files
- `app/api/services/route.ts` (modify — POST handler)
- `app/api/services/[id]/route.ts` (modify — PATCH handler)

## Requirements

### On POST /api/services (create)
After creating the service, if `funnelUrl` is provided:
- Create a `Promotion` record:
  - userId: session.user.id
  - name: service.name
  - type: "service"
  - description: service.description
  - url: service.funnelUrl
  - priority: 5
  - status: "active"
- Update service: set `promotionId = promotion.id`

### On PATCH /api/services/[id]
If `status` is being changed:
- If changed to "paused" and service has promotionId: PATCH promotion status to "paused"
- If changed to "active" and service has promotionId: PATCH promotion status to "active"
If `funnelUrl` is changed and service has promotionId: update promotion url

### Content generation note
No changes to the content engine needed — the existing engine already generates content for any Promotion regardless of type. Setting type = "service" is enough for future filtering.

## Existing Code to Reference
- `app/api/discover/[id]/approve/route.ts` — pattern of creating a Promotion after approving an item
- `app/api/services/route.ts` — from Task 002

## Acceptance Criteria
- [ ] Creating a service with funnelUrl creates a Promotion automatically
- [ ] Pausing service pauses its Promotion
- [ ] Activating service re-activates its Promotion
- [ ] Service without funnelUrl skips Promotion creation gracefully

## Dependencies
- Task 002

## Commit Message
feat: auto-create and sync Promotion when service is created or toggled
