# Task 008: Create Template Service Layer

## Type

## Description
Create lib/templates.ts with all template business logic including CRUD operations, variable filling, constraint validation, and AI integration functions.

## Files
- `lib/templates.ts` (create)

## Requirements
1. Create TypeScript interfaces for Template, TemplateVariable, TemplateConstraints
2. Implement getTemplates with filtering (category, type, favorites)
3. Implement getTemplateById with optional user check
4. Implement createTemplate, updateTemplate, deleteTemplate
5. Implement toggleTemplateFavorite
6. Implement generateFromTemplate with AI integration
7. Implement fillTemplateVariables for AI variable generation
8. Implement validateTemplateConstraints for validation
9. All functions should use existing db patterns
10. Proper error handling and TypeScript typing

## Existing Code to Reference
- `lib/ai.ts` - Pattern for AI integration
- `lib/settings.ts` - Pattern for database operations
- Technical plan - Template service layer specifications

## Acceptance Criteria
- [ ] lib/templates.ts created with all required functions
- [ ] TypeScript interfaces defined (Template, TemplateVariable, TemplateConstraints)
- [ ] CRUD functions implemented (getTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate)
- [ ] Action functions implemented (toggleTemplateFavorite)
- [ ] Generation functions implemented (generateFromTemplate, fillTemplateVariables)
- [ ] Validation function implemented (validateTemplateConstraints)
- [ ] All functions follow existing code patterns
- [ ] Proper error handling and TypeScript typing

## Dependencies
- Task 007 (Database migration complete)

## Commit Message
feat: create template service layer with CRUD and generation functions