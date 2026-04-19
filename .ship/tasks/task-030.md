# Task 030: Improve Open Graph metadata for landing pages

## Description
The `generateMetadata` function in the landing page route currently only sets `title` and `description`. Add proper Open Graph metadata for richer social media previews.

## Files
- `app/(landing)/l/[slug]/page.tsx` (modify)

## Requirements
1. Read the current file before editing.
2. In `generateMetadata`, extend the returned object with an `openGraph` key:
```ts
openGraph: {
  type: "website",
  title,
  description: description ?? undefined,
  url: `/l/${params.slug}`,
}
```
3. The `url` value should be relative (`/l/${params.slug}`) — Next.js resolves it against the deployment URL automatically when `metadataBase` is configured. Do NOT hardcode a domain.
4. Keep the existing `title` and `description` fields at the root level (for `<title>` and `<meta name="description">`)
5. The "Page Not Found" return in the error path does not need openGraph

## Existing Code to Reference
- `app/(landing)/l/[slug]/page.tsx` (read it first)

## Acceptance Criteria
- [ ] `openGraph.type` is `"website"`
- [ ] `openGraph.title` matches the page title
- [ ] `openGraph.description` is set when a subtitle exists
- [ ] `openGraph.url` is set to `/l/${params.slug}`
- [ ] Existing title/description metadata still present

## Dependencies
None — independent

## Commit Message
feat: add Open Graph metadata to landing page route
