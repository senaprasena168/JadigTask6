import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm, Files, Fields } from 'formidable';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Helper function to parse formidable multipart form data
const parseForm = (req: NextRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(request: NextRequest) {
  try {
    const { fields, files } = await parseForm(request);

    // Ensure product ID is provided
    const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId;
    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required.' }, { status: 400 });
    }

    // Ensure an image file is provided
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    if (!imageFile) {
      return NextResponse.json({ message: 'Image file is required.' }, { status: 400 });
    }

    // Basic validation for image type
    if (!imageFile.mimetype || !imageFile.mimetype.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files are allowed.' }, { status: 400 });
    }

    // Initialize S3 Client for Cloudflare R2
    const R2 = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string,
      },
    });

    // Generate a unique filename for R2
    const fileExtension = path.extname(imageFile.originalFilename || '');
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const objectKey = `products/${productId}/${uniqueFileName}`;

    // Read the file stream from the temporary location
    const fileStream = fs.createReadStream(imageFile.filepath);

    // Upload to Cloudflare R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME as string,
      Key: objectKey,
      Body: fileStream,
      ContentType: imageFile.mimetype,
    });

    await R2.send(uploadCommand);

    // Construct the public URL for the image
    const imageUrl = `${process.env.CLOUDFLARE_R2_ENDPOINT}/${objectKey}`;

    // Update the product in Neon database via Drizzle
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL!);
    
    const updatedProduct = await sql`
      UPDATE products 
      SET image_url = ${imageUrl}, updated_at = NOW()
      WHERE id = ${parseInt(productId)}
      RETURNING *
    `;

    // Clean up the temporary file
    fs.unlink(imageFile.filepath, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    return NextResponse.json({
      message: 'Image uploaded and linked successfully!',
      imageUrl: imageUrl,
      product: updatedProduct[0],
    });

  } catch (error) {
    console.error('Image upload API error:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}