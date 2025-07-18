import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if we can connect to database
    const { neon } = await import('@neondatabase/serverless');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not found');
    }
    
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT COUNT(*) as count FROM products`;
    
    return NextResponse.json({ 
      success: true, 
      productCount: result[0].count,
      message: 'Database connection successful'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}