# PostForge Services — Technical Plan

## Section 1: Architecture Integration

This feature adds two new first-class entities (`Service` + `ServiceTicket`) alongside the existing `Promotion` / `ContentPiece` / `Newsletter` system. It does NOT replace anything — services are an additional monetization track.

### How it fits

- **Services** live on a new `/services` page (sidebar nav item added)
- **Tickets** are managed entirely within `/services` (no separate route)
- **Webhook** receives Systeme.io form submissions at `/api/webhooks/systeme` (no auth required — uses a secret token check instead)
- **Promotion integration**: `Service` can link to the `Promotion` model — when a service is active, PostForge creates a Promotion record (type: `"service"`) which feeds into the existing content generation engine
- **Deliverable generation**: reuses `lib/ai.ts` `generateText()` — same pattern as `worker/content/generate.ts` but driven by the service's custom template + client niche

### Existing patterns to follow

- API routes: `auth()` → 401 check → Prisma query → `NextResponse.json()`
- Client pages: `"use client"` + `useEffect` fetch + `useState` — no server components
- Inline styles everywhere — no Tailwind
- All keys from DB `Setting` table via `getSetting()`

---

## Section 2: Database Changes

### New models added to `prisma/schema.prisma`

```prisma
model Service {
  id             String    @id @default(cuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name           String
  description    String    @db.Text
  deliverablesTemplate String @db.Text  // user's custom AI prompt with [niche] placeholder
  priceMin       Float
  priceMax       Float
  turnaroundDays Int       @default(3)
  funnelUrl      String?   // Systeme.io landing page URL for this service
  status         String    @default("active") // "active" | "paused"
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  tickets   ServiceTicket[]
  promotion Promotion?      @relation(fields: [promotionId], references: [id])
  promotionId String?       @unique

  @@index([userId])
  @@map("services")
}

model ServiceTicket {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  serviceId   String
  service     Service   @relation(fields: [serviceId], references: [id])
  clientName  String
  clientEmail String
  niche       String
  message     String    @db.Text
  source      String?
  status      String    @default("new") // "new" | "quoted" | "in_progress" | "delivered" | "closed"
  quote       String?   @db.Text
  quoteSentAt DateTime?
  notes       String?   @db.Text
  deliverables String?  @db.Text  // JSON string — generated output
  deliveredAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([serviceId])
  @@map("service_tickets")
}
```

### Changes to existing models

- `User` — add `services Service[]` and `serviceTickets ServiceTicket[]` relations
- `Promotion` — add `type` value `"service"` (already a string field, no migration needed) + optional back-relation from `Service`

### Migration

Run `prisma migrate dev --name add_services` after schema update.

---

## Section 3: API Design

All routes except the webhook require `auth()` session. `userId` always from session.

