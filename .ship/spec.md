# PostForge Services — Spec

## Feature Summary
Add a **Services** monetization track to PostForge. The user defines AI-deliverable service templates (video content, social media packages, newsletters, etc.). PostForge promotes those services via generated content, captures leads via Systeme.io webhook, manages the client pipeline, generates AI quotes and deliverables, and communicates entirely by email. No calls, no manual content creation.

## Problem Statement
PostForge currently promotes affiliate products and app ideas. Services are the fastest monetization track — no inventory, no build risk, and PostForge can produce the deliverables itself using its existing AI engine. A Minecraft creator pays for "30 video scripts" → PostForge generates them in minutes.

---

## The Flywheel Extension

```
Research finds trending niche (e.g., "Minecraft tutorials")
    ↓
PostForge generates content promoting the service for that niche:
  "I create Minecraft video scripts + thumbnails for creators"
    ↓
CTA links to Systeme.io landing page (user-built manually)
    ↓
Lead submits form → Systeme.io webhook → ServiceTicket created in PostForge
    ↓
Auto-reply email sent to lead (confirmation + what to expect)
    ↓
User generates AI quote (scope, timeline, price) → sends via email
    ↓
Deal closed externally (email negotiation + payment)
    ↓
User triggers delivery: PostForge generates deliverables for their niche
    ↓
Review + send via email → ticket marked Delivered → Closed
```

---

## User Stories

### 1. Service Catalog
**As a user**, I want to define my service offerings once so PostForge can promote and deliver them automatically.

Acceptance criteria:
- [ ] User can create a service with: name, description, deliverables template, price range (min/max), estimated turnaround (days), active/paused status
- [ ] Service has a `type` that maps to a content generation mode: `video_content` | `social_package` | `newsletter_package` | `landing_page` | `content_strategy`
- [ ] Service can be paused (stops being promoted, tickets still managed)
- [ ] Services page shows catalog + quick stats (active tickets per service)

### 2. Lead Capture via Systeme.io Webhook
**As a user**, I want Systeme.io to fire a webhook when a lead submits the form so a ticket is created automatically.

Acceptance criteria:
- [ ] `POST /api/webhooks/systeme` receives Systeme.io form submission payload
- [ ] Creates a `ServiceTicket` with: name, email, niche/topic, service type, message, source
- [ ] Auto-reply email sent to lead via Systeme.io broadcast API (confirmation + "we'll be in touch within 24h")
- [ ] Ticket appears in pipeline under "New"

### 3. Pipeline View
**As a user**, I want to see all active service tickets in a pipeline so I know where each client is.

Acceptance criteria:
- [ ] Pipeline shows 5 columns: New → Quoted → In Progress → Delivered → Closed
- [ ] Each ticket card shows: client name, service type, niche, days in current stage
- [ ] Clicking a ticket opens a detail panel (right side or modal): full info, quote, notes, history, actions
- [ ] User can drag ticket or use a status dropdown to move between stages
- [ ] Filter by service type

### 4. AI Quote Generation
**As a user**, I want PostForge to generate a professional quote/proposal for a lead so I can send it without writing from scratch.

