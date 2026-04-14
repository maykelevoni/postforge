# Feature Spec: PDF Document Generator

## Feature Summary
A new **Documents** page where the user describes what they want, AI generates the full content, the user previews it in-app, and downloads it as a PDF. Supports two document types: **Lead Magnet** (a free guide/resource to grow an email list) and **Quote** (a professional service proposal for a client).

## Problem Statement
The user sells AI-powered services and grows their business through lead magnets. Currently there's no way to create these documents inside the app — they have to use external tools. A simple generate → preview → download flow removes that friction entirely.

## User Stories

### Story 1: Generate a Lead Magnet PDF
**As a** user building an email list,  
**I want to** describe a lead magnet topic and have AI generate the full document,  
**So that** I can download it as a PDF and use it to capture email subscribers.

**Acceptance Criteria:**
- [ ] User can navigate to `/documents` from the sidebar
- [ ] User selects "Lead Magnet" as document type
- [ ] User types a description (e.g. "5 ways AI can save a small business 10 hours a week")
- [ ] Clicking "Generate" calls the AI and shows a loading state
- [ ] Generated content appears in a preview panel with: title, introduction, sections (3-7), and a CTA
- [ ] User can click "Download PDF" and receive a formatted PDF file

### Story 2: Generate a Client Quote PDF
**As a** service provider,  
**I want to** describe a client project and have AI format a professional quote,  
**So that** I can download it and send it to the client.

**Acceptance Criteria:**
- [ ] User selects "Quote" as document type
- [ ] User types a description (e.g. "AI chatbot for a dental clinic, $1,200, delivered in 2 weeks")
- [ ] AI generates a structured quote: service name, scope of work, deliverables, timeline, investment, terms
- [ ] User can download it as a formatted PDF

### Story 3: Error Handling
- [ ] If AI key is not set, show a clear message directing to Settings
- [ ] If generation fails, show an error with a retry option
- [ ] Loading state is visible during generation (button disabled, spinner shown)

## Technical Requirements
- New page at `/documents` (Next.js App Router, client component)
- New API route `POST /api/documents/generate` — accepts `{ type, prompt }`, returns structured content
- API uses OpenRouter (same pattern as existing AI calls in the codebase)
- PDF export runs client-side using `jspdf` + `html2canvas` (capture the preview div → PDF)
- No database storage for MVP — generate on demand, download immediately
- Auth-gated: redirect to sign-in if unauthenticated

## UI/UX Requirements
- New sidebar nav item: "Documents" with a `fileDown` icon, between Templates and Settings
- Page layout: left panel (form) + right panel (preview), dark theme matching rest of app
- Form: type selector (Lead Magnet | Quote) + prompt textarea + Generate button
- Preview panel: renders generated content as styled document (white background, dark text — print-ready look)
- Download button appears only after content is generated
- Inline styles only (no Tailwind) — match existing component patterns

## Integration Points
- OpenRouter API key from DB Setting table (same as existing AI calls)
- Sidebar nav (`components/layout/nav-item.tsx`) — add Documents entry
- No other integrations needed for MVP

## Out of Scope
- Saving documents to the database
- Document history / list of past documents
- Custom branding (logo, colors) from Settings
- Multiple templates or style options
- Sending PDF directly to client via email
- Editing generated content before download

## Success Criteria
- User can generate a lead magnet PDF in under 60 seconds
- User can generate a quote PDF in under 60 seconds
- PDF downloads correctly as a .pdf file
- Works with the real OpenRouter API key (no mocks)
