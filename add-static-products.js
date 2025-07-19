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

async function addStaticProducts() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Clear existing products first
    await sql`DELETE FROM products`;
    console.log('🗑️ Cleared existing products');
    
    // The 3 products with static images
    const products = [
      {
        name: 'Professional Microphone',
        price: '99.99',
        description: 'High-quality professional microphone for recording and streaming',
        image: '/products/mic.jpg'
      },
      {
        name: 'Quality Roll Product',
        price: '79.99', 
        description: 'Premium quality roll product for all your needs',
        image: '/products/roll.jpg'
      },
      {
        name: 'Stylish Tail Product',
        price: '149.99',
        description: 'Elegant and stylish tail product with premium design',
        image: '/products/tail.jpg'
      }
    ];

    console.log('Adding static products to database...');
    
    for (const product of products) {
      const result = await sql`
        INSERT INTO products (name, price, description, image)
        VALUES (${product.name}, ${product.price}, ${product.description}, ${product.image})
        RETURNING *
      `;
      
      console.log('✅ Added:', result[0].name);
    }
    
    console.log('🎉 All static products added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding static products:', error);
  }
}

addStaticProducts();

