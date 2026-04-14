# Task 012: Update Content Generation Workers for Template Support

## Type

## Description
Modify worker/content/generate.ts and worker/content/media.ts to support optional template parameters for template-based content generation.

## Files
- `worker/content/generate.ts` (modify)
- `worker/content/media.ts` (modify)

## Requirements
1. Add optional templateId parameter to generatePostsForPromotion
2. Add optional imageTemplateId and videoTemplateId to generateMediaForPiece
3. When templateId provided, use template-based generation
4. When template not provided, use existing generation
5. Update ContentPiece creation to include templateId and variables
6. Update Newsletter creation to include template IDs and variables
7. Log template usage for debugging
8. Maintain backward compatibility (no template = old behavior)

## Existing Code to Reference
- `worker/content/generate.ts` - Existing content generation logic
- `worker/content/media.ts` - Existing media generation logic
- `lib/templates.ts` - Template service functions

## Acceptance Criteria
- [ ] generatePostsForPromotion accepts optional templateId
- [ ] generateMediaForPiece accepts optional template parameters
- [ ] Template-based generation uses template service
- [ ] Non-template generation uses existing logic
- [ ] ContentPiece creation includes template fields
- [ ] Newsletter creation includes template fields
- [ ] Template usage logged appropriately
- [ ] Backward compatibility maintained
- [ ] No breaking changes to existing functionality

## Dependencies
- Task 011 (Template generation API)
- Task 009 (AI library template support)

## Commit Message
feat: add template support to content generation workers