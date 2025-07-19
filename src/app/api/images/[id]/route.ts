import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    if (!process.env.DATABASE_URL) {
      return new NextResponse('Database not configured', { status: 500 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // Try to get image from database
    const result = await sql`
      SELECT image_data, image_type 
      FROM products 
      WHERE id = ${parseInt(id)}
    `;
    
    if (result.length === 0) {
      return new NextResponse('Product not found', { status: 404 });
    }
    
    const { image_data, image_type } = result[0];
    
    // If product has image data, serve it
    if (image_data) {
      return new NextResponse(image_data, {
        headers: {
          'Content-Type': image_type || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }
    
    // If no image data, serve placeholder
    try {
      const placeholderPath = join(process.cwd(), 'public', 'nopic.jpg');
      const placeholderBuffer = await readFile(placeholderPath);
      
      return new NextResponse(placeholderBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=86400', // Cache placeholder for 1 day
        },
      });
    } catch (placeholderError) {
      console.error('Placeholder image not found:', placeholderError);
      return new NextResponse('No image available', { status: 404 });
    }
    
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
}
