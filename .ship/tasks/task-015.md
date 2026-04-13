# Task 015: SSE + Engine Run API

## Description
Server-Sent Events route for live dashboard updates and the manual engine run API endpoint.

## Files
- `app/api/sse/route.ts` (create)
- `app/api/engine/run/route.ts` (create)

## Requirements

### SSE route (`/api/sse`)
- Auth required — reads session userId
- Returns `text/event-stream` response
- Keeps connection alive with 30s heartbeat comment (`": heartbeat\n\n"`)
- Event types emitted:
  - `engine_update` — `{ type, status, message }` when worker runs
  - `post_published` — `{ platform, promotionName }` when post goes live
  - `discover_new` — `{ count }` when new discover items created
- Global in-memory event emitter (singleton) that worker modules can import and emit to
- On client disconnect: cleanup listener

### Engine run route (`POST /api/engine/run`)
- Auth required
- Calls `triggerFullRun(userId)` from worker (runs research → discover → content → schedule in sequence)
- Returns `{ success: true, message: "Engine started" }`
- Non-blocking — runs in background, SSE emits updates

### lib/events.ts (create)
- Singleton `EventEmitter` exported as `emitter`
- Helper: `emitEngineUpdate(userId, data)`, `emitPostPublished(userId, data)`, `emitDiscoverNew(userId, data)`
- Worker modules import and call these helpers after key actions

## Existing Code to Reference
- `/mnt/c/Users/mayke/OneDrive/Desktop/App_Projects/launch/app/api/sse/route.ts`

## Acceptance Criteria
- [ ] SSE connection established from browser
- [ ] Heartbeat keeps connection alive
- [ ] `engine_update` event received when engine runs
- [ ] POST `/api/engine/run` starts pipeline and returns immediately
- [ ] Disconnect cleanup works (no memory leaks)

## Dependencies
- Task 014

## Commit Message
feat: add SSE live updates and engine run API
