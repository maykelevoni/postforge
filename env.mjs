import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

// Server-side only: validate required vars (skip during next build)
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
if (typeof window === 'undefined' && !isBuild) {
  z.object({
    DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
    AUTH_SECRET: z.string().min(1, 'AUTH_SECRET is required'),
    NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  }).parse(process.env);
}

export const env = envSchema.parse(process.env);
