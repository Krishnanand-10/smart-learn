import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global;

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL || '';
  const isPostgres = databaseUrl.startsWith('postgres:') || databaseUrl.startsWith('postgresql:');

  if (isPostgres) {
    // PostgreSQL database connection (Supabase) is handled natively by Prisma Client
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  } else {
    // Local SQLite database connection uses better-sqlite3 driver adapter
    const adapter = new PrismaBetterSqlite3({
      url: databaseUrl || 'file:./prisma/dev.db',
    });
    return new PrismaClient({
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
