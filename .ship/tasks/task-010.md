# Task 010: Create Service and Lead Magnet landing page templates

## Description
Create the remaining 2 landing page templates: Service (for freelancers/agencies) and Lead Magnet (for downloadable lead magnets).

## Files
- `components/landing-pages/templates/service.tsx` (create)
- `components/landing-pages/templates/lead-magnet.tsx` (create)

## Requirements

### Service Template
- Adapted from Cruip's hero-home + business-categories + features + CTA
- Sections: Hero, Service Details (features), Trust/Logos grid, CTA with form
- Focus: showcasing a specific service offering
- Variables: title, subtitle, serviceList[], trustLogos[], ctaText
- Sections: hero, features, logoGrid, cta (all toggleable)
- Dark theme, Tailwind CSS, responsive

### Lead Magnet Template
- Simpler, conversion-focused template
- Sections: Hero (with lead form inline), Benefits (3-6 items), CTA
- Focus: getting visitors to submit immediately
- Variables: title, subtitle, benefits[], ctaText, urgencyText
- Sections: hero, benefits, cta (all toggleable)
- Dark theme, Tailwind CSS, responsive
- Lead form appears directly in hero section (above the fold)

## Existing Code to Reference
- `components/landing-pages/templates/saas.tsx` (from Task 009)
- `components/landing-pages/lead-form.tsx` (from Task 008)

## Acceptance Criteria
- [ ] Both templates render correctly
- [ ] Sections toggleable
- [ ] Lead forms submit correctly
- [ ] Responsive on mobile
- [ ] No TypeScript errors

## Dependencies
- Task 009

## Commit Message
feat: create service and lead magnet landing page templates
