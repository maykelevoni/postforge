# Technical Implementation Plan: Icons & Templates System

## Overview
Two-phase implementation plan for (1) Developer Icons Integration and (2) Content Templates System. Both features integrate with existing PostForge architecture while maintaining consistency with current patterns.

---

## Phase 1: Developer Icons Integration (Quick Win)

### Architecture Integration

#### Current State Analysis
- **Icon Library**: lucide-react (currently used in 15+ components)
- **Icon Locations**: Sidebar, navigation, dashboard cards, auth pages, buttons
- **Pattern**: Direct imports from lucide-react, inline styling
- **Components Affected**: 15 components across layout, dashboard, and auth

#### Implementation Strategy
**Option A: Replace lucide-react with developer-icons**
- Remove lucide-react dependency
- Add developer-icons package
- Replace all icon imports and usages
- Create wrapper components for consistency

**Option B: Run both libraries in parallel**
- Keep lucide-react for existing icons
- Add developer-icons for new icons
- Gradual migration approach

**Decision**: **Option A** - Complete replacement for visual consistency

### File Changes

#### 1. Package Installation
```bash
pnpm remove lucide-react
pnpm add developer-icons
# OR if not available as package
# Download SVG files and create local icon components
```

#### 2. Create Icon Component System
**New File**: `components/ui/icon.tsx`
```typescript
// Centralized icon component with size and color variants
import { IconName } from 'developer-icons';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 18, color, className }: IconProps) {
  // Implementation based on developer-icons API
}
```

#### 3. Component Updates (15 files)
**Priority Order**:
1. `components/layout/nav-item.tsx` - Navigation icons (highest visibility)
2. `components/layout/sidebar.tsx` - Sidebar structure
3. `components/dashboard/content/content-piece-card.tsx` - Content icons
4. `components/dashboard/promote/promotion-card.tsx` - Promotion icons
5. `components/dashboard/services/service-card.tsx` - Service icons
6. `components/dashboard/discover/app-idea-card.tsx` - Discovery icons
7. `components/dashboard/research/topic-card.tsx` - Research icons
8. `components/dashboard/today/*.tsx` - Today page cards
9. `app/(auth)/sign-in/page.tsx` - Auth icons
10. `app/(auth)/register/page.tsx` - Auth icons

#### 4. Icon Mapping Reference
Create `lib/icon-mapping.ts`:
```typescript
export const iconMap = {
  // Navigation
  home: 'HomeIcon',
  trending: 'TrendingUpIcon',
  sparkles: 'SparklesIcon',
  fileText: 'DocumentIcon',
  megaphone: 'AnnouncementIcon',
  briefcase: 'BriefcaseIcon',
  settings: 'SettingsIcon',

  // Actions
  edit: 'EditIcon',
  delete: 'TrashIcon',
  add: 'PlusIcon',
  remove: 'MinusIcon',
  check: 'CheckIcon',
  x: 'XIcon',

  // Status
  success: 'CheckCircleIcon',
  error: 'XCircleIcon',
  warning: 'AlertTriangleIcon',
  info: 'InfoIcon',

  // Services
  video: 'VideoIcon',
  social: 'ShareIcon',
  newsletter: 'MailIcon',
  landing: 'GlobeIcon',
  strategy: 'LightbulbIcon',
};
```

### Testing Requirements
- Visual regression test for all icon locations
- Responsive design verification (different screen sizes)
- Dark mode compatibility check
- Icon sizing consistency validation
- Performance impact assessment

### Rollback Strategy
- Keep lucide-react in package.json as commented dependency
- Git commit before icon replacement
- Easy rollback via `git revert` if visual issues arise

---

## Phase 2: Content Templates System

### Architecture Integration

