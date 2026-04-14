# Task 010: Create Template CRUD API Routes

## Type

## Description
Create API routes for template CRUD operations (list, create, get, update, delete) following existing API patterns in the codebase.

## Files
- `app/api/templates/route.ts` (create)
- `app/api/templates/[id]/route.ts` (create)

## Requirements
1. GET /api/templates - List templates with filtering (category, type, favorites)
2. POST /api/templates - Create new custom template
3. GET /api/templates/[id] - Get single template by ID
4. PUT /api/templates/[id] - Update template
5. DELETE /api/templates/[id] - Delete template
6. All routes require auth() session check
7. All routes return proper JSON responses
8. All routes have error handling
9. Follow existing API patterns (auth → check → query → response)
10. Proper HTTP status codes

## Existing Code to Reference
- `app/api/services/route.ts` - Pattern for list/create routes
- `app/api/services/[id]/route.ts` - Pattern for single item CRUD
- `app/api/content/route.ts` - Pattern for API structure

## Acceptance Criteria
- [ ] app/api/templates/route.ts created with GET and POST
- [ ] app/api/templates/[id]/route.ts created with GET, PUT, DELETE
- [ ] All routes use auth() for session check
- [ ] GET /api/templates supports filtering (category, type, favorites)
- [ ] POST /api/templates creates template with proper validation
- [ ] GET /api/templates/[id] returns template or 404
- [ ] PUT /api/templates/[id] updates template or returns 404
- [ ] DELETE /api/templates/[id] deletes template or returns 404
- [ ] All routes return proper JSON and status codes
- [ ] Error handling on all routes

## Dependencies
- Task 008 (Template service layer)
- Task 009 (AI library updates)

## Commit Message
feat: create template CRUD API routes