# Task 009: Create SaaS landing page template

## Description
Create the first of 3 landing page templates, adapted from the Cruip template. Includes hero, features, testimonial, and CTA sections with section toggles.

## Files
- `components/landing-pages/templates/saas.tsx` (create)

## Requirements
1. Adapt from Cruip's hero-home + features-planet + large-testimonial + CTA components
2. Props: `{ variables: LandingPageVariables; sections: LandingPageSections; landingPageId: string }`
3. Sections (all individually toggleable via `sections` prop):
   - **Hero:** Headline, subtitle, 2 CTA buttons (one scrolls to form, one is external link)
   - **Features Planet:** 6 feature cards with icons (from variables.features array)
   - **Testimonial:** Single large testimonial (from variables.testimonial)
   - **CTA:** Final call-to-action with lead capture form
4. Use the `LeadForm` component from Task 008 for the CTA section
5. Dark theme with Tailwind CSS
6. Responsive on all screen sizes
7. No external image dependencies — use placeholder/CSS-only decorations
8. Variables interface defined in the file

## Existing Code to Reference
- Cruip template components (read from the cruip repo, adapt the patterns)
- `components/landing-pages/lead-form.tsx` (form to embed)

## Acceptance Criteria
- [ ] Renders correctly with default variables
- [ ] Each section can be toggled on/off via sections prop
- [ ] Lead form works and submits correctly
- [ ] Responsive on mobile
- [ ] Dark theme throughout
- [ ] No TypeScript errors

## Dependencies
- Task 001, Task 008

## Commit Message
feat: create SaaS landing page template
