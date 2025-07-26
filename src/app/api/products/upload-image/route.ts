import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  console.log('🚀 UPLOAD API CALLED');
  
  try {
    console.log('🔄 Processing image upload...');
    
    const formData = await request.formData();
    console.log('📋 FormData entries:', Array.from(formData.entries()).map(([key, value]) => [key, typeof value]));
    
    const productId = formData.get('productId') as string;
    const imageFile = formData.get('image') as File;
    
    console.log('📋 Extracted data:', { 
      productId, 
      fileName: imageFile?.name, 
      fileSize: imageFile?.size,
      fileType: imageFile?.type,
      hasFile: !!imageFile
    });
    
    if (!imageFile) {
      console.log('❌ Missing required data');
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    console.log('✅ Image validation passed');

    console.log('✅ Data validation passed');
    
    if (!imageFile.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', imageFile.type);
      return NextResponse.json({ message: 'Only image files are allowed.' }, { status: 400 });
    }

    console.log('☁️ Initializing R2 client...');
    const R2 = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
      },
    });

    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const objectKey = `products/${productId}/${uniqueFileName}`;

    console.log('📤 Uploading to R2:', objectKey);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await R2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME as string,
      Key: objectKey,
      Body: buffer,
      ContentType: imageFile.type,
    }));

    console.log('✅ R2 upload successful!');

    // Construct proper R2 public URL
    const imageUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${objectKey}`;
    console.log('🔗 Image URL:', imageUrl);

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    // Only update database if productId exists (for existing products)
    if (productId) {
      await sql`
        UPDATE products 
        SET image_url = ${imageUrl}, updated_at = NOW()
        WHERE id = ${parseInt(productId)}
      `;
    }

    console.log('✅ Database updated successfully!');

    return NextResponse.json({
      message: 'Image uploaded successfully!',
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({ 
      message: 'Upload failed', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}











