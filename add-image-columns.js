const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load .env
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

async function addImageColumns() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Add new columns for binary image storage
    await sql`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS image_data BYTEA,
      ADD COLUMN IF NOT EXISTS image_type VARCHAR(50)
    `;
    
    console.log('✅ Image columns added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding image columns:', error);
  }
}

addImageColumns();