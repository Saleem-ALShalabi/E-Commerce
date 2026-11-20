import { defineConfig } from 'prisma/config';

// Prisma 7 does not load .env automatically, so we load it here (Node 22 built-in).
try {
  process.loadEnvFile('.env');
} catch {
  // No .env file (e.g. in CI) – variables come from the real environment.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Not using env() here because it throws when DATABASE_URL is missing, and
    // `prisma generate` (run on `pnpm install`, before you create .env) does not need it.
    url: process.env.DATABASE_URL ?? '',
  },
});
