# Task 007: Settings API + Page

## Description
Settings API routes and the Settings page — the first thing a user configures after sign-up.

## Files
- `app/api/settings/route.ts` (create)
- `app/(dashboard)/settings/page.tsx` (create)
- `components/dashboard/settings/api-keys-section.tsx` (create)
- `components/dashboard/settings/schedule-section.tsx` (create)

## Type
ui

## Requirements

### API routes
- `GET /api/settings` — returns all settings for session user as `{ [key]: value }`
- `POST /api/settings` — accepts `{ settings: { key: string, value: string }[] }`, bulk upserts via `setSetting`
- Auth required on both routes

### Settings page (dark theme, inline styles)
Three sections:

**API Keys**
- OpenRouter API Key (password input) + Model (text input, default `deepseek/deepseek-r1`)
- fal.ai API Key (password input)
- post-bridge API Key (password input)
- ClickBank API Key (password input) + Account Nickname (text input)
- Systeme.io Domain + Default Funnel URL + API Key
- YouTube API Key
- NewsAPI Key
- Research Subreddits (comma-separated text input)

**Schedule** (per platform)
- 6 rows: Twitter, LinkedIn, Reddit, Instagram, TikTok, Email
- Each row: time picker (HH:MM) + days of week checkboxes (Mon-Sun) + active toggle

**General**
- Timezone (select, common timezones list)
- Gate Mode (toggle — when ON, all content holds for approval)
- Daily Run Hour (0-23 number input)

- [Save] button → POST `/api/settings`
- Show success/error toast on save
- Password fields masked, show/hide toggle

## Acceptance Criteria
- [ ] GET returns current settings
- [ ] POST saves all settings
- [ ] All 3 sections render and save correctly
- [ ] Gate mode toggle works
- [ ] Schedule rows save time + days per platform

## Dependencies
- Task 006
- Task 004

## Commit Message
feat: add settings API and settings page
