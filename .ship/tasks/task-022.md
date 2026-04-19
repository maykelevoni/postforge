# Task 022: Redesign Service + Lead Magnet templates

## Type
ui

## Files
- `components/landing-pages/templates/service.tsx` (modify — full rewrite)
- `components/landing-pages/templates/lead-magnet.tsx` (modify — full rewrite)

## Requirements

### Service Template — OptimizePress conversion style (LIGHT theme)

**Body:** white bg, dark text, `font-sans antialiased`

**Sticky Nav:**
- White bg, `shadow-sm sticky top-0 z-50`
- Brand name left (serviceName) dark semibold
- Right: orange CTA button → `bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full text-sm transition` linking #cta

**Hero:**
- White bg centered, `py-20 px-6 max-w-4xl mx-auto text-center`
- Badge above title: `text-orange-600 font-semibold text-sm uppercase tracking-widest mb-4`
- H1: `text-5xl font-extrabold text-gray-900 leading-tight` — first word or phrase gets `.gradient-text` with orange-to-red gradient
- Subtitle: `text-xl text-gray-500 mt-4 mb-8 max-w-2xl mx-auto`
- Primary CTA: `bg-orange-500 hover:bg-orange-600 hover:scale-105 transform transition text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-orange-300/50 text-lg` linking #cta
- Secondary: `text-gray-500 underline text-sm mt-4 cursor-pointer` linking #features

**Social Proof Bar:**
- `bg-gray-50 border-y border-gray-200 py-4 px-6 text-center`
- Flex row centered with gap: "✓ 500+ clients served" | "★★★★★ 4.9/5 rating" | "🔒 100% Satisfaction guarantee"
- `text-sm text-gray-600 font-medium`

**Benefits Section (id="features"):**
- `py-20 px-6 max-w-4xl mx-auto`
- H2: "Why choose us" centered `text-3xl font-bold text-gray-900`
- 2-col grid of benefits from `variables.features` (or `variables.serviceList`)
- Each benefit: flex row, green checkmark circle icon left + text right
  - Checkmark circle: `w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0` with SVG check in green-600
  - Text: `text-gray-700 text-sm font-medium`

**Testimonials (if testimonialName provided):**
- `bg-gray-50 py-16 px-6`
- Single testimonial card centered max-w-2xl: white card shadow, 5 stars, italic quote, avatar + name + role
- Card: `bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto`

**CTA Section (id="cta"):**
- Gradient: `background: linear-gradient(135deg, #f97316, #ef4444)` (orange-to-red)
- `py-20 px-6 text-center`
- H2: `text-4xl font-extrabold text-white mb-3`
- Subtitle: `text-white/80 mb-8`
- White card inside: `bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl`
- `<LeadForm landingPageId={landingPageId} variant="light" />`

**Footer:**
- `bg-gray-900 text-gray-400 text-sm text-center py-8`

---

### Lead Magnet Template — Minimal dark focused

**Body:** `bg-[#0d0d14]` dark, white text

**Sticky Nav:**
- Same dark nav as SaaS but simpler: just brand name, no right button

**Hero:**
- Dark bg, centered, `py-24 px-6 relative overflow-hidden`
- Background glow: rose/pink blob (`bg-rose-600/20 blur-3xl`)
- Badge: `inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-sm text-rose-300 mb-6 uppercase tracking-widest font-semibold`
  - Badge text: "Free Download" or "Free Guide" 
- H1: large, static gradient rose-to-purple: `text-5xl font-extrabold leading-tight` with gradient text style
- Subtitle: `text-gray-400 text-xl mt-4 mb-8 max-w-xl mx-auto`
- Scroll-to-form arrow: `text-gray-500 text-sm flex items-center justify-center gap-2 mt-4 cursor-pointer` pointing to #cta
  - SVG down arrow

**Benefits Section:**
- `py-16 px-6 max-w-2xl mx-auto`
- H2: "What you'll get" `text-2xl font-bold text-white text-center mb-10`
- Vertical list of benefits from `variables.features`
- Each: flex row, rose checkmark circle + text
  - `w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center` with SVG check rose-400
  - Text: `text-gray-300 text-sm`
- Items stacked with `gap-4`

**CTA/Form Section (id="cta"):**
- `py-16 px-6`
- Centered white card on dark bg: `bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl`
- Heading inside card: "Get instant access" `text-gray-900 text-2xl font-bold mb-2`
- Subheading: `text-gray-500 text-sm mb-6`
- `<LeadForm landingPageId={landingPageId} variant="light" />`

**Footer:**
- `bg-gray-950 text-gray-600 text-sm text-center py-6`

## IMPORTANT
- Both are server components (no "use client")
- Preserve TypeScript prop interfaces from original files
- Use `<style>` tag for gradient animation if needed (same pattern as task-021)

## Existing Code to Reference
- `components/landing-pages/templates/service.tsx` — prop interfaces
- `components/landing-pages/templates/lead-magnet.tsx` — prop interfaces
- `components/landing-pages/templates/saas.tsx` (after task-021) — patterns to replicate

## Acceptance Criteria
- [ ] Service template: white bg, orange CTA, social proof bar, benefit bullets, testimonial card
- [ ] Lead magnet template: dark bg, rose gradient, benefit list, centered form card
- [ ] Both compile without errors

## Dependencies
- Task 021

## Commit Message
feat: redesign Service and Lead Magnet landing page templates
