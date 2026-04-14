# Templates Responsive Navigation Redesign

## Feature Summary
Fix the responsive layout of the Templates page. On small/medium screens replace the fixed left sidebar with a horizontal scrollable tab strip pinned to the top of the content area.

## Problem Statement
The templates page uses a fixed two-column layout (240px sidebar + flex content) with zero responsive adaptation. On screens narrower than ~1024px the sidebar compresses the content area into an unusable state.

## Solution
- **Desktop (≥ 900px):** keep the existing left sidebar with vertical platform list
- **Mobile/tablet (< 900px):** collapse sidebar into a horizontal scrollable pill-tab strip at the top; content takes full width below

## Acceptance Criteria
- [ ] Desktop (≥ 900px): 240px left sidebar unchanged
- [ ] Mobile/tablet (< 900px): horizontal scrollable platform tabs across the top, full-width content below
- [ ] Active tab clearly highlighted in both layouts
- [ ] No Tailwind — responsive via JS window-width detection + inline styles
- [ ] Smooth hover/active transitions

## Out of Scope
- Template cards, filters, gallery — no changes
- New platform categories

## Feature Summary
**Two-part feature:**
1. **Developer Icons Integration** (Phase 1 - Quick Win)
2. **Content Templates System** (Phase 2 - Main Feature)

## Phase 1: Developer Icons Integration

