# Task 017: Remove Discover from nav + ClickBank from Settings

## Description
Two quick cleanup fixes.

## Files
- `components/layout/nav-item.tsx` (modify)
- `components/dashboard/settings/api-keys-section.tsx` (modify)

## Requirements
1. In `nav-item.tsx`: delete `{ href: "/discover", icon: "sparkles", label: "Discover" }` from navItems
2. In `api-keys-section.tsx`: delete these two lines from the JSX:
   - `{renderInput("clickbank_api_key", "ClickBank API Key", true)}`
   - `{renderInput("clickbank_account", "ClickBank Account", false)}`

## Acceptance Criteria
- [ ] Discover no longer in sidebar
- [ ] No ClickBank fields in Settings

## Dependencies
None

## Commit Message
fix: remove Discover from nav and ClickBank from settings
