import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/products';

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProduct = addProduct({
    name: body.name,
    price: body.price,
    image: body.image
  });
  
  return NextResponse.json(newProduct, { status: 201 });
}
