# Task 024: Update modal — testimonials list, remove logoGrid, add How It Works + FAQ editors

## Type
ui

## Description
Overhaul `landing-page-modal.tsx` to: (1) replace three flat testimonial inputs with a dynamic add/remove list, (2) remove the `logoGrid` ghost toggle, (3) add How It Works step editor (3 fixed rows), (4) add FAQ add/remove editor.

## Files
- `components/dashboard/services/landing-page-modal.tsx` (modify)

## Requirements

### Testimonials list
1. Remove `testimonialName`, `testimonialQuote`, `testimonialRole` from `TemplateVariables` interface
2. Add `testimonials: { name: string; quote: string; role: string }[]` to `TemplateVariables`
3. Replace the three flat input fields with a dynamic list (same pattern as the features list)
4. Each testimonial row: Name input (half width) + Quote input (half width) on one line, Role input (full width, placeholder "CEO, Acme Inc.") below
5. Add testimonial button at bottom of list; remove button (Trash2 icon) on each row
6. Update `defaultVariables()` to include `testimonials: []`
7. Update `parseVariables()` to parse the array

### LogoGrid removal
8. Remove `logoGrid` from `SectionToggles` interface
9. Remove `logoGrid: false` from `defaultSections()`
10. Remove `logoGrid` from `parseSections()`
11. The toggles grid renders all keys in `sections` — removing from the interface automatically removes the checkbox

### How It Works editor
12. Add `steps: { title: string; description: string }[]` to `TemplateVariables` (exactly 3 items, pre-initialized with empty strings)
13. Add `howItWorks: boolean` to `SectionToggles` (default: `true`)
14. In the editor form, add a "How It Works" sub-section after the features list with 3 fixed rows. Each row shows "Step N" label + Title input + Description input (side by side or stacked).
15. Update `defaultVariables()` and `parseVariables()` for steps
16. Update `defaultSections()` and `parseSections()` for howItWorks

### FAQ editor
17. Add `faqs: { question: string; answer: string }[]` to `TemplateVariables`
18. Add `faq: boolean` to `SectionToggles` (default: `false`)
19. In the editor form, add an "FAQ" sub-section after How It Works with a dynamic add/remove list
20. Each FAQ row: Question input (full width) + Answer input (full width), with remove button
21. Add FAQ button at bottom
22. Update `defaultVariables()` and `parseVariables()` for faqs
23. Update `defaultSections()` and `parseSections()` for faq

### Payload
24. Include `testimonials`, `steps`, `faqs` in the payload sent to the API (handlePublish + handleSave)

## Existing Code to Reference
- `components/dashboard/services/landing-page-modal.tsx` (full file — read it carefully before editing)

## Acceptance Criteria
- [ ] No `testimonialName`, `testimonialQuote`, `testimonialRole` fields in the modal
- [ ] Testimonials render as a dynamic list with Name, Quote, Role per row
- [ ] No "Logo Grid" checkbox in the sections toggles
- [ ] How It Works section shows 3 numbered step rows (title + description)
- [ ] FAQ section shows dynamic add/remove Q&A list
- [ ] `howItWorks` toggle defaults to true, `faq` defaults to false
- [ ] Payload sent to API includes `testimonials[]`, `steps[]`, `faqs[]`

## Dependencies
- Task 023 (templates updated to use the new shape)

## Commit Message
feat: update landing page modal with testimonials list, How It Works and FAQ editors, remove logoGrid
