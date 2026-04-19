# Task 025: Add How It Works and FAQ sections to Service template

## Type
ui

## Description
Add two new sections to the Service template (`service.tsx`): How It Works (numbered steps) and FAQ (collapsible accordion). Also update the testimonials render to support the new array format.

## Files
- `components/landing-pages/templates/service.tsx` (modify)

## Requirements

### LandingPageVariables / LandingPageSections interface updates
1. Add `steps?: { title: string; description: string }[]` to `LandingPageVariables`
2. Add `faqs?: { question: string; answer: string }[]` to `LandingPageVariables`
3. Add `howItWorks: boolean` to `LandingPageSections`
4. Add `faq: boolean` to `LandingPageSections`

### Testimonials — multi-support
5. `service.tsx` was updated in Task 023 to read from `variables.testimonials?.[0]`. Now also support rendering ALL testimonials (not just the first). If `testimonials.length > 1`, render a 2-column grid (like the SaaS template does).

### How It Works section
6. Render after the benefits section, before the testimonial section
7. Guard: `sections.howItWorks === true` AND `steps` array has at least 1 item with non-empty title
8. Section header: "How it works" (h2), subtitle: "Simple. Fast. Effective."
9. Each step: circular orange number badge (bg-orange-500 text-white), bold title (text-gray-900), description (text-gray-500)
10. Layout: 3-column grid on desktop (sm:grid-cols-3), single column on mobile
11. Light orange/warm background section (`bg-orange-50` or `bg-gray-50`) to visually separate it

### FAQ section
12. Render after testimonials, before CTA
13. Guard: `sections.faq === true` AND `faqs.length > 0`
14. Section header: "Frequently Asked Questions" (h2)
15. Each item: `<details>` element, `<summary>` = question (bold, cursor-pointer), body = answer (text-gray-600, pt-2 pb-4)
16. Style: each item in a bordered row (border-b border-gray-200), orange accent on summary hover
17. Use inline `<style>` tag for `details[open] summary` chevron rotation if desired, otherwise just open/close text

## Existing Code to Reference
- `components/landing-pages/templates/service.tsx` (read before editing)

## Acceptance Criteria
- [ ] `sections.howItWorks` renders the steps section when true and steps exist
- [ ] Steps show numbered orange badges + title + description
- [ ] `sections.faq` renders the FAQ section when true and faqs exist
- [ ] FAQ items expand/collapse using native `<details>`/`<summary>`
- [ ] Testimonials now render all items from the array (not just the first)
- [ ] Template renders gracefully when steps/faqs are empty/undefined

## Dependencies
- Task 023 (base type fixes)
- Task 024 (modal writes the new data)

## Commit Message
feat: add How It Works and FAQ sections to service landing page template
