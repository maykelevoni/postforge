# Task 005: Auth Pages (Sign In + Register)

## Type
ui

## Description
Build the sign-in and register pages. Neutral theme (not dark), clean and simple.

## Files
- `app/(auth)/sign-in/page.tsx` (create)
- `app/(auth)/register/page.tsx` (create)
- `app/(auth)/layout.tsx` (create)

## Requirements
1. Inline styles only — no Tailwind classes in JSX
2. Centered card layout, white/light background
3. Sign-in: email + password fields, submit button, link to register, Google OAuth button (only shown if Google env vars present)
4. Register: name + email + password fields, submit → POST `/api/auth/register` → redirect to sign-in
5. Auth.js `signIn()` for credentials and Google
6. Show error messages inline (wrong password, email taken)
7. Responsive — works on mobile

## Acceptance Criteria
- [ ] Sign-in form submits and creates session
- [ ] Register form creates user and redirects
- [ ] Errors displayed correctly
- [ ] Google button shown only when configured

## Dependencies
- Task 003

## Commit Message
feat: add sign-in and register pages
