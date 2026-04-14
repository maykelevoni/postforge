# PostForge

AI-powered content and services monetization platform. PostForge researches trending niches, generates promotional content, and manages a full client services pipeline — all without manual content creation or client calls.

---

## What's in the app

### Research
Discover trending topics across YouTube, Reddit, and Google Trends. PostForge surfaces niches with high engagement and low saturation so you know exactly what to create content about.

### Discover
Browse AI-curated research topics and niche opportunities. Feeds the content generation engine with real audience data.

### Content
AI generates platform-ready posts (YouTube scripts, Twitter threads, LinkedIn articles, Reddit posts) targeting the trending niches found during research. One click publishes or schedules across connected platforms.

### Promote
Manage affiliate products and app ideas as promotion targets. PostForge weaves CTAs into generated content — your offers get in front of the right audience automatically.

### Services
Define service offerings (video scripts, social packages, newsletters, landing pages, content strategy) and manage the entire client pipeline without calls or manual writing:

- **Service Catalog** — Create services with deliverables templates, price ranges, and turnaround times. Active services are automatically added as promotion targets so PostForge generates content for them.
- **Lead Capture** — Systeme.io webhook creates a ticket automatically when a form is submitted. Auto-reply confirmation email sent immediately.
- **Client Pipeline** — 5-stage kanban: New → Quoted → In Progress → Delivered → Closed. Filter by service type.
- **AI Quote Generation** — One click generates a personalized proposal (scope, timeline, price, next steps) tailored to the client's niche.
- **AI Deliverable Generation** — PostForge generates the actual deliverables for the client's niche. `[niche]` placeholder in your template gets replaced with the real niche at generation time.
- **Email delivery** — Quotes and deliverables sent via Systeme.io broadcast API. No manual copy-paste.

### Settings
Configure API keys (OpenRouter, fal.ai, Systeme.io), posting schedules, gate mode, and platform connections.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Auth.js v5 (credentials + Google OAuth) |
| Database | PostgreSQL via Prisma ORM |
| AI | OpenRouter (text) + fal.ai (images) |
| Email / Funnels | Systeme.io broadcast API |
| Worker | Node.js background worker (tsx watch) |
| Testing | Playwright |

---

## Getting started

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL database
- OpenRouter API key (for AI generation)

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL, and API keys

# Run database migrations
pnpm dlx "prisma@5.20.0" migrate dev

# Start the app (Next.js + background worker)
pnpm dev
```

App runs at `http://localhost:3000`.

### Environment variables

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional — needed for AI features
OPENROUTER_API_KEY=sk-or-...
FAL_KEY=...
SYSTEME_API_KEY=...
```

---

## Testing

```bash
# Run all tests (headless)
pnpm test

# Run tests headed — watch the browser
pnpm test:headed

# Run a specific test file
npx playwright test tests/services.spec.ts --headed
```

Test files live in `tests/`:

| File | Coverage |
|---|---|
| `auth.spec.ts` | Register, sign in, redirect unauthenticated |
| `settings.spec.ts` | Settings page, API key save, gate mode |
| `services.spec.ts` | Service catalog CRUD, pipeline, validation, webhook |
| `content.spec.ts` | Content generation flow |
| `research.spec.ts` | Research and discovery |

---

## Webhook integration (Systeme.io)

To capture leads automatically:

1. Create a form on Systeme.io with fields: `niche`, `service`, `message`
2. Set the webhook URL to `https://your-domain.com/api/webhooks/systeme`
3. Add a `x-systeme-token` header matching `systeme_webhook_token` in Settings
4. On form submit → ticket created in PostForge + confirmation email sent to lead

---

## Architecture

```
app/
  (dashboard)/         — authenticated pages (research, content, promote, services, settings)
  api/
    services/          — service CRUD
    tickets/           — ticket management + quote/delivery actions
    webhooks/systeme/  — lead capture endpoint
  (auth)/              — sign-in, register pages

components/
  dashboard/services/  — service catalog, pipeline, ticket drawer
  layout/              — sidebar, nav

worker/                — background job runner (content generation, posting)
prisma/                — schema + migrations
```
