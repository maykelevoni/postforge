# PostForge MVP — Technical Plan

## Section 1: Architecture

### Project Structure
Clean Next.js 14 App Router project. Worker runs as a separate process via `concurrently`. Patterns taken from launch/ reference but no code copied directly.

```
postforge/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # sidebar nav + auth guard
│   │   ├── page.tsx                # Today — command center
│   │   ├── research/page.tsx
│   │   ├── discover/page.tsx
│   │   ├── content/page.tsx
│   │   ├── promote/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── auth/register/route.ts
│       ├── sse/route.ts
│       ├── engine/run/route.ts
│       ├── research/route.ts
│       ├── research/[id]/route.ts
│       ├── discover/route.ts
│       ├── discover/[id]/approve/route.ts
│       ├── discover/[id]/dismiss/route.ts
│       ├── promote/route.ts
│       ├── promote/[id]/route.ts
│       ├── content/route.ts
│       ├── content/[id]/route.ts
│       ├── content/[id]/approve/route.ts
│       ├── content/[id]/publish/route.ts
│       └── settings/route.ts
├── worker/
│   ├── index.ts                    # cron registrations
│   ├── research/
│   │   ├── index.ts                # orchestrator
│   │   ├── youtube.ts
│   │   ├── reddit.ts
│   │   └── newsapi.ts
│   ├── discover/
│   │   ├── index.ts                # orchestrator
│   │   ├── app-ideas.ts            # AI generates full briefs + landing pages
│   │   └── clickbank.ts            # ClickBank product search + profiles
│   ├── content/
│   │   ├── index.ts                # orchestrator
│   │   ├── generate.ts             # OpenRouter → social posts + newsletter
│   │   └── media.ts                # fal.ai image + video generation
│   └── posting/
│       ├── scheduler.ts            # fires due ContentPiece + Newsletter records
│       ├── post-bridge.ts          # post-bridge API client
│       └── systeme.ts              # Systeme.io broadcast + funnel API client
├── lib/
│   ├── db.ts                       # Prisma singleton
│   ├── ai.ts                       # OpenRouter text generation
│   ├── falai.ts                    # fal.ai image + video generation
│   ├── settings.ts                 # getSetting / setSetting / getSettings
│   ├── utm.ts                      # UTM URL builder
│   └── seeds.ts                    # default schedule entries
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── nav-item.tsx
│   └── dashboard/
│       ├── today/
│       │   ├── queue-card.tsx
│       │   ├── promotion-card.tsx
│       │   └── research-feed.tsx
│       ├── research/
│       │   └── topic-card.tsx
│       ├── discover/
│       │   ├── app-idea-card.tsx
│       │   └── affiliate-card.tsx
│       ├── content/
│       │   ├── content-piece-card.tsx
│       │   └── newsletter-card.tsx
│       ├── promote/
│       │   └── promotion-card.tsx
│       └── settings/
│           ├── api-keys-section.tsx
│           └── schedule-section.tsx
├── prisma/
│   └── schema.prisma
├── tests/                          # Playwright E2E (always here, never root)
├── auth.ts
├── auth.config.ts
├── middleware.ts
├── env.mjs                         # zod env validation
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Section 2: Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- Auth.js required models ---

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
  @@index([userId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
  @@map("verification_tokens")
}

// --- App models ---

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts        Account[]
  sessions        Session[]
  researchTopics  ResearchTopic[]
  discoverItems   DiscoverItem[]
  promotions      Promotion[]
  contentPieces   ContentPiece[]
  newsletters     Newsletter[]
  scheduleEntries ScheduleEntry[]
  engineRuns      EngineRun[]
  settings        Setting[]

  @@map("users")
}

model ResearchTopic {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      DateTime
  source    String   // "youtube" | "reddit" | "newsapi"
  title     String
  url       String?
  summary   String?
  score     Int      @default(5)
  status    String   @default("new") // "new" | "used" | "dismissed"
  createdAt DateTime @default(now())

  discoverItems DiscoverItem[]

  @@index([userId])
  @@map("research_topics")
}

model DiscoverItem {
  id       String   @id @default(cuid())
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type     String   // "app_idea" | "affiliate"
  status   String   @default("pending") // "pending" | "approved" | "dismissed"
  topicId  String?
  topic    ResearchTopic? @relation(fields: [topicId], references: [id])
  createdAt DateTime @default(now())

  appIdea   AppIdea?
  affiliate AffiliateProduct?
  promotion Promotion?

  @@index([userId])
  @@map("discover_items")
}

model AppIdea {
  id               String       @id @default(cuid())
  discoverItemId   String       @unique
  discoverItem     DiscoverItem @relation(fields: [discoverItemId], references: [id], onDelete: Cascade)
  title            String
  problem          String       @db.Text
  targetAudience   String
  coreFeatures     String       @db.Text  // JSON array
  monetization     String
  competition      String       @db.Text
  whyNow           String       @db.Text
  landingPageHtml  String       @db.Text
  systemeFunnelUrl String?
  createdAt        DateTime     @default(now())

  @@map("app_ideas")
}

model AffiliateProduct {
  id             String       @id @default(cuid())
  discoverItemId String       @unique
  discoverItem   DiscoverItem @relation(fields: [discoverItemId], references: [id], onDelete: Cascade)
  name           String
  vendor         String
  affiliateLink  String
  description    String       @db.Text
  commissionRate Float
  avgPayout      Float?
  gravityScore   Float?
  imageUrl       String?
  promoRules     String       @db.Text  // full text rules
  contentAngles  String       @db.Text  // JSON array of suggested angles
  createdAt      DateTime     @default(now())

  @@map("affiliate_products")
}

model Promotion {
  id             String        @id @default(cuid())
  userId         String
  user           User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  discoverItemId String?       @unique
  discoverItem   DiscoverItem? @relation(fields: [discoverItemId], references: [id])
  name           String
  type           String        // "app_idea" | "affiliate"
  description    String        @db.Text
  url            String        // landing page or affiliate link
  funnelUrl      String?       // Systeme.io funnel URL
  priority       Int           @default(5) // 1-10 rotation weight
  status         String        @default("active") // "active" | "paused" | "archived"
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  contentPieces ContentPiece[]
  newsletters   Newsletter[]

  @@index([userId])
  @@map("promotions")
}

model ContentPiece {
  id           String     @id @default(cuid())
  userId       String
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  promotionId  String?
  promotion    Promotion? @relation(fields: [promotionId], references: [id])
  date         DateTime
  platform     String     // "twitter" | "linkedin" | "reddit" | "instagram" | "tiktok"
  content      String     @db.Text
  imageUrl     String?    // fal.ai Flux image URL
  videoUrl     String?    // fal.ai Kling video URL (instagram + tiktok)
  status       String     @default("draft") // "draft" | "scheduled" | "published" | "failed"
  approved     Boolean    @default(false)
  postBridgeId String?
  postedAt     DateTime?
  scheduledAt  DateTime?
  error        String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  @@index([userId])
  @@map("content_pieces")
}

model Newsletter {
  id          String     @id @default(cuid())
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  promotionId String?
  promotion   Promotion? @relation(fields: [promotionId], references: [id])
  date        DateTime
  subject     String
  body        String     @db.Text
  status      String     @default("draft") // "draft" | "scheduled" | "sent" | "failed"
  approved    Boolean    @default(false)
  sentAt      DateTime?
  scheduledAt DateTime?
  error       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([userId])
  @@map("newsletters")
}

model ScheduleEntry {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform   String   // "twitter" | "linkedin" | "reddit" | "instagram" | "tiktok" | "email"
  time       String   // "HH:MM" 24h
  daysOfWeek String   @default("[1,2,3,4,5]") // JSON int[] 0=Sun..6=Sat
  active     Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@map("schedule_entries")
}

model EngineRun {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      DateTime
  type      String   // "research" | "discover" | "content" | "posting" | "full"
  status    String   // "running" | "completed" | "failed"
  log       String   @db.Text
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("engine_runs")
}

model Setting {
  id        String   @id @default(cuid())
  userId    String
  key       String
  value     String
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, key])
  @@index([userId])
  @@map("settings")
}
```

