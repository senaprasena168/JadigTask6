import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration missing'
      }, { status: 500 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    
    // Select only necessary fields, exclude binary image_data
    const products = await sql`
      SELECT id, name, price, description, created_at, updated_at, image_url,
             CASE WHEN image_data IS NOT NULL THEN true ELSE false END as has_image
      FROM products 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'Database configuration error'
      }, { status: 500 });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const body = await request.json();
    const { name, price, image, description, imageId } = body;

    if (!name || !price) {
      return NextResponse.json({ 
        success: false,
        error: 'Name and price are required' 
      }, { status: 400 });
    }

    let newProduct;
    
    if (imageId) {
      // Update the temporary record created during image upload
      newProduct = await sql`
        UPDATE products 
        SET name = ${name}, price = ${price}, description = ${description || null}
        WHERE id = ${imageId}
        RETURNING *
      `;
    } else {
      // Create new product with image URL (for existing images)
      newProduct = await sql`
        INSERT INTO products (name, price, image, description)
        VALUES (${name}, ${price}, ${image || null}, ${description || null})
        RETURNING *
      `;
    }

    return NextResponse.json({
      success: true,
      data: newProduct[0],
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}
