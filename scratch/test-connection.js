const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('Attempting to connect to SQLite database...');
    // Query the users count to verify connection
    const count = await prisma.user.count();
    console.log('Success! Users count in database:', count);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
