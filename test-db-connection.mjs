import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: resolve(__dirname, '.env.local') });

console.log('Testing database connection...');
console.log('POSTGRES_URL exists:', !!process.env.POSTGRES_URL);
console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);

try {
  const result = await sql`SELECT NOW() as current_time`;
  console.log('✅ Database connection successful!');
  console.log('Current time from database:', result.rows[0].current_time);

  // Test products table
  const productsTest = await sql`SELECT COUNT(*) as count FROM products`;
  console.log('✅ Products table exists with', productsTest.rows[0].count, 'records');

  // Test categories table
  const categoriesTest = await sql`SELECT COUNT(*) as count FROM categories`;
  console.log('✅ Categories table exists with', categoriesTest.rows[0].count, 'records');

  process.exit(0);
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
  console.error('Full error:', error);
  process.exit(1);
}
