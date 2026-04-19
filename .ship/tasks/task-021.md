# Task 021: Redesign SaaS landing page template (Cruip dark style)

## Type
ui

## Files
- `components/landing-pages/templates/saas.tsx` (modify — full rewrite)

## Requirements
Design: Cruip-inspired dark SaaS template.

### Body
- `bg-[#0a0a0f]` near-black background, `text-white font-sans antialiased`

### Sticky Nav
- `sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md`
- Brand name left (serviceName), semibold white
- Right: "Get Started" CTA button → `bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-full transition` linking to #cta

### Hero Section
- Centered layout, `py-24 px-6 relative overflow-hidden`
- Background glow blob: `absolute inset-0 -z-10` with two divs using `rounded-full blur-3xl opacity-20 bg-indigo-600` and `bg-purple-600`
- Badge: `inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6`
- H1: animated gradient text using inline style `background: linear-gradient(to right, #e2e8f0, #a5b4fc, #f8fafc, #c4b5fd, #e2e8f0)` `backgroundSize: 200% auto` with CSS animation class `animate-gradient` — or use static gradient if animation too complex. Apply `WebkitBackgroundClip: "text"` `WebkitTextFillColor: "transparent"`. Font: `text-5xl md:text-6xl font-extrabold leading-tight`
- Add a `<style>` tag inside the component for the keyframe: `@keyframes gradient { 0%{background-position:0%} 100%{background-position:200%} }` and class `.gradient-text { animation: gradient 6s linear infinite; }`
- Subtitle: `text-xl text-gray-400 mt-4 mb-10 max-w-2xl mx-auto`
- Two CTA buttons in flex row:
  - Primary: `bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition`
  - Secondary: `border border-gray-700 bg-gray-800/50 text-gray-200 hover:bg-gray-700 font-semibold px-8 py-4 rounded-xl transition`
- Social proof line: `text-gray-500 text-sm mt-8` — "Trusted by 2,000+ creators worldwide"
- Five star icons (gold ★ characters): `text-amber-400 text-lg`

### Features Section (if sections.features && features.length > 0)
- `py-20 px-6 max-w-6xl mx-auto`
- Centered header: "Everything you need" h2 `text-3xl font-bold text-white`, subtitle `text-gray-400`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14`
- Each card: `rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:border-indigo-500/30 transition`
  - Icon circle: `w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4` with SVG check in indigo-400
  - Feature text: `text-gray-300 text-sm font-medium leading-relaxed`

### Testimonials Section
- `py-20 px-6 bg-gray-900/30`
- Header: "What people are saying" centered
- Grid 3-col (responsive)
- Each card: dark card `bg-gray-900 border border-gray-800 rounded-2xl p-6`
  - 5 gold stars at top: ★★★★★ in `text-amber-400`
  - Quote text: italic, `text-gray-300 text-sm leading-relaxed mb-5`
  - Author: initials avatar circle (indigo) + name bold + role muted

### CTA Section (id="cta")
- Gradient bg: `background: linear-gradient(135deg, #4f46e5, #7c3aed)`
- Centered card inside: `bg-white/10 backdrop-blur-sm rounded-3xl p-10 max-w-2xl mx-auto border border-white/20`
- Heading: `text-4xl font-extrabold text-white`
- Subheading: `text-white/70 mb-8`
- `<LeadForm landingPageId={landingPageId} variant="dark" />`

### Footer
- `bg-gray-950 text-gray-500 text-sm text-center py-8 border-t border-gray-800`
- "© 2026 {serviceName}. All rights reserved."

## IMPORTANT
- This is a server component (no "use client")
- Preserve the existing TypeScript prop interfaces exactly
- Import only LeadForm from @/components/landing-pages/lead-form

## Existing Code to Reference
- `components/landing-pages/templates/saas.tsx` — prop interfaces to keep
- `components/landing-pages/lead-form.tsx` — LeadForm import

## Acceptance Criteria
- [ ] Gradient animated headline
- [ ] Dark background with purple/indigo glow blobs
- [ ] Feature cards render
- [ ] Testimonials render with stars
- [ ] CTA section has gradient bg and LeadForm
- [ ] Compiles without errors

## Dependencies
- Task 018

## Commit Message
feat: redesign SaaS landing page template with Cruip dark aesthetic
