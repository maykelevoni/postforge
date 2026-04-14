# Task 015: Create Database Seeding Script for Pre-built Templates

## Type

## Description
Create prisma/seed-templates.ts script to populate database with 45-90 pre-built viral templates across all 9 content categories.

## Files
- `prisma/seed-templates.ts` (create)

## Requirements
1. Create seeding script with pre-built viral templates
2. Include 5-10 templates per category (Twitter, LinkedIn, Reddit, Instagram, TikTok, Email Subject, Email Body, Image Prompt, Video Prompt)
3. Each template should have: name, category, type ("prebuilt"), template string, variables, constraints, example
4. Templates must use proven viral copywriting frameworks
5. Include specific viral templates from spec (e.g., "X ways to {benefit} without {pain}")
6. Script should handle duplicate prevention
7. Script should provide clear output on what was seeded
8. Follow template data structure from schema
9. Include proper error handling

## Existing Code to Reference
- `lib/seeds.ts` - Pattern for database seeding
- Spec - Pre-built viral templates list
- Technical plan - Template examples

## Acceptance Criteria
- [ ] prisma/seed-templates.ts created
- [ ] Script includes 45-90 pre-built templates
- [ ] All 9 categories covered (5-10 templates each)
- [ ] Templates follow viral copywriting frameworks
- [ ] Each template has required fields (name, category, template, variables, constraints, example)
- [ ] Script handles duplicates appropriately
- [ ] Script provides clear output
- [ ] Error handling implemented
- [ ] Templates use proper variable syntax
- [ ] Script can be run successfully

## Dependencies
- Task 012 (Worker updates complete)

## Commit Message
feat: create database seeding script for pre-built viral templates