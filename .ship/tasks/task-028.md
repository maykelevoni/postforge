# Task 028: LeadForm ctaText prop

## Type
ui

## Description
The LeadForm submit button currently hardcodes "Get Started". Add an optional `ctaText` prop and pass the user's configured CTA text from all three templates.

## Files
- `components/landing-pages/lead-form.tsx` (modify)
- `components/landing-pages/templates/service.tsx` (modify)
- `components/landing-pages/templates/saas.tsx` (modify)
- `components/landing-pages/templates/lead-magnet.tsx` (modify)

## Requirements
1. Add `ctaText?: string` to `LeadFormProps` interface in `lead-form.tsx`
2. Default to `"Get Started"` when `ctaText` is empty or undefined
3. Replace the hardcoded `"Get Started"` string in the button with the prop value
4. In `service.tsx`: pass `ctaText={ctaText}` to `<LeadForm>`
5. In `saas.tsx`: pass `ctaText={ctaText}` to `<LeadForm>`
6. In `lead-magnet.tsx`: pass `ctaText={ctaText}` to `<LeadForm>`

## Existing Code to Reference
- `components/landing-pages/lead-form.tsx` (current file)

## Acceptance Criteria
- [ ] `LeadForm` accepts `ctaText` prop
- [ ] Submit button shows the passed ctaText value
- [ ] Falls back to "Get Started" when not provided
- [ ] All three templates pass ctaText

## Dependencies
- Task 025, 026, 027 (templates already updated)

## Commit Message
feat: pass ctaText to LeadForm submit button across all templates
