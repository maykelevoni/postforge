# Task 007: Bug fix — Landing page POST double-encoding guard

## Description
Fix Bug 2: `app/api/landing-pages/route.ts` POST handler calls `JSON.stringify(sections)` even when sections is already a string. Guard against double-encoding.

## Files
- `app/api/landing-pages/route.ts` (modify)

## Requirements
1. Add a `normalizeJson` helper inside the POST handler (or at file scope):
   ```ts
   const normalizeJson = (value: unknown): string => {
     if (typeof value === 'string') return value;
     return value ? JSON.stringify(value) : '{}';
   };
   ```
2. Replace all `JSON.stringify(sections)` calls with `normalizeJson(sections)`
3. Replace all `JSON.stringify(variables)` calls with `normalizeJson(variables)`
4. Read the file first to see the exact lines to change

## Existing Code to Reference
- `app/api/landing-pages/route.ts` — read this file first

## Acceptance Criteria
- [ ] `sections` passed as object → stored as once-stringified JSON
- [ ] `sections` passed as string → stored as-is (no double stringify)
- [ ] Same guard applied to `variables`
- [ ] No other changes to the route

## Dependencies
None

## Commit Message
fix(api): guard landing-pages POST against double-encoding sections
