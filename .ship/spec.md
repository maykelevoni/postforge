# PostForge MVP — Spec

## Feature Summary
PostForge is a single-user autonomous content platform. It researches trending topics daily, auto-discovers app ideas and ClickBank affiliate products to promote, generates platform-specific social content with AI (text + images), auto-posts on schedule via post-bridge, writes nurture email newsletters sent via Systeme.io, and routes all traffic to funnels — building an email list and driving sales. The user's only job is to approve or dismiss suggestions.

## Problem Statement
Growing an audience and monetizing it requires daily trend research, product discovery, content creation, and consistent posting — all time-consuming when done manually. PostForge automates the entire loop: discover → create → post → capture → monetize. Manual input should be near zero.

---

## The Flywheel

```
Research (YouTube / Reddit / NewsAPI)
    ↓
AI analyzes trends → Discover inbox
    ├── App ideas   → full brief + landing page → validate with real traffic
    └── ClickBank products → complete profile → promote immediately
    ↓
User approves → becomes active Promotion
    ↓
OpenRouter AI generates daily outputs:
    ├── Social posts (Twitter/X, LinkedIn, Reddit) — text
    ├── Visual posts (Instagram, TikTok) — image via fal.ai + caption
    └── Nurture newsletter — hook + value + soft sell + CTA
    ↓
post-bridge fires social on schedule
Systeme.io broadcast API sends newsletter to list
    ↓
Audience grows on social → funnels capture emails → list grows
    ↓
Newsletter nurtures list → trust builds → sales happen
```

---

## User Stories

### 1. Research
**As a user**, I want PostForge to pull trending topics from YouTube, Reddit, and NewsAPI daily so I always have fresh signals without manual searching.

Acceptance criteria:
- [ ] Daily cron fetches YouTube, Reddit, NewsAPI
- [ ] Topics deduplicated and scored by engagement/relevance
- [ ] Topics visible in Research page: source, score, headline, summary
- [ ] User can mark topics as used or dismissed

### 2. Discover — App Ideas
**As a user**, I want the AI to analyze research trends and surface app/tool ideas I could build, with a full brief and a ready-to-publish landing page.

Acceptance criteria:
- [ ] AI identifies market gaps and recurring problems from research topics
- [ ] Each app idea includes a full brief:
  - Problem being solved
  - Target audience
  - Core features (MVP scope)
  - Monetization strategy (pricing model)
  - Competition overview
  - Why now (tied to the trend)
- [ ] AI generates a landing page for the idea (headline, subheadline, features list, CTA, email capture)
- [ ] Landing page publishable to Systeme.io funnel via API
- [ ] Idea can be approved → becomes active Promotion
- [ ] Idea can be dismissed

### 3. Discover — ClickBank Products
**As a user**, I want the AI to find relevant ClickBank affiliate products I can promote immediately, with everything I need in one place.

