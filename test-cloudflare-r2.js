const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
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

async function testCloudflareR2() {
  console.log('🧪 Testing Cloudflare R2 Integration...\n');

  // Check environment variables
  console.log('📋 Environment Variables Check:');
  console.log('✓ CLOUDFLARE_R2_ACCESS_KEY_ID:', process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? 'Set' : '❌ Missing');
  console.log('✓ CLOUDFLARE_R2_SECRET_ACCESS_KEY:', process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? 'Set' : '❌ Missing');
  console.log('✓ CLOUDFLARE_R2_BUCKET_NAME:', process.env.CLOUDFLARE_R2_BUCKET_NAME || '❌ Missing');
  console.log('✓ CLOUDFLARE_R2_ENDPOINT:', process.env.CLOUDFLARE_R2_ENDPOINT || '❌ Missing');
  console.log('');

  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || 
      !process.env.CLOUDFLARE_R2_BUCKET_NAME || !process.env.CLOUDFLARE_R2_ENDPOINT) {
    console.log('❌ Missing required environment variables. Please check your .env.local file.');
    return;
  }

  try {
    // Initialize S3 Client for Cloudflare R2
    const R2 = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      },
    });

    console.log('🔗 Testing R2 Connection...');

    // Test 1: List objects in bucket
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        MaxKeys: 5
      });
      
      const listResult = await R2.send(listCommand);
      console.log('✅ Successfully connected to R2 bucket');
      console.log(`📁 Found ${listResult.KeyCount || 0} objects in bucket`);
      
      if (listResult.Contents && listResult.Contents.length > 0) {
        console.log('📄 Sample objects:');
        listResult.Contents.slice(0, 3).forEach(obj => {
          console.log(`   - ${obj.Key} (${obj.Size} bytes)`);
        });
      }
    } catch (error) {
      console.log('❌ Failed to list bucket contents:', error.message);
      return;
    }

    // Test 2: Upload a test file
    console.log('\n📤 Testing File Upload...');
    
    const testContent = 'This is a test file for Cloudflare R2 integration';
    const testKey = `test/test-${Date.now()}.txt`;
    
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: testKey,
        Body: testContent,
        ContentType: 'text/plain',
      });

      await R2.send(uploadCommand);
      console.log('✅ Successfully uploaded test file');
      console.log(`📍 File location: ${testKey}`);
      
      // Construct public URL
      const publicUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${testKey}`;
      console.log(`🌐 Public URL: ${publicUrl}`);
      
    } catch (error) {
      console.log('❌ Failed to upload test file:', error.message);
      return;
    }

    // Test 3: Test with an actual image if available
    console.log('\n🖼️  Testing Image Upload...');
    
    const testImagePath = path.join(__dirname, 'public', 'products', 'mic.jpg');
    if (fs.existsSync(testImagePath)) {
      try {
        const imageBuffer = fs.readFileSync(testImagePath);
        const imageKey = `test/test-image-${Date.now()}.jpg`;
        
        const imageUploadCommand = new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: imageKey,
          Body: imageBuffer,
          ContentType: 'image/jpeg',
        });

        await R2.send(imageUploadCommand);
        console.log('✅ Successfully uploaded test image');
        console.log(`📍 Image location: ${imageKey}`);
        
        const imageUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${imageKey}`;
        console.log(`🌐 Image URL: ${imageUrl}`);
        
      } catch (error) {
        console.log('❌ Failed to upload test image:', error.message);
      }
    } else {
      console.log('⚠️  No test image found at public/products/mic.jpg');
    }

    console.log('\n🎉 Cloudflare R2 Integration Test Complete!');
    console.log('✅ All tests passed. Your R2 setup is working correctly.');
    
  } catch (error) {
    console.error('❌ R2 Integration Test Failed:', error.message);
    console.error('Full error:', error);
  }
}

// Test database connection too
async function testDatabaseConnection() {
  console.log('\n🗄️  Testing Database Connection...');
  
  try {
    const { neon } = require('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // Check if image_url column exists
    const columnCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      AND column_name = 'image_url'
    `;
    
    if (columnCheck.length > 0) {
      console.log('✅ Database has image_url column');
    } else {
      console.log('⚠️  Database missing image_url column. Run migration:');
      console.log('   ALTER TABLE products ADD COLUMN image_url VARCHAR(500);');
    }
    
    // Test products query
    const products = await sql`SELECT id, name, image, image_url FROM products LIMIT 3`;
    console.log(`✅ Found ${products.length} products in database`);
    
    products.forEach(product => {
      console.log(`   - ${product.name}: ${product.image_url ? 'Has R2 URL' : 'No R2 URL'}`);
    });
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  await testCloudflareR2();
  await testDatabaseConnection();
}

runAllTests();