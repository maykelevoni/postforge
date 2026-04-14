# Task 002: Update Navigation Components with New Icons

## Type
ui

## Description
Replace lucide-react imports with new Icon component in navigation components (nav-item and sidebar). These are the most visible icons in the app.

## Files
- `components/layout/nav-item.tsx` (modify)
- `components/layout/sidebar.tsx` (modify)

## Requirements
1. Remove lucide-react imports from both files
2. Import new Icon component from components/ui/icon
3. Update navItems array to use icon names from icon mapping
4. Update Icon component usage to pass size and color
5. Maintain existing styling and hover effects

## Existing Code to Reference
- `components/layout/nav-item.tsx` - Current navItems array and icon usage
- `lib/icon-mapping.ts` - Icon name mapping reference

## Acceptance Criteria
- [ ] No lucide-react imports in navigation components
- [ ] Icon component imported and used
- [ ] All navigation icons render correctly (home, trending, sparkles, fileText, megaphone, briefcase, settings)
- [ ] Icon size and color match previous appearance
- [ ] Hover effects still work properly
- [ ] No visual regression in sidebar

## Dependencies
- Task 001 (Icon system must exist)

## Commit Message
feat: update navigation components to use new icon component system