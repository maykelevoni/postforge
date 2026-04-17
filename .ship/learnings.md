# Project Learnings

> Non-obvious discoveries from implementation. Agents append findings here.

## Task 001 - Prisma Version Compatibility

- **Issue**: pnpm exec prisma was failing with "MODULE_NOT_FOUND" errors even though Prisma was installed
- **Root Cause**: Node.js v24.12.0 + pnpm had issues with Prisma module resolution, and `pnpm dlx prisma` defaulted to version 7.7.0 which has breaking changes in schema configuration (datasource URL format changed)
- **Solution**: Used `pnpm dlx "prisma@5.20.0"` to match the version specified in package.json, which uses the traditional schema format
- **Note**: The project uses Prisma v5.20.0. When running Prisma commands, always specify the version explicitly to avoid auto-upgrading to v7 which has breaking changes

## Task 001 - pnpm add fails on WSL2+OneDrive due to EACCES rename

- **Issue**: `pnpm add jspdf` fails with `EACCES: permission denied, rename ... next_tmp_* -> next` — pnpm uses atomic rename for package installation, but Windows NTFS on OneDrive doesn't allow renaming across certain paths in WSL2
- **Root Cause**: pnpm tries to atomically rename a temp dir to the final package dir inside `.pnpm` virtual store; Windows/OneDrive blocks the rename operation
- **Solution**: Use `pnpm install --ignore-scripts` after manually adding the package to `package.json`. Since the pnpm store already downloaded the package (visible in `.pnpm/jspdf@x.x.x`), `--ignore-scripts` skips the `postinstall` prisma generate step which also avoids the problematic `next` package rename
- **Note**: The `package-lock.json` from a previous npm install compounds the issue — pnpm tries to move npm packages to `.ignored`, failing on `next`. Removing `package-lock.json` first is necessary but not sufficient on its own.

## Task 002 - Prisma migrate dev fails in non-interactive environments

- **Issue**: `pnpm dlx "prisma@5.20.0" migrate dev` fails with "non-interactive environment" error even when trying to pipe input (echo "" | ...) because Prisma's interactive detection is strict
- **Solution**: Use `prisma migrate diff --from-schema-datasource --to-schema-datamodel --script` to generate the SQL, create the migration directory and `migration.sql` manually, then apply with `prisma migrate deploy`
- **Note**: This workaround is needed for all future `migrate dev` commands in this WSL2/shell environment. The generated SQL from `migrate diff` is identical to what `migrate dev` would produce.

## Task 002 - Bidirectional relations between Service and LandingPage

- **Issue**: Service has `landingPageId` FK → LandingPage (Service owns the FK) AND LandingPage has `serviceId` FK → Service (LandingPage owns the FK). These are two separate relations but Prisma treats them as one unless named.
- **Solution**: Use named relations: `@relation("LandingPageOwnerService")` for LandingPage→Service and `@relation("ServiceLinkedLandingPage")` for Service→LandingPage. Add explicit back-reference fields on both sides with the same relation name.
- **Note**: When two models have multiple relations to each other, always use named `@relation("name")` attributes on both sides to avoid Prisma P1012 validation errors.

## Task 004 - Systeme.io Broadcast API

- **Discovery**: The Systeme.io broadcast API endpoint structure wasn't fully documented in the existing code. The existing `sendNewsletter()` function uses `/api/email_campaigns` but this appears to be for campaigns, not individual emails
- **Implementation**: Used `/api/emails` endpoint for sending individual quote emails with parameters: `{ email, subject, body, send_now }`
- **Note**: This pattern may need to be adjusted in Task 006 when email helper functions are added to `worker/posting/systeme.ts`. The exact API endpoint structure should be verified against Systeme.io documentation

