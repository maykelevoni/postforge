# Task 001: Prisma Schema — Service + ServiceTicket Models

## Description
Add Service and ServiceTicket models to prisma/schema.prisma, add relations to User, and run migration.

## Files
- `prisma/schema.prisma` (modify)

## Requirements
1. Add `Service` model:
   - Fields: id (cuid), userId, name, description (Text), deliverablesTemplate (Text), priceMin (Float), priceMax (Float), turnaroundDays (Int default 3), funnelUrl (String?), status (String default "active"), createdAt, updatedAt
   - Relations: user → User, tickets → ServiceTicket[], promotion → Promotion? (optional promotionId @unique)
   - @@index([userId]), @@map("services")

2. Add `ServiceTicket` model:
   - Fields: id (cuid), userId, serviceId, clientName, clientEmail, niche, message (Text), source (String?), status (String default "new"), quote (Text?), quoteSentAt (DateTime?), notes (Text?), deliverables (Text?), deliveredAt (DateTime?), createdAt, updatedAt
   - Relations: user → User, service → Service
   - @@index([userId]), @@index([serviceId]), @@map("service_tickets")

3. Add to `User` model: `services Service[]` and `serviceTickets ServiceTicket[]`

4. Add to `Promotion` model: `service Service?` back-relation (owned by Service.promotionId)

5. Run: `pnpm exec prisma migrate dev --name add_services`
6. Run: `pnpm exec prisma generate`

## Existing Code to Reference
- `prisma/schema.prisma` — follow exact same pattern as Promotion, ContentPiece models

## Acceptance Criteria
- [ ] Migration runs without errors
- [ ] `prisma generate` succeeds
- [ ] `db.service` and `db.serviceTicket` are available

## Dependencies
None

## Commit Message
feat: add Service and ServiceTicket Prisma models
