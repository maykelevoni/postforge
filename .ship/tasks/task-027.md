# Task 027: Add How It Works and FAQ sections to SaaS template

## Type
ui

## Description
Add How It Works and FAQ sections to the SaaS template. Style them to match the Cruip dark indigo aesthetic. The testimonials bug is already fixed in Task 023 — this task adds the new sections only.

## Files
- `components/landing-pages/templates/saas.tsx` (modify)

## Requirements

### Interface updates
1. Add `steps?: { title: string; description: string }[]` to `LandingPageVariables`
2. Add `faqs?: { question: string; answer: string }[]` to `LandingPageVariables`
3. Add `howItWorks: boolean` to `LandingPageSections`
4. Add `faq: boolean` to `LandingPageSections`

### How It Works section
5. Render after the features grid, before the testimonials section
6. Guard: `sections.howItWorks === true` AND at least 1 step with non-empty title
7. Section header with the Cruip decorative divider pattern already used in the features section (border-t with gradient border image)
8. "How it works" label badge (same inline-flex style as the "Features" label)
9. Step number badge: indigo-500/20 bg, indigo-400 text, rounded-full
10. Step title: `text-gray-200 font-semibold`, description: `text-indigo-200/65`
11. 3-column grid (lg:grid-cols-3), horizontal connector line between steps on desktop (subtle)

### FAQ section
12. Render after testimonials, before CTA
13. Guard: `sections.faq === true` AND `faqs.length > 0`
14. Same Cruip border-t gradient divider to open the section
15. `<details>`/`<summary>` accordion
16. Summary: `text-gray-200 font-medium cursor-pointer py-4`
17. Body: `text-indigo-200/65 pb-4`
18. Each item separated by `border-b border-gray-800`
19. Max width `max-w-3xl mx-auto` for readability

## Existing Code to Reference
- `components/landing-pages/templates/saas.tsx` (read before editing)

## Acceptance Criteria
- [ ] How It Works section renders with Cruip-styled numbered steps when enabled
- [ ] FAQ accordion works in dark theme using `<details>`/`<summary>`
- [ ] Section dividers match the existing Cruip pattern in the file
- [ ] Both sections render gracefully when data is absent

## Dependencies
- Task 023 (testimonials key fix)
- Task 024 (modal writes new data)

## Commit Message
feat: add How It Works and FAQ sections to SaaS landing page template
