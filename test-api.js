const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Simple .env file reader
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    console.error('Could not load .env file:', error.message);
  }
}

loadEnv();

async function testAPI() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    console.log('Testing database connection...');
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic connection
    const version = await sql`SELECT version()`;
    console.log('✅ Database connected:', version[0].version.substring(0, 50) + '...');
    
    // Check if products table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'products'
      );
    `;
    
    console.log('Products table exists:', tableExists[0].exists);
    
    if (tableExists[0].exists) {
      // Try to fetch products
      const products = await sql`SELECT * FROM products ORDER BY created_at DESC LIMIT 5`;
      console.log('Products found:', products.length);
      console.log('Sample products:', products);
    } else {
      console.log('❌ Products table does not exist. Run migrations first.');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
}

testAPI();

