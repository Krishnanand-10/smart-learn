import fs from 'fs';
import { execSync } from 'child_process';

const schemaPath = 'prisma/schema.prisma';
const backupPath = 'prisma/schema.prisma.bak';

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)["']?/m);
    if (match) {
      return match[1];
    }
  }
  return '';
}

try {
  const databaseUrl = getDatabaseUrl();
  const isPostgres = databaseUrl.startsWith('postgres:') || databaseUrl.startsWith('postgresql:');
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  console.log(`[prisma-setup] Database URL detected. Target provider: ${targetProvider}`);

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  fs.writeFileSync(backupPath, schemaContent, 'utf8');

  const updatedSchemaContent = schemaContent.replace(
    /datasource db \{[\s\S]*?provider\s*=\s*"([^"]+)"/,
    (match, p1) => {
      return match.replace(`provider = "${p1}"`, `provider = "${targetProvider}"`);
    }
  );

  fs.writeFileSync(schemaPath, updatedSchemaContent, 'utf8');
  console.log(`[prisma-setup] Dynamically set schema provider to "${targetProvider}". Generating client...`);

  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('[prisma-setup] Prisma client generated successfully.');
} catch (error) {
  console.error('[prisma-setup] Error during setup:', error);
  process.exit(1);
} finally {
  if (fs.existsSync(backupPath)) {
    fs.writeFileSync(schemaPath, fs.readFileSync(backupPath, 'utf8'), 'utf8');
    fs.unlinkSync(backupPath);
    console.log('[prisma-setup] Restored original schema provider configuration in schema.prisma.');
  }
}
