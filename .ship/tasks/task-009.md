# Task 009: Update AI Library for Template Support

## Type

## Description
Modify lib/ai.ts to add generateFromTemplate function that supports template-based content generation with constraint enforcement.

## Files
- `lib/ai.ts` (modify)

## Requirements
1. Add GenerateFromTemplateOptions interface
2. Implement generateFromTemplate function
3. Function should fill template with provided variables
4. Function should generate AI prompt from filled template
5. Function should enforce template constraints (maxLength, requiredSections)
6. Function should use existing generateText function
7. Proper error handling for missing variables or template failures
8. Maintain compatibility with existing generateText function

## Existing Code to Reference
- `lib/ai.ts` - Existing generateText function pattern
- `lib/templates.ts` - Template interfaces (if available)
- Technical plan - AI integration specifications

## Acceptance Criteria
- [ ] GenerateFromTemplateOptions interface defined
- [ ] generateFromTemplate function implemented
- [ ] Function fills template with variables correctly
- [ ] Function generates proper AI prompt
- [ ] Function enforces template constraints
- [ ] Function uses existing generateText internally
- [ ] Proper error handling for edge cases
- [ ] Existing generateText function still works
- [ ] TypeScript typing correct

## Dependencies
- Task 008 (Template service layer with interfaces)

## Commit Message
feat: add template-based generation to AI library