# Task 003: Update Dashboard Card Components with New Icons

## Type
ui

## Description
Replace lucide-react icons in all dashboard card components (content, promote, services, discover, research, today pages).

## Files
- `components/dashboard/content/content-piece-card.tsx` (modify)
- `components/dashboard/promote/promotion-card.tsx` (modify)
- `components/dashboard/services/service-card.tsx` (modify)
- `components/dashboard/discover/app-idea-card.tsx` (modify)
- `components/dashboard/research/topic-card.tsx` (modify)
- `components/dashboard/today/queue-card.tsx` (modify)
- `components/dashboard/today/research-feed.tsx` (modify)
- `components/dashboard/today/promotion-card.tsx` (modify)

## Requirements
1. Remove lucide-react imports from all dashboard card components
2. Import Icon component from components/ui/icon
3. Replace icon usage with Icon component using icon mapping
4. Maintain existing icon sizes and colors
5. Test all dashboard pages for visual consistency

## Existing Code to Reference
- `lib/icon-mapping.ts` - Icon name mapping reference
- `components/layout/nav-item.tsx` - Pattern for Icon component usage

## Acceptance Criteria
- [ ] No lucide-react imports in dashboard card components
- [ ] Icon component used in all 8 card files
- [ ] All icons render correctly across dashboard pages
- [ ] Icon sizes and colors match previous appearance
- [ ] No visual regression in any dashboard page

## Dependencies
- Task 001 (Icon system must exist)
- Task 002 (Navigation pattern established)

## Commit Message
feat: update dashboard card components to use new icon component system