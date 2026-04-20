# Task 006: Bug fix — ServiceForm semantic labels (id + htmlFor)

## Type
ui

## Description
Fix Bug 1: `components/dashboard/services/service-form.tsx` has labels without `htmlFor` and inputs without `id`. Add them for all 8 fields.

## Files
- `components/dashboard/services/service-form.tsx` (modify)

## Requirements
Add `id` to each input and matching `htmlFor` to each label. The mapping:

| Field | id | label text |
|---|---|---|
| name | `service-name` | Name |
| type | `service-type` | Type |
| description | `service-description` | Description |
| deliverables | `service-deliverables` | Deliverables |
| priceMin | `service-price-min` | Min Price ($) |
| priceMax | `service-price-max` | Max Price ($) |
| turnaroundDays | `service-turnaround` | Turnaround (days) |
| funnelUrl | `service-funnel-url` | Funnel URL (optional) |

For `<select>` elements (type field), use `id="service-type"` on the select tag.

## Existing Code to Reference
- `components/dashboard/services/service-form.tsx` — read it first to see exact current structure

## Acceptance Criteria
- [ ] All 8 fields have matching `id` and `htmlFor` as per the table above
- [ ] No visual or functional changes — only attributes added
- [ ] `<label htmlFor="service-name">` pairs with `<input id="service-name" ...>`

## Dependencies
None

## Commit Message
fix(ui): add semantic id/htmlFor to all ServiceForm fields