### Feature Summary
Replace all existing icons in PostForge with high-quality developer icons from [xandemon/developer-icons](https://github.com/xandemon/developer-icons) for improved visual appeal and consistency.

### Problem Statement
Current icons may be inconsistent or lack visual polish. The developer-icons repository provides comprehensive, high-quality icons designed for developer apps, improving overall UX and visual quality.

### User Stories

#### Story 1: Icon Replacement
**As a** user  
**I want to** see consistent, high-quality icons throughout the app  
**So that** the interface looks professional and polished

**Acceptance Criteria:**
- All existing icons replaced with developer-icons alternatives
- Icons are consistent in style and visual quality
- Icon sizes and spacing remain appropriate
- No broken icons or missing references
- Icons match semantic meaning (settings icon for settings, etc.)

#### Story 2: Easy Icon Maintenance
**As a** developer  
**I want to** use a standardized icon library  
**So that** future icon additions are consistent

**Acceptance Criteria:**
- Icon components are reusable
- Clear pattern for adding new icons
- Icon imports are centralized
- Documentation on available icons

### Technical Requirements

#### Icon Source
- **Repository**: https://github.com/xandemon/developer-icons
- **Format**: SVG (preferred) or React components
- **Installation**: npm package or direct SVG import

#### Implementation Approach
1. Install/add developer-icons to project
2. Create centralized icon component system
3. Map existing icons to developer-icons equivalents
4. Replace all icon references throughout app

#### Files to Update
- `components/layout/sidebar.tsx` - Navigation icons
- `components/dashboard/services/service-card.tsx` - Service icons
- `components/dashboard/content/content-piece-card.tsx` - Content icons
- `components/layout/nav-item.tsx` - Nav icons
- `app/(auth)/sign-in/page.tsx` - Auth icons
- `app/(auth)/register/page.tsx` - Auth icons
- All components with icon imports

#### Icon Mapping Examples
- Home/Dashboard → home icon
- Services → services/briefcase icon  
- Content → content/document icon
- Promote → promote/rocket icon
- Discover → discover/search icon
- Research → research/analytics icon
- Settings → settings/cog icon
- Status → success, error, warning icons
- Actions → edit, delete, add, remove icons

### UI/UX Requirements
- Visual consistency across all icons
- Consistent sizing and spacing
- Good color contrast
- SVG format for scalability
- Minimal performance impact

### Success Criteria
- ✅ All existing icons replaced with developer-icons
- ✅ No broken icons or visual inconsistencies
- ✅ App visual quality improved
- ✅ Reusable icon component system in place
- ✅ Zero performance degradation

---

## Phase 2: Content Templates System

### Feature Summary
A comprehensive template system providing viral, proven copywriting frameworks for all AI-generated content types. Users select from pre-built viral templates or create custom templates, with AI generating content that strictly follows template structures, constraints, and platform-specific rules.

### Problem Statement
Currently, AI-generated content lacks proven viral frameworks and doesn't follow platform-specific best practices. This leads to inconsistent quality, missing critical elements (strong CTAs, proper hashtag usage, optimal character counts), and lower engagement.

**Key Issues:**
- Inconsistent content quality across platforms
- No enforced character limits or platform constraints
- Missing proven viral copywriting frameworks
- No reusable template system for scaling content creation
- AI generates content that doesn't perform well

### User Stories

#### Story 1: Template Selection & Content Generation
**As a** content creator  
**I want to** select from proven viral templates for different platforms  
**So that** my AI-generated content follows frameworks known to perform well

**Acceptance Criteria:**
- User can select platform (Twitter, LinkedIn, Reddit, Instagram, TikTok, Email, Image, Video)
- User sees gallery of pre-built viral templates for that platform
- User can preview template structure, variables, and examples
- User can select template and fill variables (or let AI auto-fill)
- AI generates content strictly following template structure
- Generated content respects all template constraints

#### Story 2: Custom Template Creation
**As a** power user  
**I want to** create and save my own templates  
**So that** I can reuse successful content structures

**Acceptance Criteria:**
- User can create custom templates with variable placeholders
- User can define template constraints (max length, required sections, platform rules)
- User can save, edit, and delete custom templates
- Custom templates appear alongside pre-built templates

#### Story 3: Smart Variable Filling
**As a** user  
**I want** AI to intelligently fill template variables based on product info  
**So that** I don't have to manually write every variable

**Acceptance Criteria:**
- User provides product info (name, description, URL)
- AI automatically maps product info to template variables
- User can override AI-filled variables
- AI generates context-aware variables
- User can preview all variables before generation

#### Story 4: Content Validation & Preview
**As a** user  
**I want to** see real-time validation and preview of generated content  
**So that** I know it meets platform requirements before publishing

**Acceptance Criteria:**
- Real-time character count display with warnings
- Validation for required sections (hook, CTA, benefits, etc.)
- Platform-specific validation (hashtag counts, mention formats, etc.)
- Preview of how content will appear on platform
- Clear error messages for validation failures

#### Story 5: Template Management
**As a** user  
**I want to** organize and favorite my most-used templates  
**So that** I can quickly access successful templates

**Acceptance Criteria:**
- User can favorite templates for quick access
- Favorite templates appear at top of gallery
- User can search and filter templates by platform, type, or keywords
- User can see template usage history

### Technical Requirements

#### Template Data Structure
```typescript
interface Template {
  id: string;
  name: string;
  category: 'twitter' | 'linkedin' | 'reddit' | 'instagram' | 'tiktok' | 'email_subject' | 'email_body' | 'image_prompt' | 'video_prompt';
  type: 'prebuilt' | 'custom';
  template: string; // Template with variables like "{number} ways to {benefit}"
  variables: {
    [key: string]: {
      type: 'text' | 'number' | 'ai_generated';
      required: boolean;
      default?: string | number;
      description?: string;
      placeholder?: string;
    };
  };
  constraints: {
    maxLength?: number;
    minLength?: number;
    requiredSections?: string[];
    hashtagCount?: string;
    mentionCount?: string;
    customRules?: string[];
  };
  example?: string;
  userId?: string;
  isFavorite?: boolean;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Content Types Covered
1. **Twitter/X** (280 chars max, 2-3 hashtags, viral hooks)
2. **LinkedIn** (150-300 words, professional tone, value-driven)
3. **Reddit** (helpful, authentic, non-promotional)
4. **Instagram** (150 chars max, 3-5 hashtags)
5. **TikTok** (Hook 3s + Value 15s + CTA 5s format)
6. **Email Subject** (under 50 chars, catchy but not spammy)
7. **Email Body** (under 500 words, Hook → Value → Bridge → CTA)
8. **Image Prompts** (detailed visual descriptions, style, composition, colors, mood)
9. **Video Prompts** (cinematic quality, camera movement, duration)

#### AI Integration
- Extend existing `generateText()` to accept template parameter
- New function: `generateFromTemplate(template, variables, productInfo)`
- AI must respect template constraints strictly
- Fallback to existing generation if no template selected

#### Database Schema
- New table: `Template` (stores all templates)
- Update `ContentPiece` table: add `templateId` field
- Update `Newsletter` table: add `subjectTemplateId` and `bodyTemplateId` fields

### UI/UX Requirements

#### Templates Page
- **Route**: `/templates`
- **Layout**: Platform tabs on left, template gallery on right
- **Template Card**: Shows template name, example, variables count, favorite button
- **Filter/Search**: By platform, type, favorites, most-used

#### Template Selection Modal
- **Trigger**: When user generates content
- **Layout**: Grid of template cards with preview
- **Quick Select**: Recent/favorite templates at top

#### Template Editor (for custom templates)
- **Form Fields**: Name, category, template string, variable definitions, constraints
- **Live Preview**: See template with example variables filled
- **Validation**: Real-time syntax checking

#### Content Generation Flow Enhancement
- **Step 1**: Select platform (existing)
- **Step 2**: Select template (NEW)
- **Step 3**: Fill/confirm variables (NEW - optional, AI can auto-fill)
- **Step 4**: Generate content (existing)
- **Step 5**: Preview with validation (NEW)
- **Step 6**: Approve/edit (existing)

### Integration Points

#### Existing Content Generation
- **File**: `worker/content/generate.ts`
- **Modification**: Add template parameter to `generateContentForPlatform()`
- **Change**: Use template-based generation when template provided

#### Existing Media Generation
- **File**: `worker/content/media.ts`
- **Modification**: Add template-based prompt generation
- **Change**: Use image/video templates to structure prompts

#### API Routes
- **New**: `GET/POST /api/templates` - List/create templates
- **New**: `GET/PUT/DELETE /api/templates/[id]` - Template CRUD
- **New**: `POST /api/templates/[id]/favorite` - Favorite/unfavorite
- **New**: `POST /api/generate/from-template` - Generate from template

### Pre-Built Viral Templates

#### Twitter/X Templates (5-10)
1. "X ways to {benefit} without {pain} in {time}"
2. "I {achieved result} in {time}. Here's how: 🧵"
3. "Stop {common mistake}. Instead, {better approach}"
4. "The {adjective} truth about {topic} nobody talks about"
5. "Why {strategy} beats {alternative} for {goal}"
6. "{Number} {noun} that will {benefit} instantly"
7. "Unpopular opinion: {contrarian view}. Here's why:"
8. "{Result} in {time}. The exact framework I used:"

#### LinkedIn Templates (5-10)
1. "Most people {common belief}. But {counterpoint}..."
2. "In the past {timeframe}, I've learned {lesson}. Here's the breakdown:"
3. "Here's what nobody tells you about {topic}:"
4. "The {number}-step framework I used to {result}:"
5. "POV: You're {situation}. Here's what to do:"
6. "After {number} years in {industry}, here's my biggest takeaway:"
7. "The {adjective} guide to {topic} (that actually works):"

#### Email Subject Templates (5-10)
1. "{Number} ways to {benefit}"
2. "Your {noun} is {problem}. Here's the fix."
3. "How I {result} in {time} (exact steps)"
4. "The {adjective} guide to {topic}"
5. "Stop {mistake}. Start {solution}."

#### Email Body Templates (5-10)
1. Hook → Value → Bridge → CTA structure
2. Problem → Agitation → Solution → Result framework
3. Story → Lesson → Application format
4. Question → Insight → Action structure
5. Bullet-point benefit list → Single CTA

#### Instagram/TikTok Templates (5-10)
1. **Hook**: "Wait for it..." / Value / CTA
2. **Hook**: "This changed everything..." / Value / CTA
3. **Hook**: "Don't skip this..." / Value / CTA
4. **Hook**: "POV:" / Value / CTA
5. **Hook**: "The secret to..." / Value / CTA

#### Image Prompt Templates (5-10)
1. "Cinematic {style} photo of {subject}, {lighting}, {composition}, HD resolution 1250x555, professional photography, {mood}"
2. "Professional {type} image showing {subject}, {background}, {lighting style}, sharp focus, {color palette}, {mood}"
3. "High-quality {style} photograph of {subject}, {composition rule}, {lighting}, {colors}, professional, 4K quality"

#### Video Prompt Templates (5-10)
1. "Cinematic video of {subject}, {camera movement}, {lighting style}, {duration}, high quality, {mood}, smooth transitions"
2. "Professional video showing {subject}, {camera movement}, {action}, {lighting}, {style}, high quality"
3. "{Style} video of {subject}, {movement}, {lighting}, {duration}, cinematic quality, {mood}"

### Out of Scope
- A/B testing templates
- Template analytics/performance tracking
- Advanced template builder (drag-and-drop)
- Template marketplace/sharing
- Version history for templates
- Multi-language templates

### Success Criteria

**Functional Requirements:**
- ✅ All 9 content types supported with templates
- ✅ 5-10 pre-built viral templates per platform (45-90 total)
- ✅ Users can create custom templates
- ✅ AI generates content strictly following template structure
- ✅ Template constraints enforced
- ✅ Real-time validation and preview
- ✅ Template favorites and search functionality

**Quality Metrics:**
- ✅ Generated content quality improvement
- ✅ Reduction in generation time
- ✅ Consistent formatting across platforms
- ✅ Fewer validation errors

**User Experience:**
- ✅ Intuitive template selection flow
- ✅ Clear template previews with examples
- ✅ Easy custom template creation
- ✅ Fast template search and filtering

**Performance:**
- ✅ Template loading < 500ms
- ✅ Content generation with templates < 5s
- ✅ Validation feedback real-time (< 100ms)

---

## Implementation Phases

### Phase 1: Developer Icons (Quick Win - 2-4 hours)
1. Add developer-icons to project
2. Create centralized icon component
3. Replace all icon references
4. Test visual consistency

### Phase 2: Content Templates System (Main Feature)
1. Database & Backend (Template tables, API routes)
2. AI Integration (template-based generation)
3. Frontend UI (templates page, selection modal, editor)
4. Testing & Polish

---

## Overall Success Criteria
- ✅ Icons: Improved visual appeal across entire app
- ✅ Templates: All content types supported with viral frameworks
- ✅ Both features working seamlessly together
- ✅ User experience enhanced (better visuals + better content quality)