#### Current State Analysis
- **Content Generation**: `worker/content/generate.ts` (platform-specific prompts)
- **Media Generation**: `worker/content/media.ts` (image/video prompts)
- **Database**: Prisma v5.20.0, PostgreSQL (Neon)
- **AI Text**: OpenRouter API via `lib/ai.ts`
- **Pattern**: Direct prompt engineering, no template system
- **Platforms**: Twitter, LinkedIn, Reddit, Instagram, TikTok, Email
- **Storage**: ContentPiece and Newsletter models

#### Database Schema Changes

**New Models to Add**:

```prisma
model Template {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  category    String   // "twitter" | "linkedin" | "reddit" | "instagram" | "tiktok" | "email_subject" | "email_body" | "image_prompt" | "video_prompt"
  type        String   @default("custom") // "prebuilt" | "custom"
  template    String   @db.Text  // Template with variables like "{number} ways to {benefit}"
  variables   String   @db.Text  // JSON: variable definitions
  constraints String   @db.Text  // JSON: maxLength, requiredSections, etc.
  example     String?  @db.Text  // Filled example for preview
  isFavorite  Boolean  @default(false)
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  contentPieces         ContentPiece[] @relation("ContentPieceTemplates")
  newsletterSubjects    Newsletter[] @relation("NewsletterSubjectTemplates")
  newsletterBodies      Newsletter[] @relation("NewsletterBodyTemplates")
  generatedContents     GeneratedContent[]

  @@index([userId])
  @@index([category])
  @@map("templates")
}

model GeneratedContent {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  templateId  String
  template    Template     @relation(fields: [templateId], references: [id])
  variables   String       @db.Text  // JSON: filled variables
  generatedAt DateTime     @default(now())

  @@index([userId])
  @@index([templateId])
  @@map("generated_contents")
}
```

**Model Updates**:

```prisma
model ContentPiece {
  // ... existing fields ...
  templateId String?
  template   Template?  @relation("ContentPieceTemplates", fields: [templateId], references: [id])
  variables  String?    @db.Text  // JSON: filled template variables

  @@index([templateId])
}

model Newsletter {
  // ... existing fields ...
  subjectTemplateId String?
  subjectTemplate   Template?  @relation("NewsletterSubjectTemplates", fields: [subjectTemplateId], references: [id])
  bodyTemplateId    String?
  bodyTemplate      Template?  @relation("NewsletterBodyTemplates", fields: [bodyTemplateId], references: [id])
  subjectVariables  String?    @db.Text  // JSON
  bodyVariables     String?    @db.Text  // JSON

  @@index([subjectTemplateId])
  @@index([bodyTemplateId])
}

model User {
  // ... existing fields ...
  templates         Template[]
  generatedContents GeneratedContent[]
}
```

### API Design

#### New API Routes

**Template CRUD**:
- `GET /api/templates` - List templates (filter by category, type, favorites)
- `POST /api/templates` - Create custom template
- `GET /api/templates/[id]` - Get template details
- `PUT /api/templates/[id]` - Update template
- `DELETE /api/templates/[id]` - Delete template

**Template Actions**:
- `POST /api/templates/[id]/favorite` - Toggle favorite
- `POST /api/templates/[id]/use` - Increment usage counter

**Template-based Generation**:
- `POST /api/generate/from-template` - Generate content using template
  - Body: `{ templateId, variables, productInfo, platform }`
  - Returns: `{ content, validation, warnings }`

**Template Previews**:
- `POST /api/templates/[id]/preview` - Generate example from template
- `POST /api/templates/[id]/validate` - Validate template syntax and constraints

#### Existing API Modifications

**Update Content Generation**:
- Modify `worker/content/generate.ts`:
  ```typescript
  export async function generatePostsForPromotion(
    promotionId: string,
    userId: string,
    templateId?: string // NEW: optional template parameter
  ): Promise<void>
  ```

**Update Media Generation**:
- Modify `worker/content/media.ts`:
  ```typescript
  export async function generateMediaForPiece(
    pieceId: string,
    userId: string,
    imageTemplateId?: string, // NEW
    videoTemplateId?: string  // NEW
  ): Promise<void>
  ```

### Frontend Components