---

## Section 3: API Design

All routes require authentication via Auth.js session. `userId` always comes from the session, never from the request body.

### SSE
| Method | Path | Description |
|---|---|---|
| GET | `/api/sse` | SSE stream — emits `engine_update`, `post_published`, `discover_new` events |

### Engine
| Method | Path | Description |
|---|---|---|
| POST | `/api/engine/run` | Trigger full pipeline manually. Returns `{ runId }` |

### Research
| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/research` | `?source=&status=&page=` | List topics paginated |
| PATCH | `/api/research/[id]` | `{ status: "used" \| "dismissed" }` | Update topic status |

### Discover
| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/discover` | `?type=&status=&page=` | List discover items with nested appIdea or affiliate |
| POST | `/api/discover/[id]/approve` | — | Approve → creates Promotion, marks topic as used |
| POST | `/api/discover/[id]/dismiss` | — | Dismiss item |

### Promote
| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/promote` | `?status=` | List promotions |
| PATCH | `/api/promote/[id]` | `{ status?, priority?, funnelUrl? }` | Update promotion |
| DELETE | `/api/promote/[id]` | — | Archive promotion |

### Content
| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/content` | `?platform=&status=&type=posts\|newsletters&page=` | List content pieces + newsletters |
| PATCH | `/api/content/[id]` | `{ content?, subject?, body? }` | Edit draft |
| POST | `/api/content/[id]/approve` | — | Approve for posting (gate mode) |
| POST | `/api/content/[id]/publish` | — | Manual publish now via post-bridge or Systeme.io |

