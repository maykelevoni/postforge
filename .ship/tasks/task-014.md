# Task 014: Create Template Editor and Selection Components

## Type
ui

## Description
Create template editor for custom templates and template selection modal for integrating templates into content generation flow.

## Files
- `components/dashboard/templates/template-editor.tsx` (create)
- `components/dashboard/templates/template-preview.tsx` (create)
- `components/dashboard/templates/template-selection-modal.tsx` (create)
- `components/dashboard/templates/variable-form.tsx` (create)

## Requirements
1. Template editor for creating/editing custom templates
2. Template preview component to show filled examples
3. Template selection modal for content generation flow
4. Variable form component for confirming AI-filled variables
5. All components use inline styles
6. Proper form validation and error handling
7. Integration with template API endpoints
8. User-friendly interface for template creation
9. Modal can be skipped (generate without template)

## Existing Code to Reference
- `components/dashboard/services/service-form.tsx` - Pattern for form components
- `components/dashboard/content/content-piece-card.tsx` - Pattern for modals
- Technical plan - Component specifications

## Acceptance Criteria
- [ ] Template editor allows creating custom templates
- [ ] Template editor validates template syntax
- [ ] Template preview shows filled examples
- [ ] Template selection modal displays available templates
- [ ] Variable form shows AI-generated variables
- [ ] All components use inline styles
- [ ] Form validation works properly
- [ ] API integration functional
- [ ] Modal can be skipped
- [ ] User interface intuitive and polished

## Dependencies
- Task 013 (Templates page and core components)

## Commit Message
feat: create template editor and selection components