import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration missing'
      }, { status: 500 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to base64 for text storage
    const base64Data = buffer.toString('base64');
    
    // Create temporary product record with image data
    const result = await sql`
      INSERT INTO products (name, price, description, image_data, image_type)
      VALUES ('temp', 0, 'temp', ${base64Data}, ${file.type})
      RETURNING id
    `;
    
    return NextResponse.json({
      success: true,
      imageId: result[0].id,
      url: `/api/images/${result[0].id}`
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image'
    }, { status: 500 });
  }
}



