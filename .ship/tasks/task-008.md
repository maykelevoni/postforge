# Task 008: Frontend — Add Polar fields to api-keys-section.tsx

## Type
ui

## Description
Add two password inputs to the existing API keys settings section: `polar_api_key` and `polar_webhook_secret`. These plug into the existing save pattern.

## Files
- `components/dashboard/settings/api-keys-section.tsx` (modify)

## Requirements
1. Read the file first to understand the existing field pattern
2. Add two new entries following the exact same pattern as existing keys:
   - **Polar API Key** — `key: "polar_api_key"`, label: "Polar API Key", type: `password`, placeholder: "pk_..."
   - **Polar Webhook Secret** — `key: "polar_webhook_secret"`, label: "Polar Webhook Secret", type: `password`, placeholder: "whsec_..."
3. Group them under a "Payment" section heading (add a small divider/heading using inline styles — consistent with any existing section separators)
4. Do NOT modify the save button logic — it already handles arbitrary keys via `onSave(key, value)`
5. Inline styles only (no Tailwind classes)

## Existing Code to Reference
- `components/dashboard/settings/api-keys-section.tsx` — read first; follow exact existing field pattern
- `components/dashboard/settings/schedule-section.tsx` — reference for section heading style

## Acceptance Criteria
- [ ] Two new password inputs render in the Settings page
- [ ] Keys `polar_api_key` and `polar_webhook_secret` are saved/loaded via existing mechanism
- [ ] Inputs are type="password"
- [ ] Visually grouped under "Payment" heading
- [ ] Inline styles only

## Dependencies
None

## Commit Message
feat(ui): add Polar API Key and Webhook Secret to settings
