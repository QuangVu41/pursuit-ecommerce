import { getAllCategoriesWithNoParent } from '@/services/categories';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const categories = await getAllCategoriesWithNoParent(id);

    if (!categories) return NextResponse.json({ error: 'No categories found' }, { status: 404 });

    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