#### New Page: `/templates`

**File**: `app/(dashboard)/templates/page.tsx`

**Layout**:
```typescript
<div style={{ display: 'flex', height: '100vh' }}>
  {/* Left sidebar - Platform tabs */}
  <div style={{ width: '240px', backgroundColor: '#111', padding: '24px' }}>
    <PlatformTabs
      categories={['twitter', 'linkedin', 'reddit', 'instagram', 'tiktok', 'email', 'media']}
      selectedCategory={selectedCategory}
      onSelect={setSelectedCategory}
    />
  </div>

  {/* Right content - Template gallery */}
  <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
    <TemplateFilters
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filterType={filterType} // 'all' | 'prebuilt' | 'custom' | 'favorites'
      onFilterChange={setFilterType}
    />

    <TemplateGallery
      templates={filteredTemplates}
      onSelectTemplate={handleSelectTemplate}
      onCreateNew={handleCreateNew}
    />
  </div>
</div>
```

**New Components**:
- `components/dashboard/templates/platform-tabs.tsx`
- `components/dashboard/templates/template-filters.tsx`
- `components/dashboard/templates/template-gallery.tsx`
- `components/dashboard/templates/template-card.tsx`
- `components/dashboard/templates/template-editor.tsx`
- `components/dashboard/templates/template-preview.tsx`

#### Template Selection Modal

**File**: `components/dashboard/templates/template-selection-modal.tsx`

**Usage Context**: When user generates content (Content page, Promote page)

```typescript
interface TemplateSelectionModalProps {
  platform: string;
  onSelectTemplate: (templateId: string) => void;
  onSkip: () => void; // Generate without template
  onClose: () => void;
}
```

#### Enhanced Content Generation Flow

**Modify**: `components/dashboard/content/content-piece-card.tsx`

**Add**: Template selection before generation
```typescript
// Step 1: Platform selection (existing)
// Step 2: Template selection (NEW)
<TemplateSelectionModal
  platform={platform}
  onSelectTemplate={(templateId) => {
    setSelectedTemplate(templateId);
    setShowVariableForm(true);
  }}
  onSkip={() => {
    // Proceed without template
    generateContent();
  }}
/>

// Step 3: Variable confirmation (NEW)
{showVariableForm && selectedTemplate && (
  <VariableForm
    template={selectedTemplate}
    productInfo={promotionInfo}
    aiGeneratedVariables={aiVariables}
    onConfirm={(variables) => {
      generateContentWithTemplate(selectedTemplate.id, variables);
    }}
  />
)}
```

### Service Integration

#### Template Service Layer

**New File**: `lib/templates.ts`

```typescript
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";

export interface TemplateVariable {
  type: 'text' | 'number' | 'ai_generated';
  required: boolean;
  default?: string | number;
  description?: string;
  placeholder?: string;
}

export interface TemplateConstraints {
  maxLength?: number;
  minLength?: number;
  requiredSections?: string[];
  hashtagCount?: string;
  mentionCount?: string;
  customRules?: string[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  type: 'prebuilt' | 'custom';
  template: string;
  variables: Record<string, TemplateVariable>;
  constraints: TemplateConstraints;
  example?: string;
  isFavorite?: boolean;
  usageCount?: number;
}

// Template CRUD functions
export async function getTemplates(userId: string, filters?: {
  category?: string;
  type?: 'prebuilt' | 'custom';
  favorites?: boolean;
}): Promise<Template[]>

export async function getTemplateById(id: string, userId?: string): Promise<Template | null>

export async function createTemplate(userId: string, template: Omit<Template, 'id'>): Promise<Template>

export async function updateTemplate(id: string, userId: string, updates: Partial<Template>): Promise<Template>

export async function deleteTemplate(id: string, userId: string): Promise<void>

export async function toggleTemplateFavorite(id: string, userId: string): Promise<Template>

// Template generation functions
export async function generateFromTemplate(
  template: Template,
  variables: Record<string, string>,
  productInfo: {
    name: string;
    description: string;
    url: string;
  },
  userId: string
): Promise<{
  content: string;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}>

export async function fillTemplateVariables(
  template: Template,
  productInfo: {
    name: string;
    description: string;
    url: string;
  },
  userId: string
): Promise<Record<string, string>>

export async function validateTemplateConstraints(
  content: string,
  template: Template
): Promise<{
  isValid: boolean;
  errors: string[];
  warnings: string[];
}>
```

