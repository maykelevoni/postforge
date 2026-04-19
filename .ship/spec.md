# Landing Page Enhancement: Conversion Sections + Production Hardening

## Feature Summary
Fix 3 known bugs in landing page templates, add two high-conversion sections (How It Works, FAQ), support multiple testimonials properly, remove a ghost UI toggle (logoGrid), harden the lead webhook against spam, improve Open Graph metadata, and make the CTA button text match what the user configured.

## Problem Statement
The landing pages are close to production-ready but have several blockers:

1. **Bug — SaaS testimonials never render.** `sections.testimonials` (plural) is checked in the template but the modal stores the key as `sections.testimonial` (singular). Result: the section is always `undefined` → `false`.
2. **Bug — SaaS testimonial data mismatch.** The modal saves flat fields (`testimonialName`, `testimonialQuote`, `testimonialRole`) but the SaaS template expects `variables.testimonials: { name, text }[]`. Even if Bug 1 were fixed, no data would render.
3. **Bug — Service template type bypass.** `service.tsx` casts `variables as any` to access testimonial fields because they aren't declared in the `LandingPageVariables` interface.
4. **Ghost toggle — `logoGrid`.** The modal shows a "Logo Grid" section toggle, but no template renders a logo grid. Users see a toggle that does nothing.
5. **Missing conversion section — How It Works.** Services require an explanation of the process. This is among the highest-conversion sections on a service landing page.
6. **Missing conversion section — FAQ.** Addresses visitor objections before they leave. Missing from all three templates.
7. **CTA button text is hardcoded.** `LeadForm` always shows "Get Started" regardless of what the user set as `ctaText` in the modal.
8. **No rate limiting on lead webhook.** `/api/webhooks/lead` accepts unlimited submissions. Susceptible to spam and list poisoning.
9. **Thin Open Graph metadata.** Only title and description are set. Missing `og:type` and `og:url` for social sharing.

## User Stories

### Story 1 — Testimonials work correctly across all templates
**As** a user who added testimonials in the modal,  
**I want** them to actually render on my published landing page,  
**So that** social proof is visible to visitors.

Acceptance criteria:
- [ ] SaaS template reads `sections.testimonial` (singular) to control the section visibility
- [ ] All three templates use a unified testimonials format: `{ name, quote, role? }[]`
- [ ] The modal replaces the three flat testimonial inputs with an add/remove list (same UX as features)
- [ ] Service template interface declares testimonial fields — no `as any`

### Story 2 — LogoGrid ghost toggle removed
**As** a user editing a landing page,  
**I want** every toggle in the editor to do something real,  
**So that** I'm not confused by phantom settings.

Acceptance criteria:
- [ ] The "Logo Grid" checkbox is removed from the modal sections grid
- [ ] No code references `sections.logoGrid` in any template

### Story 3 — How It Works section on all templates
**As** a visitor on a landing page,  
**I want** to understand how the service works in 3 clear steps,  
**So that** I can evaluate whether it fits my needs before filling the form.

Acceptance criteria:
- [ ] A "How it Works" section with up to 3 steps (number badge + title + description) renders in all three templates
- [ ] The modal editor has a steps section: up to 3 rows, each with a title field and description field
- [ ] A `howItWorks` section toggle controls visibility
- [ ] Default: section enabled (`true`), shown if at least 1 step has a non-empty title
- [ ] Visual style matches each template's theme (orange for Service, rose/purple for Lead Magnet, indigo for SaaS)

### Story 4 — FAQ section on all templates
**As** a visitor on a landing page,  
**I want** to expand common questions to see answers,  
**So that** objections are addressed before I decide to fill the form.

Acceptance criteria:
- [ ] An FAQ section with collapsible Q&A items (using `<details>`/`<summary>` — no JS required)
- [ ] The modal editor has a FAQ section: add/remove Q&A pairs (question + answer)
- [ ] A `faq` section toggle controls visibility
- [ ] Default: section disabled (`false`)
- [ ] Visual style matches each template's theme

