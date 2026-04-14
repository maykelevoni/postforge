# Task 004: Update Auth Pages with New Icons

## Type
ui

## Description
Replace lucide-react icons in authentication pages (sign-in and register) to complete the icon replacement across the entire app.

## Files
- `app/(auth)/sign-in/page.tsx` (modify)
- `app/(auth)/register/page.tsx` (modify)

## Requirements
1. Remove lucide-react imports from auth pages
2. Import Icon component from components/ui/icon
3. Replace icon usage with Icon component using icon mapping
4. Maintain existing icon sizes and colors
5. Ensure auth forms still look professional

## Existing Code to Reference
- `components/layout/nav-item.tsx` - Pattern for Icon component usage
- `lib/icon-mapping.ts` - Icon name mapping reference

## Acceptance Criteria
- [ ] No lucide-react imports in auth pages
- [ ] Icon component used in both auth pages
- [ ] All icons render correctly in sign-in and register pages
- [ ] Icon sizes and colors match previous appearance
- [ ] Auth pages maintain professional appearance

## Dependencies
- Task 001 (Icon system must exist)
- Task 002 (Pattern established)

## Commit Message
feat: update auth pages to use new icon component system