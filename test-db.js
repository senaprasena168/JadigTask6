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

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found in environment variables');
    }
    
    console.log('Testing connection with URL:', process.env.DATABASE_URL.substring(0, 50) + '...');
    
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT version()`;
    console.log('✅ Database connection successful!');
    console.log('PostgreSQL version:', result[0].version);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();

