# Task 023: Fix testimonials types across all three templates

## Description
Unify the testimonials data model across all three landing page templates. No visual changes yet — this is purely interface/type alignment.

- `saas.tsx`: rename `LandingPageSections.testimonials` → `testimonial` (singular, matches what the modal stores). Change `variables.testimonials` type from `{ name: string; text: string }[]` to `{ name: string; quote: string; role?: string }[]`. Update the render to use `.quote` instead of `.text`.
- `service.tsx`: add `testimonials?: { name: string; quote: string; role?: string }[]` to `LandingPageVariables`. Remove the three `(variables as any)` lines that read `testimonialName`, `testimonialQuote`, `testimonialRole`. Instead destructure from `variables.testimonials?.[0]` to get the first testimonial (keeping the single-testimonial render for now — the modal will handle multi later).
- `lead-magnet.tsx`: add `testimonials?: { name: string; quote: string; role?: string }[]` to `LandingPageVariables` for parity (not rendered yet, just typed).

## Files
- `components/landing-pages/templates/saas.tsx` (modify)
- `components/landing-pages/templates/service.tsx` (modify)
- `components/landing-pages/templates/lead-magnet.tsx` (modify)

## Requirements
1. `LandingPageSections` in `saas.tsx` must use `testimonial: boolean` (singular)
2. `variables.testimonials` in `saas.tsx` must be typed `{ name: string; quote: string; role?: string }[]`
3. SaaS testimonials render must use `t.quote` (not `t.text`)
4. `service.tsx` `LandingPageVariables` must declare `testimonials?: { name: string; quote: string; role?: string }[]`
5. `service.tsx` must NOT use `(variables as any)` — read from `variables.testimonials?.[0]`
6. `lead-magnet.tsx` interface must include the same `testimonials` field for parity
7. No new visual sections added in this task — just type/data fixes

## Existing Code to Reference
- `components/landing-pages/templates/saas.tsx` (current broken state)
- `components/landing-pages/templates/service.tsx` (current broken state)

## Acceptance Criteria
- [ ] `saas.tsx` interface uses `testimonial` (singular) in `LandingPageSections`
- [ ] `saas.tsx` renders using `t.quote` not `t.text`
- [ ] `service.tsx` has no `as any` casts
- [ ] `service.tsx` reads first testimonial from `variables.testimonials?.[0]`
- [ ] TypeScript compiles without errors on these files

## Dependencies
None — first task

## Commit Message
fix: unify testimonials type and section key across all landing page templates
