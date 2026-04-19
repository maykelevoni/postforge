# Task 008: Create lead capture form component

## Description
Build the shared lead capture form component used by all landing page templates. Submits to `/api/webhooks/lead`.

## Files
- `components/landing-pages/lead-form.tsx` (create)

## Requirements
1. `"use client"` component
2. Props: `{ landingPageId: string; onSuccess?: () => void; variant?: "light" | "dark" }`
3. Form fields: name (text input), email (email input), submit button
4. Uses `fetch` POST to `/api/webhooks/lead` with `{ name, email, landingPageId }`
5. Shows loading state during submission
6. Shows success state ("Thank you! We'll be in touch soon.") after submission
7. Shows error state if submission fails
8. Handles duplicate response (`{ duplicate: true }`) with friendly message ("You've already submitted!")
9. Styled with Tailwind CSS — clean, modern, responsive
10. Works on mobile

## Existing Code to Reference
- `app/api/webhooks/lead/route.ts` (endpoint the form calls)
- `components/landing-pages/` (directory for landing page components)

## Acceptance Criteria
- [ ] Form collects name + email
- [ ] Submits to correct webhook endpoint
- [ ] Shows loading/success/error states
- [ ] Handles duplicates gracefully
- [ ] Responsive on mobile
- [ ] Tailwind CSS styled

## Dependencies
- Task 005

## Commit Message
feat: create landing page lead capture form component
