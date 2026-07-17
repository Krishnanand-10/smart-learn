import { PrismaClient } from '@prisma/client';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const globalForPrisma = global;

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL || '';
  const isPostgres = databaseUrl.startsWith('postgres:') || databaseUrl.startsWith('postgresql:');

  if (isPostgres) {
    // PostgreSQL database connection (Supabase) using PG Driver Adapter
    const pg = require('pg');
    const { PrismaPg } = require('@prisma/adapter-pg');
    
    const pool = new pg.Pool({
      connectionString: databaseUrl,
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  } else {
    // Local SQLite database connection uses better-sqlite3 driver adapter
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
    
    const adapter = new PrismaBetterSqlite3({
      url: databaseUrl || 'file:./prisma/dev.db',
    });
    return new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
};

let prismaInstance = null;

// Lazy initialize Prisma client using Proxy to avoid loading native binaries during build-time compilation
export const prisma = new Proxy({}, {
  get(target, prop) {
    if (prop === 'then') return undefined; // Avoid promise resolution check loop
    if (!prismaInstance) {
      prismaInstance = globalForPrisma.prisma || createPrismaClient();
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = prismaInstance;
      }
    }
    return prismaInstance[prop];
  }
});
