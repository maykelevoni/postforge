# Task 001: DB — Add Polar payment columns to ServiceTicket + migration

## Description
Add 4 new optional columns to the `ServiceTicket` model in `prisma/schema.prisma`, then create and apply a migration.

## Files
- `prisma/schema.prisma` (modify)
- `prisma/migrations/<timestamp>_add_polar_payment_fields/migration.sql` (create)

## Requirements
1. Add these columns to `model ServiceTicket` (after `deliveredAt`):
   ```prisma
   polarCheckoutId  String?    // Polar checkout session ID
   polarOrderId     String?    // Polar order ID (set when webhook fires)
   paidAt           DateTime?  // Timestamp of confirmed payment
   amountPaid       Int?       // Amount in cents
   ```
2. Run: `pnpm dlx "prisma@5.20.0" migrate diff --from-schema-datasource --to-schema-datamodel --script > /tmp/polar_migration.sql`
3. Create migration dir: `prisma/migrations/<YYYYMMDDHHmmss>_add_polar_payment_fields/`
4. Copy `/tmp/polar_migration.sql` into that dir as `migration.sql`
5. Apply: `pnpm dlx "prisma@5.20.0" migrate deploy`
6. Regenerate client: `pnpm dlx "prisma@5.20.0" generate`

## Existing Code to Reference
- `prisma/schema.prisma` — existing `ServiceTicket` model at line ~309

## Acceptance Criteria
- [ ] `prisma/schema.prisma` includes the 4 new columns
- [ ] Migration SQL file exists in `prisma/migrations/`
- [ ] `pnpm dlx "prisma@5.20.0" migrate deploy` exits 0
- [ ] `pnpm dlx "prisma@5.20.0" generate` exits 0

## Dependencies
None

## Commit Message
feat(db): add polar payment columns to ServiceTicket
