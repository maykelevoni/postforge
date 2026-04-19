# Plan: Landing Page Enhancement — Conversion Sections + Production Hardening

## Architecture Integration

All changes are purely frontend + one API route. No DB schema changes.
- Template components: `components/landing-pages/templates/`
- Modal editor: `components/dashboard/services/landing-page-modal.tsx`
- Lead form: `components/landing-pages/lead-form.tsx`
- Lead webhook: `app/api/webhooks/lead/route.ts`
- Landing page renderer: `app/(landing)/l/[slug]/page.tsx`

Data flow: modal writes JSON → DB `variables`/`sections` fields → page route parses JSON → template renders.

## Section 1: Data Model (no DB change)

All new data slots into existing `variables` and `sections` JSON strings.

### Variables additions (all three templates)
```ts
steps?:        { title: string; description: string }[]  // max 3
faqs?:         { question: string; answer: string }[]
testimonials?: { name: string; quote: string; role?: string }[]
```

### Sections additions (all three templates)
```ts
howItWorks: boolean  // default true
faq:        boolean  // default false
testimonial: boolean // singular — fixing the plural key bug in SaaS
```

### Removed
- `logoGrid` from sections — ghost toggle, no template renders it
- Flat testimonial fields replaced by `testimonials[]`

## Section 2: Bug Fixes

### Bug 1+2 — Testimonials (SaaS + Service templates)
- `saas.tsx`: `LandingPageSections.testimonials` → `testimonial`; `variables.testimonials: { name, text }[]` → `{ name, quote, role? }[]`
- `service.tsx`: add `testimonials?: { name, quote, role? }[]`; remove `(variables as any)`; render array
- `lead-magnet.tsx`: add `testimonials?: { name, quote, role? }[]` for parity

### Bug 3 — LogoGrid ghost
- Remove `logoGrid` from `SectionToggles` in modal and its render loop

## Section 3: New Template Sections

### How It Works
- 3 numbered steps in horizontal grid (desktop) / vertical (mobile)
- Number badge + title + description per step
- Guard: `sections.howItWorks === true` AND at least 1 step with non-empty title
- Position: after benefits/features, before testimonials
- Theme per template: orange (Service), rose/purple (Lead Magnet), indigo (SaaS)

### FAQ
- `<details>`/`<summary>` accordion — zero JS, server component compatible
- Position: after testimonials, before CTA
- Guard: `sections.faq === true` AND `faqs.length > 0`

## Section 4: Modal Editor Changes

### Testimonials list
- Replace 3 flat inputs with a dynamic list (same pattern as features)
- Each row: Name + Quote inputs + optional Role input
- Add/remove buttons; up to 5 testimonials

### How It Works editor
- Fixed 3-row section (Step 1, 2, 3)
- Each row: Title (short) + Description (textarea/input)

### FAQ editor
- Dynamic add/remove list like features
- Each row: Question input + Answer input

### Section toggles fix
- Remove `logoGrid`
- Add `howItWorks` (default true), `faq` (default false)

## Section 5: LeadForm ctaText

Add `ctaText?: string` prop, default `"Get Started"`. All three templates pass `variables.ctaText`.

## Section 6: Rate Limiting

In-memory map at module scope in the webhook route:
```ts
const rateMap = new Map<string, { count: number; resetAt: number }>();
```
- Key: IP from `x-forwarded-for` (first segment) or `x-real-ip`, fallback `"unknown"`
- Window: 60 seconds, limit: 5 requests
- Exceed: return `{ error: "Too many requests" }` with status 429

## Section 7: OG Metadata

Extend `generateMetadata` in `app/(landing)/l/[slug]/page.tsx`:
```ts
openGraph: {
  type: "website",
  title,
  description,
  url: `/l/${params.slug}`,
}
```

## File Map

| File | Action |
|------|--------|
| `components/landing-pages/templates/service.tsx` | modify |
| `components/landing-pages/templates/saas.tsx` | modify |
| `components/landing-pages/templates/lead-magnet.tsx` | modify |
| `components/dashboard/services/landing-page-modal.tsx` | modify |
| `components/landing-pages/lead-form.tsx` | modify |
| `app/api/webhooks/lead/route.ts` | modify |
| `app/(landing)/l/[slug]/page.tsx` | modify |
| `tests/landing-pages.spec.ts` | modify |
