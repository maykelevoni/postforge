# Task 006: Update Database Schema for Templates

## Type

## Description
Add Template and GeneratedContent models to Prisma schema and update existing ContentPiece and Newsletter models to support template-based content generation.

## Files
- `prisma/schema.prisma` (modify)

## Requirements
1. Add Template model with fields: id, userId, name, category, type, template, variables, constraints, example, isFavorite, usageCount
2. Add GeneratedContent model to track template usage
3. Update ContentPiece model: add templateId and variables fields
4. Update Newsletter model: add subjectTemplateId, bodyTemplateId, subjectVariables, bodyVariables fields
5. Update User model: add templates and generatedContents relations
6. Add proper indexes for performance

## Existing Code to Reference
- `prisma/schema.prisma` - Existing model patterns (ContentPiece, Newsletter, User)
- Technical plan Section 2 - Database schema specifications

## Acceptance Criteria
- [ ] Template model added with all required fields
- [ ] GeneratedContent model added
- [ ] ContentPiece model updated with template fields
- [ ] Newsletter model updated with template fields
- [ ] User model updated with new relations
- [ ] Proper indexes added (userId, category, templateId)
- [ ] Schema follows existing Prisma patterns

## Dependencies
- Task 005 (Icons complete, moving to templates)

## Commit Message
feat: add Template and GeneratedContent models to database schema