#### AI Integration

**Modify**: `lib/ai.ts`

```typescript
export interface GenerateFromTemplateOptions {
  template: string;
  variables: Record<string, string>;
  constraints: {
    maxLength?: number;
    requiredSections?: string[];
  };
  productInfo: {
    name: string;
    description: string;
    url: string;
  };
  system?: string;
  userId: string;
}

export async function generateFromTemplate({
  template,
  variables,
  constraints,
  productInfo,
  system = "You are a content generation expert. Follow the template structure exactly.",
  userId,
}: GenerateFromTemplateOptions): Promise<string> {
  // Fill template with variables
  let filledTemplate = template;
  Object.entries(variables).forEach(([key, value]) => {
    filledTemplate = filledTemplate.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });

  // Generate prompt from filled template
  const prompt = `Generate content following this exact template structure:

Template: ${filledTemplate}

Product: ${productInfo.name}
Description: ${productInfo.description}
URL: ${productInfo.url}

Requirements:
- Follow the template structure EXACTLY
- Do not deviate from the template format
- Fill in any remaining placeholders with high-quality content
${constraints.maxLength ? `- Maximum length: ${constraints.maxLength} characters` : ''}
${constraints.requiredSections ? `- Must include: ${constraints.requiredSections.join(', ')}` : ''}`;

  const content = await generateText({
    prompt,
    system,
    userId,
  });

  return content;
}
```

### File Map

#### Phase 1: Developer Icons (11 files)
**New Files**:
- `components/ui/icon.tsx` - Centralized icon component
- `lib/icon-mapping.ts` - Icon name mapping

**Modified Files** (9):
- `components/layout/nav-item.tsx` - Replace lucide-react imports
- `components/layout/sidebar.tsx` - Replace lucide-react imports
- `components/dashboard/content/content-piece-card.tsx` - Replace icons
- `components/dashboard/promote/promotion-card.tsx` - Replace icons
- `components/dashboard/services/service-card.tsx` - Replace icons
- `components/dashboard/discover/app-idea-card.tsx` - Replace icons
- `components/dashboard/research/topic-card.tsx` - Replace icons
- `app/(auth)/sign-in/page.tsx` - Replace icons
- `app/(auth)/register/page.tsx` - Replace icons

#### Phase 2: Content Templates System (25+ files)

**Database** (2 files):
- `prisma/schema.prisma` - Add Template and GeneratedContent models, update existing models
- Create migration: `pnpm dlx "prisma@5.20.0" migrate dev --name add_templates`

**Backend Services** (4 files):
- `lib/templates.ts` - Template service layer (NEW)
- `lib/ai.ts` - Add generateFromTemplate function (MODIFY)
- `worker/content/generate.ts` - Add template parameter (MODIFY)
- `worker/content/media.ts` - Add template parameter (MODIFY)

**API Routes** (7 files):
- `app/api/templates/route.ts` - List/create templates (NEW)
- `app/api/templates/[id]/route.ts` - Template CRUD (NEW)
- `app/api/templates/[id]/favorite/route.ts` - Toggle favorite (NEW)
- `app/api/templates/[id]/use/route.ts` - Track usage (NEW)
- `app/api/templates/[id]/preview/route.ts` - Generate preview (NEW)
- `app/api/templates/[id]/validate/route.ts` - Validate template (NEW)
- `app/api/generate/from-template/route.ts` - Generate from template (NEW)

**Frontend Pages** (1 file):
- `app/(dashboard)/templates/page.tsx` - Templates page (NEW)

