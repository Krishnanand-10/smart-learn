require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

async function test() {
  try {
    console.log('DATABASE_URL from env:', process.env.DATABASE_URL);
    console.log('Creating PrismaBetterSqlite3 adapter...');
    
    // Pass the config object with 'url' directly to the adapter
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL
    });

    console.log('Instantiating PrismaClient...');
    const prisma = new PrismaClient({ adapter });
    
    console.log('Connecting and querying...');
    const count = await prisma.user.count();
    console.log('Success! Users count:', count);
    await prisma.$disconnect();
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
