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

async function migrateExistingImages() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
    // Get all products with image paths
    const products = await sql`
      SELECT id, name, image 
      FROM products 
      WHERE image IS NOT NULL 
      AND image_data IS NULL
    `;
    
    console.log(`Found ${products.length} products with image paths to migrate...`);
    
    for (const product of products) {
      try {
        // Convert image path to file system path
        const imagePath = path.join(process.cwd(), 'public', product.image);
        
        if (fs.existsSync(imagePath)) {
          // Read the image file
          const imageBuffer = fs.readFileSync(imagePath);
          
          // Determine MIME type based on file extension
          const ext = path.extname(product.image).toLowerCase();
          let mimeType = 'image/jpeg';
          if (ext === '.png') mimeType = 'image/png';
          if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
          
          // Update the database with binary data
          await sql`
            UPDATE products 
            SET image_data = ${imageBuffer}, 
                image_type = ${mimeType},
                image = NULL
            WHERE id = ${product.id}
          `;
          
          console.log(`✅ Migrated: ${product.name} (${product.image})`);
        } else {
          console.log(`⚠️  Image not found: ${imagePath}`);
        }
      } catch (error) {
        console.error(`❌ Error migrating ${product.name}:`, error.message);
      }
    }
    
    console.log('🎉 Migration completed!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateExistingImages();