import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== API PRODUCTS GET START ===');
    
    const { db } = await import('@/lib/db');
    const { products } = await import('@/lib/schema');
    const { desc } = await import('drizzle-orm');
    
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    
    return NextResponse.json({
      success: true,
      data: allProducts,
      count: allProducts.length
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, image, description } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const newProduct = await db.insert(products).values({
      name,
      price: price.toString(),
      image: image || null,
      description: description || null,
    }).returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