Acceptance criteria:
- [ ] AI searches ClickBank catalog based on research topics/niche
- [ ] Each product profile includes:
  - Product name + vendor
  - Affiliate link (with ClickBank account nickname)
  - Description
  - Commission rate + average payout
  - Gravity score
  - Product image / cover
  - Promotion rules (what you can/can't say, restrictions)
  - Suggested content angles
- [ ] Product can be approved → becomes active Promotion
- [ ] Product can be dismissed

### 4. Content Generation
**As a user**, I want AI to write platform-specific posts and a nurture newsletter for each active promotion automatically.

Acceptance criteria:
- [ ] Generates posts for: Twitter/X, LinkedIn, Reddit, Instagram, TikTok
- [ ] Each post respects platform character limits and tone
- [ ] Instagram + TikTok: fal.ai Flux Schnell generates image → fal.ai Kling animates it into a short video (5-10 sec)
- [ ] Same video posted to both Instagram Reels and TikTok
- [ ] Twitter/X, LinkedIn, Reddit: text only
- [ ] Generates one nurture email newsletter per active promotion per day:
  - Subject line
  - Hook paragraph (tied to trending topic)
  - Value section (teaches something useful)
  - Bridge (connects to the product naturally)
  - Single CTA with UTM-tracked link
- [ ] OpenRouter used for all text generation (model + API key in Settings)
- [ ] fal.ai API key stored in Settings
- [ ] All posts saved with status: `draft` | `scheduled` | `published` | `failed`
- [ ] Newsletter saved with status: `draft` | `scheduled` | `sent` | `failed`
- [ ] User can edit any draft before it goes out
- [ ] UTM params auto-appended to all links

### 5. Scheduling & Auto-posting + Email Sending
**As a user**, I want posts to fire automatically on my configured schedule via post-bridge, and newsletters to send via Systeme.io broadcast API.

Acceptance criteria:
- [ ] Per-platform posting time configurable (hour + days of week)
- [ ] Worker checks every 5 min for due posts and fires via post-bridge
- [ ] Newsletter send time configurable (daily hour in Settings)
- [ ] Newsletter broadcast sent via Systeme.io broadcast API
- [ ] Gate mode: when ON, both posts AND newsletters hold for manual approval
- [ ] Failed posts retry once after 30 minutes
- [ ] Failed newsletter send retries once after 30 minutes
- [ ] Today page shows live queue: platform, scheduled time, status (including email)

### 6. Promotions
**As a user**, I want to manage what's actively being promoted and how it rotates.

Acceptance criteria:
- [ ] Promotions sourced from Discover (approved app ideas or ClickBank products)
- [ ] Each promotion shows: name, type (app_idea | affiliate), funnel URL, UTM config, priority, status
- [ ] Multiple promotions rotate by priority weight
- [ ] User can pause, resume, or archive promotions
- [ ] Content pieces linked back to their source promotion

### 7. Today — Command Center
**As a user**, I want a single page showing exactly what's happening right now.

Acceptance criteria:
- [ ] Today's post queue by platform with status (published / scheduled / failed / pending approval)
- [ ] Active promotion in rotation
- [ ] Top research topics from today
- [ ] Discover inbox badge (new items count)
- [ ] [Run Now] button triggers manual engine run
- [ ] SSE-powered live updates (no page refresh)

### 8. Settings
**As a user**, I want to configure all integrations and behavior from one page.

Acceptance criteria:
- [ ] OpenRouter API key + model selection
- [ ] fal.ai API key
- [ ] post-bridge API key
- [ ] ClickBank API key + account nickname
- [ ] Systeme.io domain + default funnel URL + API key
- [ ] YouTube API key, NewsAPI key, research subreddits
- [ ] Posting timezone
- [ ] Gate mode toggle
- [ ] Per-platform schedule (time + days of week)
- [ ] All keys stored in DB Setting table (never in .env)

---

## Technical Requirements

### Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Inline styles + shadcn/ui primitives (no Tailwind in JSX) |
| Auth | Auth.js — credentials + Google OAuth |
| Database | PostgreSQL via Prisma ORM (Neon in prod) |
| AI — text | OpenRouter (user-supplied key + model) |
| AI — images | fal.ai Flux Schnell |
| Social posting | post-bridge API |
| Funnels | Systeme.io (UTM links + funnel publish API) |
| Background jobs | node-cron (worker process) |
| Real-time | Server-Sent Events (SSE) |
| Package manager | pnpm |
| Testing | Playwright E2E |

### Database Models (MVP)
| Model | Description |
|---|---|
| `User` | Auth user |
| `ResearchTopic` | Daily research hit with score + source |
| `DiscoverItem` | AI-surfaced opportunity: app_idea or affiliate |
| `AppIdea` | Full brief + generated landing page HTML |
| `AffiliateProduct` | ClickBank product profile with promo rules |
| `Promotion` | Active promotion linked to AppIdea or AffiliateProduct |
| `ContentPiece` | Generated post for a platform (text + optional image URL) |
| `Newsletter` | Generated nurture email (subject, body, CTA) tied to a promotion |
| `ScheduleEntry` | Per-platform posting time + days of week |
| `EngineRun` | Log of each engine execution |
| `Setting` | Key-value app config |

### Settings Keys
`openrouter_api_key`, `openrouter_model`, `falai_api_key`, `postbridge_api_key`, `clickbank_api_key`, `clickbank_account`, `systeme_domain`, `systeme_default_funnel_url`, `systeme_api_key`, `youtube_api_key`, `newsapi_key`, `research_subreddits`, `timezone`, `gate_mode`, `daily_run_hour`

### Worker Processes
| Cron | Schedule | What it does |
|---|---|---|
| Research | Daily | Fetches YouTube + Reddit + NewsAPI, scores + dedupes topics |
| Discover | Daily (after research) | AI generates app idea briefs + finds ClickBank products from topics |
| Content | Configurable daily hour | Generates posts + images for active promotions |
| Posting | Every 5 min | Fires due posts via post-bridge, retries failed |

---

## UI/UX Requirements

### Navigation (6 pages)
| Page | Route | Purpose |
|---|---|---|
| Today | `/` | Command center: live queue, top research, active promotion, run button |
| Research | `/research` | Trending topics: source, score, dismiss/use |
| Discover | `/discover` | Opportunities inbox: app ideas + ClickBank products, approve/dismiss |
| Content | `/content` | All posts: filter by platform/status, preview + edit + manual publish |
| Promote | `/promote` | Active promotions: manage, pause, rotate priority |
| Settings | `/settings` | API keys, schedule, gate mode, timezone |

### Design
- Dark theme, minimal chrome
- Inline styles (no Tailwind in JSX)
- shadcn/ui for dialogs, dropdowns, toasts
- Platform icons on all post cards
- SSE live updates on Today page

---

## Integration Points
| Service | Usage |
|---|---|
| OpenRouter | All text content generation |
| fal.ai (Flux Schnell) | Image generation for Instagram + TikTok |
| fal.ai (Kling image-to-video) | Animates image into short video (5-10 sec) for Instagram Reels + TikTok |
| post-bridge | Social publishing: Twitter/X, LinkedIn, Reddit, Instagram, TikTok |
| Systeme.io | Funnel URLs + UTM tracking + landing page publishing + email broadcasts |
| ClickBank API | Affiliate product search + full product profiles |
| YouTube Data API v3 | Research trending videos |
| Reddit JSON API | Research trending posts (no auth required) |
| NewsAPI | Research trending headlines |

---

## Out of Scope (MVP)
- Blog generation / Ghost publishing
- Brevo/SMTP direct sending (Systeme.io handles all email)
- Email sequences / drip campaigns (v2)
- Audio generation (ElevenLabs)
- Video generation
- Media Studio / asset library
- Autopilot rules engine
- Amazon / AppSumo / other affiliate networks
- Multiple users / teams

---

## Success Criteria
- [ ] Research runs daily and surfaces real trending topics
- [ ] Discover inbox auto-populates with app ideas and ClickBank products — no manual input needed
- [ ] App idea → full brief + landing page generated and publishable to Systeme.io
- [ ] ClickBank product → complete profile with promo rules and affiliate link
- [ ] Approved item → active promotion → AI-generated posts for all 5 platforms in < 60s
- [ ] Instagram + TikTok posts include AI-generated images (fal.ai)
- [ ] Posts fire via post-bridge on schedule without manual intervention
- [ ] Gate mode works: posts hold until approved
- [ ] All API keys configurable from Settings (never in .env)
- [ ] Newsletter generated daily per active promotion with hook + value + CTA
- [ ] Newsletter broadcasts via Systeme.io API to contact list
- [ ] Gate mode holds newsletters for approval before sending
- [ ] Playwright tests cover core flows
