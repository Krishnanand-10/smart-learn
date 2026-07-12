import { defineConfig, env } from 'prisma/config';
import dotenv from 'dotenv';

// Load variables from .env.local for Prisma CLI
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