**Frontend Components** (10 files):
- `components/dashboard/templates/platform-tabs.tsx` (NEW)
- `components/dashboard/templates/template-filters.tsx` (NEW)
- `components/dashboard/templates/template-gallery.tsx` (NEW)
- `components/dashboard/templates/template-card.tsx` (NEW)
- `components/dashboard/templates/template-editor.tsx` (NEW)
- `components/dashboard/templates/template-preview.tsx` (NEW)
- `components/dashboard/templates/template-selection-modal.tsx` (NEW)
- `components/dashboard/templates/variable-form.tsx` (NEW)
- `components/dashboard/content/content-piece-card.tsx` - Add template selection (MODIFY)
- `components/dashboard/promote/promotion-card.tsx` - Add template selection (MODIFY)

**Database Seeding** (1 file):
- `prisma/seed-templates.ts` - Pre-built viral templates (NEW)

---

## Implementation Order

### Phase 1: Developer Icons (2-4 hours)
1. **Setup** (30 min)
   - Install developer-icons package
   - Create icon component system
   - Create icon mapping reference

2. **Component Updates** (2 hours)
   - Update navigation components (nav-item, sidebar)
   - Update dashboard card components (8 files)
   - Update auth pages (2 files)

3. **Testing & Polish** (1 hour)
   - Visual testing across all pages
   - Responsive design verification
   - Performance check

### Phase 2: Content Templates System (8-12 hours)

**Step 1: Database & Backend** (2 hours)
- Update Prisma schema
- Create migration
- Build template service layer
- Modify AI generation functions

**Step 2: API Routes** (2 hours)
- Template CRUD endpoints
- Template generation endpoints
- Template preview/validation endpoints

**Step 3: Frontend UI** (3 hours)
- Build templates page
- Create template components
- Add template selection to existing flows

**Step 4: Template Seeding** (1 hour)
- Create 45-90 pre-built viral templates
- Seed database with templates

**Step 5: Testing & Integration** (2-4 hours)
- End-to-end testing
- Template validation testing
- Integration with existing content generation
- Performance optimization

---

## Risk Assessment & Mitigation

### Phase 1 Risks
**Risk**: developer-icons package may not have all required icons
**Mitigation**: Check icon availability before starting, fallback to custom SVG icons

**Risk**: Visual inconsistency with new icons
**Mitigation**: Gradual rollout option, test in development first

### Phase 2 Risks
**Risk**: Template complexity may slow down content generation
**Mitigation**: Performance testing, optimize template processing, caching

**Risk**: Users may find templates too restrictive
**Mitigation**: Make templates optional, provide "skip template" option, allow custom templates

**Risk**: AI may not follow template constraints strictly
**Mitigation**: Add validation layer, post-processing to enforce constraints, clear error messages

---

## Success Criteria

### Phase 1: Developer Icons
- ✅ All 15+ components updated with new icons
- ✅ Visual consistency improved across app
- ✅ Zero performance degradation
- ✅ No broken icons or visual bugs
- ✅ Reusable icon component system in place

### Phase 2: Content Templates System
- ✅ Database schema updated and migrated
- ✅ Template CRUD API functional
- ✅ Templates page built and functional
- ✅ 45-90 pre-built viral templates seeded
- ✅ AI generates content using templates
- ✅ Template constraints enforced
- ✅ Real-time validation working
- ✅ Template selection integrated into content generation flow
- ✅ Users can create custom templates
- ✅ Template favorites and search functional

---

## Notes

- **pnpm Version**: Always specify `@5.20.0` for Prisma commands to avoid v7 breaking changes
- **Styling**: Maintain inline styling approach (no Tailwind in JSX)
- **Testing**: Use Playwright for end-to-end tests
- **Performance**: Monitor template generation speed, optimize if > 5s
- **User Feedback**: Collect template performance data for future improvements
- **Extensibility**: Design template system to easily add new content types in future