### Services CRUD

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/services` | — | List user's services with ticket counts |
| POST | `/api/services` | `{ name, description, deliverablesTemplate, priceMin, priceMax, turnaroundDays, funnelUrl }` | Create service + auto-create Promotion |
| PATCH | `/api/services/[id]` | any fields | Update service |
| DELETE | `/api/services/[id]` | — | Delete service (cascade tickets) |

### Ticket Management

| Method | Path | Body / Query | Description |
|---|---|---|---|
| GET | `/api/tickets` | `?status=&serviceId=` | List tickets |
| GET | `/api/tickets/[id]` | — | Get ticket detail |
| PATCH | `/api/tickets/[id]` | `{ status?, notes?, quote? }` | Update ticket |
| POST | `/api/tickets/[id]/quote` | — | Generate AI quote → save to ticket |
| POST | `/api/tickets/[id]/send-quote` | — | Send quote email via Systeme.io → set quoteSentAt, move to "quoted" |
| POST | `/api/tickets/[id]/deliver` | — | Generate AI deliverables → save to ticket |
| POST | `/api/tickets/[id]/send-delivery` | — | Send delivery email via Systeme.io → set deliveredAt, move to "delivered" |

### Webhook (no auth — token check)

| Method | Path | Description |
|---|---|---|
| POST | `/api/webhooks/systeme` | Receive Systeme.io form payload → create ServiceTicket → send confirmation email |

Webhook payload expected shape (Systeme.io form):
```json
{
  "contact": { "first_name": "...", "email": "..." },
  "fields": {
    "niche": "...",
    "service": "...",
    "message": "..."
  },
  "funnel_url": "..."
}
```

Token check: compare `x-systeme-token` header against `systeme_webhook_token` in DB Setting.

---

## Section 4: Frontend

### Sidebar update
Add "Services" nav item to `components/layout/sidebar.tsx` between Promote and Settings.

### `/services` page — two-section layout

**Top: Service Catalog**
- List of service cards (name, price range, turnaround, status toggle, ticket count badge)
- [+ Add Service] → opens a modal/drawer with form:
  - Name, Description (textarea)
  - Deliverables Template (large textarea with `[niche]` hint)
  - Price Min / Max, Turnaround Days
  - Funnel URL
- [Edit] on each card → same form pre-filled
- Active/Paused toggle per service

**Bottom: Ticket Pipeline**
- 5 columns: New | Quoted | In Progress | Delivered | Closed
- Ticket cards: client name, niche tag, service name, days in stage
- Click card → Ticket Drawer opens (right side, fixed panel)

**Ticket Drawer:**
- Header: client name, email (mailto link), niche, service, source, created date
- Status dropdown → moves pipeline stage
- Internal Notes — auto-saves on blur
- **Quote section:**
  - [Generate Quote] button → POST `/api/tickets/[id]/quote` → populates textarea
  - Editable textarea
  - [Send Quote] → POST `/api/tickets/[id]/send-quote`
  - Shows quoteSentAt timestamp if sent
- **Deliverables section** (visible when status = in_progress):
  - [Generate Deliverables] → POST `/api/tickets/[id]/deliver` → shows preview
  - Scrollable preview area
  - [Send Delivery] → POST `/api/tickets/[id]/send-delivery`

### New component files

```
app/(dashboard)/services/page.tsx          ← main page
components/dashboard/services/
  service-card.tsx                         ← catalog card
  service-form.tsx                         ← create/edit modal form
  ticket-pipeline.tsx                      ← 5-column pipeline
  ticket-card.tsx                          ← pipeline card
  ticket-drawer.tsx                        ← detail panel
```

---

## Section 5: Service Integrations

### Systeme.io (existing `worker/posting/systeme.ts`)
Extend with two new functions:
- `sendConfirmationEmail(ticket)` — "Got your request, quote within 24h"
- `sendQuoteEmail(ticket, quote)` — full proposal email
- `sendDeliveryEmail(ticket, deliverables)` — deliverables packaged as email body

### OpenRouter (`lib/ai.ts` `generateText()`)
Two new prompt builders:

**Quote generation:**
```
System: You are a professional freelance services consultant.
User: Generate a professional quote for:
  Service: {service.name}
  Client: {ticket.clientName}
  Their niche: {ticket.niche}
  Their message: {ticket.message}
  Template of what you'll deliver: {service.deliverablesTemplate}
  Price range: ${service.priceMin}–${service.priceMax}
  Turnaround: {service.turnaroundDays} days

Write a professional proposal with: intro, scope, deliverables, timeline, investment, next steps.
```

**Deliverable generation:**
```
System: You are an expert content creator.
User: {service.deliverablesTemplate with [niche] replaced by ticket.niche}
```

### Promotion integration
When a `Service` is created with `status: active`, auto-create a `Promotion` record:
- `type: "service"`
- `name`: service name
- `description`: service description
- `url`: service funnelUrl
- This makes the service appear in content generation as a promotion target

---

## Section 6: File Map

### New files
- `prisma/migrations/[timestamp]_add_services/` (auto-generated)
- `app/(dashboard)/services/page.tsx`
- `app/api/services/route.ts`
- `app/api/services/[id]/route.ts`
- `app/api/tickets/route.ts`
- `app/api/tickets/[id]/route.ts`
- `app/api/tickets/[id]/quote/route.ts`
- `app/api/tickets/[id]/send-quote/route.ts`
- `app/api/tickets/[id]/deliver/route.ts`
- `app/api/tickets/[id]/send-delivery/route.ts`
- `app/api/webhooks/systeme/route.ts`
- `components/dashboard/services/service-card.tsx`
- `components/dashboard/services/service-form.tsx`
- `components/dashboard/services/ticket-pipeline.tsx`
- `components/dashboard/services/ticket-card.tsx`
- `components/dashboard/services/ticket-drawer.tsx`

### Modified files
- `prisma/schema.prisma` — add Service, ServiceTicket models + User relations
- `components/layout/sidebar.tsx` — add Services nav item
- `worker/posting/systeme.ts` — add email helper functions
- `app/(dashboard)/promote/page.tsx` — minor: exclude "service" type from promote page (optional, services managed on /services)
