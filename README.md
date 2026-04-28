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

### Services
Define service offerings (video scripts, social packages, newsletters, landing pages, content strategy) and manage the entire client pipeline without calls or manual writing:

- **Service Catalog** — Create services with deliverables templates, price ranges, and turnaround times. Active services are automatically added as promotion targets so PostForge generates content for them.
- **Lead Capture** — Native landing page forms submit to `/api/webhooks/lead`, creating a ticket automatically. Auto-reply confirmation email sent immediately via Brevo.
- **Client Pipeline** — 5-stage kanban: New → Quoted → In Progress → Delivered → Closed. Filter by service type.
- **AI Quote Generation** — One click generates a personalized proposal (scope, timeline, price, next steps) tailored to the client's niche.
- **AI Deliverable Generation** — PostForge generates the actual deliverables for the client's niche. `[niche]` placeholder in your template gets replaced with the real niche at generation time.
- **Email delivery** — Quotes and deliverables sent via Brevo API. No manual copy-paste.

### Settings
Configure API keys (OpenRouter, fal.ai, Brevo), posting schedules, gate mode, and platform connections.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Auth.js v5 (credentials + Google OAuth) |
| Database | PostgreSQL via Prisma ORM |
| AI | OpenRouter (text) + fal.ai (images) |
| Email | Brevo API |
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

## Deploy to production

A single bootstrap script sets up everything on a **fresh Ubuntu VPS** — Docker, nginx, SSL, and the app.

### Requirements
- A fresh Ubuntu 22.04+ VPS
- A domain with DNS access
- A [Neon](https://neon.tech) PostgreSQL database URL

### 1. SSH into your server

```
ssh root@YOUR_SERVER_IP
```

### 2. Download the bootstrap script

```
wget https://raw.githubusercontent.com/maykelevoni/postforge/master/bootstrap.sh
```

### 3. Run it

```
chmod +x bootstrap.sh
```

```
sudo ./bootstrap.sh
```

The script will:
- Install Docker, nginx, certbot, and git
- Clone this repo to `/var/www/postforge`
- Prompt for your `DATABASE_URL` (Neon connection string)
- Auto-generate `AUTH_SECRET`
- Build and start the Docker container

### 4. Run migrations (first deploy only)

```
cd /var/www/postforge && docker compose exec app pnpm exec prisma migrate deploy
```

### 5. Configure nginx

```
bash /var/www/postforge/nginx-setup.sh
```

### 6. Point DNS to your server

Get your server's IPv4:

```
hostname -I
```

In your DNS provider, set **A records** for `yourdomain.com` and `www.yourdomain.com` to that IP. Wait 2–5 minutes for DNS to propagate.

### 7. Get SSL

```
bash /var/www/postforge/ssl.sh
```

App is live at `https://yourdomain.com`. Log in and fill in your API keys in Settings.

---

### Updating after a code push

```
cd /var/www/postforge && git pull && docker compose up -d --build
```

---

## Lead capture webhook

PostForge landing pages submit leads to the built-in webhook automatically:

- Endpoint: `POST /api/webhooks/lead`
- Payload: `{ name, email, niche, serviceId, message }`
- On submit → Subscriber created or updated, ServiceTicket created, confirmation email sent via Brevo

---

## Architecture

```
app/
  (dashboard)/         — authenticated pages (research, content, promote, services, settings)
  api/
    services/          — service CRUD
    tickets/           — ticket management + quote/delivery actions
    webhooks/lead/     — lead capture endpoint
  (auth)/              — sign-in, register pages

components/
  dashboard/services/  — service catalog, pipeline, ticket drawer
  layout/              — sidebar, nav

worker/                — background job runner (content generation, posting)
prisma/                — schema + migrations
```