### Settings
| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/settings` | — | Get all settings as `{ key: value }` map |
| POST | `/api/settings` | `{ settings: { key: value }[] }` | Bulk upsert settings |

---

## Section 4: Frontend Pages & Components

### State Management
- Server components fetch data directly via Prisma where possible
- Client components use `fetch` + `useState` for interactions
- SSE connection on Today page via `useEffect` + `EventSource`
- No external state library (Redux, Zustand) — keep it simple

### Pages

#### `/` — Today
- SSE connection for live updates
- `QueueCard` — today's posts by platform with status badges
- `PromotionCard` — active promotion name + funnel URL
- `ResearchFeed` — top 3 research topics from today
- `DiscoverBadge` — pending discover items count
- `[Run Now]` button → POST `/api/engine/run`

#### `/research`
- `TopicCard` list — title, source icon, score, summary, date
- Filter bar: source (YouTube/Reddit/News), status (new/used/dismissed)
- Actions: mark used, dismiss

#### `/discover`
- Two tabs: **App Ideas** | **Affiliate Products**
- `AppIdeaCard` — title, problem, audience, why now, [View Brief] → modal with full brief + landing page preview, [Approve] [Dismiss]
- `AffiliateCard` — product image, name, vendor, commission %, gravity, [View Details] → modal with promo rules + angles, [Approve] [Dismiss]

#### `/content`
- Two tabs: **Posts** | **Newsletters**
- `ContentPieceCard` — platform icon, content preview, status badge, scheduled time, [Edit] [Approve] [Publish Now]
- `NewsletterCard` — subject, body preview, status, [Edit] [Approve] [Send Now]
- Filter by platform, status

#### `/promote`
- `PromotionCard` list — name, type badge, priority, status, funnel URL, [Pause] [Resume] [Archive]
- Priority drag-to-reorder (or number input)

#### `/settings`
- **API Keys** section — OpenRouter key + model, fal.ai key, post-bridge key, ClickBank key + account, Systeme.io domain + funnel URL + API key, YouTube key, NewsAPI key, subreddits
- **Schedule** section — per-platform time + days of week
- **General** section — timezone, gate mode toggle, daily run hour

---

## Section 5: Service Integrations

### OpenRouter (`lib/ai.ts`)
```
POST https://openrouter.ai/api/v1/chat/completions
Auth: Bearer {openrouter_api_key}
Model: {openrouter_model} (user-configured, default: "deepseek/deepseek-r1")
```
Used for: social post generation, newsletter generation, app idea briefs, landing page HTML, ClickBank product analysis

### fal.ai (`lib/falai.ts`)
```
Image: fal-ai/flux/schnell
  Input: { prompt: string }
  Output: { images: [{ url: string }] }

Video: fal-ai/kling-video/v1/standard/image-to-video
  Input: { image_url: string, prompt: string, duration: "5" }
  Output: { video: { url: string } }
```
Auth: `FAL_KEY` env var or `falai_api_key` setting
Used for: Instagram + TikTok — image first, then animate to video

### post-bridge (`worker/posting/post-bridge.ts`)
Same pattern as launch/ reference. Key endpoints:
- `GET /v1/social-accounts` — get connected accounts
- `POST /v1/media` — upload video file
- `POST /v1/posts` — create post with media + schedule

### Systeme.io (`worker/posting/systeme.ts`)
```
Broadcast API:
  POST https://api.systeme.io/api/email_campaigns
  Header: X-API-Key: {systeme_api_key}

