import { getAllFilteredProducts } from '@/services/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(res: NextRequest) {
  try {
    const query = res.nextUrl.searchParams.get('query');
    const { products } = await getAllFilteredProducts({ query: query || '' });

    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
