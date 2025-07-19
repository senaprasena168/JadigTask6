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

async function testAPI() {
  try {
    console.log('Testing direct database query...');
    const sql = neon(process.env.DATABASE_URL);
    
    const products = await sql`
      SELECT * FROM products 
      ORDER BY created_at DESC
    `;
    
    console.log('✅ Direct query successful!');
    console.log('Products found:', products.length);
    console.log('Products:', products);
    
    // Test the exact same query the API uses
    console.log('\n--- Testing API-style query ---');
    const apiStyleQuery = await sql`
      SELECT id, name, price, description, image, created_at, updated_at 
      FROM products 
      ORDER BY created_at DESC
    `;
    
    console.log('API-style query result:', apiStyleQuery);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPI();