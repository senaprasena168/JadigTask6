const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env.local');
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

async function addImageUrlColumn() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Add image_url column if it doesn't exist
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `;
    
    console.log('✅ Added image_url column to products table');
    
  } catch (error) {
    console.error('❌ Error adding column:', error);
  }
}

addImageUrlColumn();