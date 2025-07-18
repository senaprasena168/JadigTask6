const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load .env
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

async function addTestProduct() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`
      INSERT INTO products (name, price, description, image)
      VALUES ('Test Product', '19.99', 'This is a test product', 'https://via.placeholder.com/300')
      RETURNING *
    `;
    
    console.log('✅ Test product added:', result[0]);
  } catch (error) {
    console.error('❌ Error adding test product:', error);
  }
}

addTestProduct();