Acceptance criteria:
- [ ] "Generate Quote" button on ticket detail
- [ ] AI generates a proposal including:
  - Personalized intro (references their niche and goal)
  - Scope of work (specific to their niche: e.g., "10 Minecraft video scripts targeting beginners")
  - Deliverables list
  - Timeline
  - Investment (price within service's range)
  - Next steps (reply to accept, payment details)
- [ ] User can edit the quote in a text area
- [ ] "Send Quote" → sends via Systeme.io broadcast API to the lead's email
- [ ] Ticket moves to "Quoted" automatically after send

### 5. AI Deliverable Generation
**As a user**, I want PostForge to generate the actual service deliverables for a client's niche so I can review and send them.

Acceptance criteria:
- [ ] "Generate Deliverables" button on ticket (available when status = In Progress)
- [ ] PostForge runs content generation engine targeting the client's niche:
  - `video_content`: X video scripts + thumbnail prompts + captions (niche-specific)
  - `social_package`: N posts per platform for their niche
  - `newsletter_package`: N newsletter drafts for their niche
  - `landing_page`: sales page HTML for their product/offer
  - `content_strategy`: content calendar + angle list for their niche
- [ ] Generated content shown in ticket detail for review/edit
- [ ] "Send Deliverables" → packages content and sends via Systeme.io email to client
- [ ] Ticket moves to "Delivered" after send

### 6. Service Promotion Integration
**As a user**, I want PostForge to promote my services in generated content when a relevant niche is trending.

Acceptance criteria:
- [ ] Active services are included as promotion targets alongside affiliate products and app ideas
- [ ] When a ResearchTopic matches a service's niche scope, PostForge generates a post promoting the service
- [ ] Post content is tailored to the trending niche: "Minecraft content is booming — I create scripts for creators"
- [ ] CTA links to the service's Systeme.io funnel URL (set per service)

---

## Technical Requirements

### New Database Models

```prisma
model Service {
  id             String    @id @default(cuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name           String
  description    String    @db.Text
  type           String    // "video_content" | "social_package" | "newsletter_package" | "landing_page" | "content_strategy"
  deliverables   String    @db.Text  // template description (what AI generates)
  priceMin       Float
  priceMax       Float
  turnaroundDays Int
  funnelUrl      String?   // Systeme.io landing page URL
  status         String    @default("active") // "active" | "paused"
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  tickets ServiceTicket[]

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
  niche       String    // e.g., "Minecraft", "fitness", "crypto"
  message     String    @db.Text
  source      String?   // which funnel/page they came from
  status      String    @default("new") // "new" | "quoted" | "in_progress" | "delivered" | "closed"
  quote       String?   @db.Text  // AI-generated proposal (editable)
  quoteSentAt DateTime?
  notes       String?   @db.Text  // internal notes
  deliverables String?  @db.Text  // JSON — generated content per type
  deliveredAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId])
  @@index([serviceId])
  @@map("service_tickets")
}
```

### New API Routes

| Method | Path | Description |
|---|---|---|
| GET | `/api/services` | List user's services |
| POST | `/api/services` | Create service |
| PATCH | `/api/services/[id]` | Update service (name, price, status, etc.) |
| DELETE | `/api/services/[id]` | Delete service |
| GET | `/api/tickets` | List tickets with `?status=&serviceId=` filter |
| GET | `/api/tickets/[id]` | Get ticket detail |
| PATCH | `/api/tickets/[id]` | Update ticket (status, notes, quote) |
| POST | `/api/tickets/[id]/quote` | Generate + save AI quote |
| POST | `/api/tickets/[id]/send-quote` | Send quote email via Systeme.io |
| POST | `/api/tickets/[id]/deliver` | Generate deliverables for client's niche |
| POST | `/api/tickets/[id]/send-delivery` | Send deliverables email via Systeme.io |
| POST | `/api/webhooks/systeme` | Receive Systeme.io form webhook → create ticket |

### Email Templates (sent via Systeme.io broadcast API)

1. **Confirmation** — on ticket creation: "Thanks, got your request, we'll send a quote within 24h"
2. **Quote** — full AI proposal
3. **Delivery** — deliverables attached/inline + "please review and let me know"

---

## UI/UX Requirements

### New Page: `/services`

**Two-panel layout:**

**Left panel — Service Catalog** (top half)
- List of services: name, type badge, price range, turnaround, active/paused toggle
- [+ Add Service] button → inline form or modal

**Right panel (or full width below) — Pipeline**
- 5-column kanban: New | Quoted | In Progress | Delivered | Closed
- Ticket cards: client name, niche tag, service type, days in stage
- Click → opens ticket detail drawer (right side)

**Ticket Detail Drawer:**
- Header: client name, email, niche, service name, source
- Status dropdown (move pipeline)
- Internal notes (textarea, auto-saves)
- Quote section: [Generate Quote] → editable textarea → [Send Quote]
- Deliverables section: [Generate Deliverables] (visible when In Progress) → preview → [Send Delivery]
- Timeline: when ticket was created, when quoted, when delivered

---

## Integration Points

| Service | Usage |
|---|---|
| Systeme.io webhook | `POST /api/webhooks/systeme` → creates ServiceTicket |
| Systeme.io broadcast API | Sends confirmation, quote, and delivery emails |
| OpenRouter | Generates quote proposal + service deliverables |
| fal.ai | Image generation if service type = `video_content` (thumbnail prompts → images) |
| Existing content engine | Powers deliverable generation (reuses `worker/content/generate.ts` logic) |

---

## Out of Scope (MVP)
- In-app payment processing (Stripe) — payment handled externally
- Client portal (clients don't log in)
- Revision tracking / feedback loop
- Multiple deliverable generations per ticket
- Calls / scheduling (fully async email)
- Service packages / upsells

---

## Success Criteria
- [ ] User can define 1+ service with deliverable template + funnel URL
- [ ] Systeme.io webhook creates a ticket automatically
- [ ] Confirmation email auto-sent to lead on ticket creation
- [ ] AI quote generated in < 10s and sendable via one click
- [ ] AI deliverables generated for client's niche and sendable via one click
- [ ] Pipeline view shows all tickets across 5 stages
- [ ] Services promoted in PostForge content when relevant niche is trending