### Story 5 — CTA button text matches user's configuration
**As** a user who set "Book a Free Call" as the CTA text,  
**I want** the form submit button to say "Book a Free Call",  
**So that** the whole page is consistent.

Acceptance criteria:
- [ ] `LeadForm` accepts an optional `ctaText` prop
- [ ] All three templates pass `variables.ctaText` to `LeadForm`
- [ ] Falls back to "Get Started" when `ctaText` is empty or undefined

### Story 6 — Lead webhook rate limiting
**As** a system protecting user subscriber lists,  
**I want** the lead webhook to reject excessive submissions from the same IP,  
**So that** lists cannot be spammed.

Acceptance criteria:
- [ ] More than 5 POST requests to `/api/webhooks/lead` from the same IP within 60 seconds returns HTTP 429
- [ ] The response body is `{ error: "Too many requests" }`
- [ ] Legitimate submissions (≤5/min) are not affected

### Story 7 — Open Graph metadata
**As** a user sharing their landing page URL on social media,  
**I want** rich preview cards to appear,  
**So that** the page looks credible when shared.

Acceptance criteria:
- [ ] `generateMetadata` sets `openGraph.type = "website"`
- [ ] `openGraph.title` and `openGraph.description` are populated from page variables
- [ ] `openGraph.url` is set to the canonical `/l/[slug]` URL

## Technical Requirements

- **No DB schema changes.** All new section data (steps, FAQs) lives inside the existing `variables` JSON field. New section toggles live inside the existing `sections` JSON field.
- **New variables shape additions** (applied to all three template `LandingPageVariables` interfaces):
  - `steps?: { title: string; description: string }[]` — up to 3 steps
  - `faqs?: { question: string; answer: string }[]`
  - `testimonials?: { name: string; quote: string; role?: string }[]` — replaces flat fields
- **New sections shape additions** (applied to all three template `LandingPageSections` interfaces and the modal `SectionToggles`):
  - `howItWorks: boolean`
  - `faq: boolean`
- **`testimonial` key** — use `testimonial` (singular) everywhere; remove `testimonials` (plural) from SaaS interface
- **FAQ accordion** — use `<details>`/`<summary>` HTML elements; no client-side JS needed; templates remain server components
- **Rate limiting** — in-memory `Map<ip, { count, resetAt }>` in the webhook route; no external dependency
- **LeadForm** — add `ctaText?: string` prop with a default of `"Get Started"`
- **No new npm packages**

## Files to Change
1. `components/landing-pages/templates/service.tsx` — fix types + add How It Works, FAQ, multi-testimonials
2. `components/landing-pages/templates/saas.tsx` — fix `sections.testimonial` key + add How It Works, FAQ
3. `components/landing-pages/templates/lead-magnet.tsx` — add How It Works, FAQ
4. `components/dashboard/services/landing-page-modal.tsx` — remove logoGrid, add steps/FAQ editors, swap testimonials to list
5. `components/landing-pages/lead-form.tsx` — add `ctaText` prop
6. `app/api/webhooks/lead/route.ts` — add rate limiting
7. `app/(landing)/l/[slug]/page.tsx` — improve OG metadata
8. `tests/landing-pages.spec.ts` — tests for new sections and rate limit

## Out of Scope
- Custom favicon per landing page
- Analytics/tracking pixels
- Custom domain per landing page
- Sitemap.xml / robots.txt
- A/B testing
- Image uploads for testimonial avatars

## Success Criteria
- All three template bugs are fixed; testimonials render correctly
- How It Works and FAQ sections visible on all three templates when data is provided
- LogoGrid toggle gone from modal
- LeadForm button text matches ctaText
- `/api/webhooks/lead` returns 429 after 5 requests per IP per minute
- OG metadata includes type and URL
