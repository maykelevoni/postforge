# Task 009: Discover Worker (App Ideas + ClickBank)

## Description
Build the discover cron worker that analyzes research topics with AI to generate app idea briefs and find ClickBank affiliate products.

## Files
- `worker/discover/app-ideas.ts` (create)
- `worker/discover/clickbank.ts` (create)
- `worker/discover/index.ts` (create)

## Requirements

### worker/discover/app-ideas.ts
- `generateAppIdeas(userId: string): Promise<void>`
- Fetches today's top 3 ResearchTopics (by score, status = 'new')
- For each topic, calls OpenRouter via `generateText()` with a prompt asking for:
  - Title, problem, targetAudience, coreFeatures (JSON array), monetization, competition, whyNow
  - Landing page HTML (complete self-contained HTML: headline, subheadline, features, email capture form, CTA)
- Parses JSON response
- Creates `DiscoverItem` (type: 'app_idea') + `AppIdea` record
- Skips if a DiscoverItem already exists for this topic today

### worker/discover/clickbank.ts
- `findClickBankProducts(userId: string): Promise<void>`
- Reads ClickBank API key + account from settings
- Uses top research topic keywords to search ClickBank marketplace
- ClickBank API: `GET https://api.clickbank.com/rest/1.3/products/list?site={account}&keywords={kw}`
- For each product found, calls OpenRouter to generate:
  - contentAngles (3-5 suggested post angles based on product + recent topics)
  - promoRules summary
- Creates `DiscoverItem` (type: 'affiliate') + `AffiliateProduct` record
- Limits to 3 products per run
- If no ClickBank key configured, skip gracefully

### worker/discover/index.ts — orchestrator
- `runDiscover(userId: string): Promise<void>`
- Runs `generateAppIdeas` then `findClickBankProducts` sequentially
- Logs counts of new items created

## Acceptance Criteria
- [ ] App ideas created with full brief fields populated
- [ ] Landing page HTML included in AppIdea record
- [ ] ClickBank products created with affiliate link + promo rules
- [ ] No crash when ClickBank key missing
- [ ] No duplicate DiscoverItems created for same topic on same day

## Dependencies
- Task 008
- Task 004

## Commit Message
feat: add discover worker (app ideas + ClickBank products)
