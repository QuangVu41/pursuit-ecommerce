import { getPopularProducts } from '@/services/products';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { formatCurrency } from '@/lib/helpers';
import Link from 'next/link';

interface PopularProdStatProps {
  searchParams: { [key: string]: string };
}

const PopularProdStat = async ({ searchParams }: PopularProdStatProps) => {
  const products = await getPopularProducts(searchParams);

  return (
    <Card className='xl:col-span-3 row-span-2 gap-4 lg:col-span-6 col-span-12'>
      <CardHeader>
        <CardTitle>Popular Products</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 px-4'>
        {products.map((prod) => (
          <div key={prod.id} className='flex items-start justify-between border rounded-md p-2'>
            <div className='flex items-start gap-2'>
              <figure className='size-12 relative'>
                <Image
                  src={prod.productImages[0].imageUrl}
                  alt={prod.productImages[0].altText}
                  width={48}
                  height={48}
                  className='absolute inset-0 w-full h-full object-cover rounded-sm'
                />
              </figure>
              <div className='flex flex-col items-start gap-1'>
                <Link
                  href={`/products/${prod.slug}`}
                  className='text-xs text-primary hover:underline font-manrope w-24 truncate'
                >
                  {prod.name}
                </Link>
              </div>
            </div>
            <Badge variant='outline' className='border-green-500 bg-green-500/10 text-green-500 font-manrope'>
              {formatCurrency('VND', prod.regularPrice)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PopularProdStat;
