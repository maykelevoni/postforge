# Task 011: Create Template Action and Generation API Routes

## Type

## Description
Create API routes for template actions (favorite, use) and template-based content generation (from-template endpoint).

## Files
- `app/api/templates/[id]/favorite/route.ts` (create)
- `app/api/templates/[id]/use/route.ts` (create)
- `app/api/generate/from-template/route.ts` (create)

## Requirements
1. POST /api/templates/[id]/favorite - Toggle template favorite status
2. POST /api/templates/[id]/use - Increment template usage counter
3. POST /api/generate/from-template - Generate content using template
4. Generation endpoint should accept: templateId, variables, productInfo
5. Generation endpoint should return: content, validation, warnings
6. All routes require auth() session check
7. All routes follow existing API patterns
8. Proper error handling and status codes
9. Generation should use template service layer

## Existing Code to Reference
- `app/api/templates/[id]/route.ts` - Pattern for template routes
- `lib/templates.ts` - Template service functions
- `app/api/content/route.ts` - Pattern for generation endpoints

## Acceptance Criteria
- [ ] app/api/templates/[id]/favorite/route.ts created
- [ ] app/api/templates/[id]/use/route.ts created
- [ ] app/api/generate/from-template/route.ts created
- [ ] Favorite route toggles isFavorite status
- [ ] Use route increments usageCount
- [ ] Generation route accepts templateId, variables, productInfo
- [ ] Generation route returns content with validation
- [ ] All routes use auth() for session check
- [ ] All routes have proper error handling
- [ ] Status codes appropriate for each response

## Dependencies
- Task 010 (Template CRUD API routes)
- Task 009 (AI library template support)

## Commit Message
feat: create template action and generation API routes