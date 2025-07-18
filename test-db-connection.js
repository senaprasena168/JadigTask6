const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

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

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic query
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result[0].current_time);
    
    // Check products table
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    console.log('✅ Products table accessible. Count:', products[0].count);
    
    // Get sample products
    const sampleProducts = await sql`SELECT * FROM products LIMIT 3`;
    console.log('✅ Sample products:', sampleProducts);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();