Funnel publish (AppIdea landing pages):
  POST https://api.systeme.io/api/funnels
```

### ClickBank (`worker/discover/clickbank.ts`)
```
Marketplace API:
  GET https://api.clickbank.com/rest/1.3/products/list
  Auth: API key in header
  Params: site (account), keywords, category
```

### Research APIs
- YouTube Data API v3: `GET https://www.googleapis.com/youtube/v3/search`
- Reddit JSON: `GET https://www.reddit.com/r/{sub}/hot.json`
- NewsAPI: `GET https://newsapi.org/v2/top-headlines`

---

## Section 6: Worker Cron Schedule

```
06:00 UTC  Research    → fetch YouTube + Reddit + NewsAPI → ResearchTopic records
07:00 UTC  Discover    → AI analyzes topics → AppIdea briefs + ClickBank products → DiscoverItem records
{daily_run_hour} UTC  Content → active promotions → social posts + newsletter + image + video
*/5 min    Posting     → fire due ContentPiece records via post-bridge
*/5 min    Email       → fire due Newsletter records via Systeme.io broadcast API
```

---

## Section 7: File Map (all files to create)

### Config / Root
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `postcss.config.js`
- `env.mjs`
- `middleware.ts`
- `auth.ts`
- `auth.config.ts`
- `.env.example`
- `components.json` (shadcn)

### Prisma
- `prisma/schema.prisma`

### Lib
- `lib/db.ts`
- `lib/ai.ts`
- `lib/falai.ts`
- `lib/settings.ts`
- `lib/utm.ts`
- `lib/seeds.ts`

### App — Auth
- `app/(auth)/sign-in/page.tsx`
- `app/(auth)/register/page.tsx`

### App — Dashboard
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`
- `app/(dashboard)/research/page.tsx`
- `app/(dashboard)/discover/page.tsx`
- `app/(dashboard)/content/page.tsx`
- `app/(dashboard)/promote/page.tsx`
- `app/(dashboard)/settings/page.tsx`

### App — API Routes
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/sse/route.ts`
- `app/api/engine/run/route.ts`
- `app/api/research/route.ts`
- `app/api/research/[id]/route.ts`
- `app/api/discover/route.ts`
- `app/api/discover/[id]/approve/route.ts`
- `app/api/discover/[id]/dismiss/route.ts`
- `app/api/promote/route.ts`
- `app/api/promote/[id]/route.ts`
- `app/api/content/route.ts`
- `app/api/content/[id]/route.ts`
- `app/api/content/[id]/approve/route.ts`
- `app/api/content/[id]/publish/route.ts`
- `app/api/settings/route.ts`

### Components
- `components/layout/sidebar.tsx`
- `components/layout/nav-item.tsx`
- `components/dashboard/today/queue-card.tsx`
- `components/dashboard/today/promotion-card.tsx`
- `components/dashboard/today/research-feed.tsx`
- `components/dashboard/research/topic-card.tsx`
- `components/dashboard/discover/app-idea-card.tsx`
- `components/dashboard/discover/affiliate-card.tsx`
- `components/dashboard/content/content-piece-card.tsx`
- `components/dashboard/content/newsletter-card.tsx`
- `components/dashboard/promote/promotion-card.tsx`
- `components/dashboard/settings/api-keys-section.tsx`
- `components/dashboard/settings/schedule-section.tsx`

### Worker
- `worker/index.ts`
- `worker/research/index.ts`
- `worker/research/youtube.ts`
- `worker/research/reddit.ts`
- `worker/research/newsapi.ts`
- `worker/discover/index.ts`
- `worker/discover/app-ideas.ts`
- `worker/discover/clickbank.ts`
- `worker/content/index.ts`
- `worker/content/generate.ts`
- `worker/content/media.ts`
- `worker/posting/scheduler.ts`
- `worker/posting/post-bridge.ts`
- `worker/posting/systeme.ts`

### Tests
- `tests/auth.spec.ts`
- `tests/research.spec.ts`
- `tests/discover.spec.ts`
- `tests/content.spec.ts`
- `tests/settings.spec.ts`

**Total: ~65 files**
