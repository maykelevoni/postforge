# Task 001: Install Developer Icons & Create Icon System

## Type

## Description
Install developer-icons package and create centralized icon component system to replace lucide-react. This establishes the foundation for icon updates across the entire app.

## Files
- `package.json` (modify)
- `components/ui/icon.tsx` (create)
- `lib/icon-mapping.ts` (create)

## Requirements
1. Remove lucide-react dependency from package.json
2. Install developer-icons package (or equivalent)
3. Create centralized Icon component that wraps developer-icons
4. Create icon mapping reference for consistent icon usage
5. Support size and color props for flexibility

## Existing Code to Reference
- `components/layout/nav-item.tsx` - Current lucide-react usage pattern
- `components/layout/sidebar.tsx` - Current icon styling approach

## Acceptance Criteria
- [ ] lucide-react removed from package.json
- [ ] developer-icons package installed
- [ ] Icon component created in components/ui/icon.tsx
- [ ] Icon mapping created in lib/icon-mapping.ts
- [ ] Icon component supports size and color props
- [ ] Icon mapping covers all current icon usages (home, trending, sparkles, etc.)

## Dependencies
- None

## Commit Message
feat: install developer-icons and create centralized icon component system