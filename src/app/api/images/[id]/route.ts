import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Add await here
    
    if (!process.env.DATABASE_URL) {
      return new NextResponse('Database configuration missing', { status: 500 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql`
      SELECT image_data, image_type 
      FROM products 
      WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      return new NextResponse('Product not found', { status: 404 });
    }
    
    const { image_data, image_type } = result[0];
    
    if (image_data) {
      try {
        const imageBuffer = Buffer.from(image_data, 'base64');
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': image_type || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      } catch (error) {
        console.error('Error processing image data:', error);
        return new NextResponse('Invalid image data', { status: 500 });
      }
    }
    
    return new NextResponse('No image data', { status: 404 });
    
  } catch (error) {
    console.error('Image API error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}








