-- Sample data for testing Services feature
-- Run this in your database query tool or Prisma Studio

-- First, find the user ID for test@postforge.dev
-- SELECT id, email FROM users WHERE email = 'test@postforge.dev';

-- Replace USER_ID below with the actual ID from the query above

-- Sample Service
INSERT INTO services (id, "userId", name, description, type, deliverables, "priceMin", "priceMax", "turnaroundDays", "funnelUrl", status, "createdAt", "updatedAt")
VALUES
  ('sample-service-1', 'USER_ID_HERE', 'Minecraft Video Scripts', 'I create engaging video scripts and thumbnails for Minecraft creators', 'video_content', 'Generate 10 video scripts tailored for [niche] content, plus thumbnail prompts and captions for each video.', 97.00, 197.00, 3, 'https://systeme.io/minecraft-scripts-funnel', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Sample Tickets
INSERT INTO "service_tickets" (id, "userId", "serviceId", "clientName", "clientEmail", niche, message, status, quote, "quoteSentAt", deliverables, "deliveredAt", "createdAt", "updatedAt")
VALUES
  ('ticket-new-1', 'USER_ID_HERE', 'sample-service-1', 'John Smith', 'john@example.com', 'Minecraft tutorials', 'I need video scripts for my Minecraft tutorial channel. I focus on beginner-friendly content.', 'new', NULL, NULL, NULL, NULL, NOW(), NOW()),
  ('ticket-quoted-1', 'USER_ID_HERE', 'sample-service-1', 'Sarah Johnson', 'sarah@example.com', 'Minecraft mods', 'Looking for someone to write scripts about the latest Minecraft mods. I post 3x per week.', 'quoted', 'Hi Sarah! I''d love to help you with your Minecraft mod content. Based on your needs, I can provide 10 video scripts per month focusing on the latest and most popular mods.', NOW(), NULL, NULL, NOW(), NOW()),
  ('ticket-progress-1', 'USER_ID_HERE', 'sample-service-1', 'Mike Chen', 'mike@example.com', 'Minecraft building', 'Need scripts for Minecraft building tutorials and showcases.', 'in_progress', NULL, NULL, NULL, NULL, NOW(), NOW()),
  ('ticket-delivered-1', 'USER_ID_HERE', 'sample-service-1', 'Emily Davis', 'emily@example.com', 'Minecraft survival', 'I need survival tips and tricks content for my YouTube channel.', 'delivered', NULL, NULL, '{"generated":"Here are your 10 Minecraft survival video scripts: 1. \"5 Essential Survival Tips for Beginners\" 2. \"How to Find Diamonds Fast\" 3. \"Building Your First Shelter\"...","generatedAt":"2026-04-14T12:00:00Z"}', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;