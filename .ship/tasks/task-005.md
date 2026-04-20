# Task 005: Backend — Guard send-delivery behind paid/in_progress status

## Description
Modify `app/api/tickets/[id]/send-delivery/route.ts` to reject delivery attempts unless the ticket is `paid` or `in_progress`.

## Files
- `app/api/tickets/[id]/send-delivery/route.ts` (modify)

## Requirements
1. After loading the ticket (line ~17) and verifying ownership, add a status guard:
   ```ts
   if (!["paid", "in_progress"].includes(ticket.status)) {
     return NextResponse.json(
       { error: "Payment required before delivery can be sent" },
       { status: 403 }
     );
   }
   ```
2. Place the check BEFORE the deliverables check (after the `!ticket.service` check at line ~37)
3. No other changes to the file

## Existing Code to Reference
- `app/api/tickets/[id]/send-delivery/route.ts` — modify this file (already read, modify at line ~44 before the deliverables check)

## Acceptance Criteria
- [ ] Returns 403 when status is `new`, `quoted`, or `awaiting_payment`
- [ ] Allows delivery when status is `paid` or `in_progress`
- [ ] No other behavior changes

## Dependencies
- Task 001 (new statuses defined in schema)

## Commit Message
feat(api): gate send-delivery behind paid/in_progress status
