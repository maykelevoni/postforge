# Project Learnings

> Non-obvious discoveries from implementation. Agents append findings here.

## Task 001 - Prisma Version Compatibility

- **Issue**: pnpm exec prisma was failing with "MODULE_NOT_FOUND" errors even though Prisma was installed
- **Root Cause**: Node.js v24.12.0 + pnpm had issues with Prisma module resolution, and `pnpm dlx prisma` defaulted to version 7.7.0 which has breaking changes in schema configuration (datasource URL format changed)
- **Solution**: Used `pnpm dlx "prisma@5.20.0"` to match the version specified in package.json, which uses the traditional schema format
- **Note**: The project uses Prisma v5.20.0. When running Prisma commands, always specify the version explicitly to avoid auto-upgrading to v7 which has breaking changes

## Task 004 - Systeme.io Broadcast API

- **Discovery**: The Systeme.io broadcast API endpoint structure wasn't fully documented in the existing code. The existing `sendNewsletter()` function uses `/api/email_campaigns` but this appears to be for campaigns, not individual emails
- **Implementation**: Used `/api/emails` endpoint for sending individual quote emails with parameters: `{ email, subject, body, send_now }`
- **Note**: This pattern may need to be adjusted in Task 006 when email helper functions are added to `worker/posting/systeme.ts`. The exact API endpoint structure should be verified against Systeme.io documentation

