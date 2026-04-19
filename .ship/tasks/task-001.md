# Task 001: Add Tailwind CSS to project

## Description
Install and configure Tailwind CSS so landing page components can use it. Must be scoped so it doesn't break the existing inline-styles dashboard convention.

## Files
- `tailwind.config.ts` (create)
- `postcss.config.js` (create)
- `app/(landing)/l/[slug]/globals.css` (create)
- `app/(landing)/l/[slug]/layout.tsx` (create)
- `package.json` (modify — add dependencies)

## Requirements
1. Install `tailwindcss postcss autoprefixer` as dev dependencies
2. Create `tailwind.config.ts` with content glob that only includes landing page components: `components/landing-pages/**/*.{ts,tsx}` and `app/(landing)/**/*.{ts,tsx}`
3. Create `postcss.config.js` with tailwindcss and autoprefixer plugins
4. Create `app/(landing)/l/[slug]/globals.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
5. Create layout at `app/(landing)/l/[slug]/layout.tsx` that imports the globals.css and wraps children
6. Verify existing dashboard pages are NOT affected by Tailwind styles

## Existing Code to Reference
- `app/(dashboard)/layout.tsx` (pattern for route group layout)

## Acceptance Criteria
- [ ] Tailwind installed and configured
- [ ] `app/(landing)/l/[slug]/layout.tsx` renders with Tailwind CSS
- [ ] Dashboard pages unchanged (no Tailwind styles leaking in)

## Dependencies
- None

## Commit Message
feat: add tailwind css for landing pages only
