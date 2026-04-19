# Task 026: Add How It Works and FAQ sections to Lead Magnet template

## Type
ui

## Description
Add How It Works and FAQ sections to the Lead Magnet template. Style them to match the dark rose/purple aesthetic already used by this template.

## Files
- `components/landing-pages/templates/lead-magnet.tsx` (modify)

## Requirements

### Interface updates
1. Add `steps?: { title: string; description: string }[]` to `LandingPageVariables`
2. Add `faqs?: { question: string; answer: string }[]` to `LandingPageVariables`
3. Add `howItWorks: boolean` to `LandingPageSections`
4. Add `faq: boolean` to `LandingPageSections`

### Testimonials
5. The interface already has `testimonials` from Task 023. If `sections.testimonial === true` AND testimonials exist, render them. Single testimonial: full-width card. Multiple: grid (same rose/purple card style as the hero glow aesthetic).

### How It Works section
6. Render after the benefits list, before the form
7. Guard: `sections.howItWorks === true` AND at least 1 step with non-empty title
8. Background: dark section (`bg-white/5` or similar), subtle glow consistent with this template's style
9. Step number badge: rose-500/20 background, rose-400 text number
10. Title: `text-white`, description: `text-gray-400`
11. 3-column grid desktop, single-column mobile

### FAQ section
12. Render after How It Works (or testimonials if present), before the form
13. Guard: `sections.faq === true` AND `faqs.length > 0`
14. Dark card background consistent with the rest of this template
15. `<details>`/`<summary>` accordion; summary text: `text-white font-medium`; body: `text-gray-400`
16. Border: `border-b border-white/10`

## Existing Code to Reference
- `components/landing-pages/templates/lead-magnet.tsx` (read before editing)

## Acceptance Criteria
- [ ] How It Works renders with rose-themed numbered steps when enabled
- [ ] FAQ accordion works with native `<details>`/`<summary>` in dark theme
- [ ] Testimonials render from the `testimonials[]` array
- [ ] Template renders gracefully when new fields are absent

## Dependencies
- Task 023 (base type fixes)
- Task 024 (modal writes new data)

## Commit Message
feat: add How It Works and FAQ sections to lead magnet landing page template
