import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import starSvg from '@/public/star.svg';
import { ProductWithCateAndPrimaryImg } from '@/types/products';
import { formatCurrency, getDateInPast } from '@/lib/helpers';
import { NUM_DAYS_PRODUCT_NEW } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { getNumProductsSold } from '@/services/products';
import { getAverageRating } from '@/services/reviews';

interface ProdCardProps {
  prod: ProductWithCateAndPrimaryImg;
  className?: string;
}

const ProdCard = async ({ prod, className }: ProdCardProps) => {
  const numSold = await getNumProductsSold(prod.id);
  const avgRating = await getAverageRating(prod.id);

  return (
    <Link href={`/products/${prod.slug}`}>
      <Card className={cn('border-0 rounded-none p-2 gap-y-2 shadow-md hover:shadow-lg transition-shadow', className)}>
        <CardHeader className='p-0 gap-0'>
          <figure className='relative h-[150px] md:h-[200px]'>
            <Image
              src={prod.productImages[0].imageUrl}
              alt={prod.productImages[0].altText}
              width={200}
              height={200}
              className='object-cover absolute inset-0 w-full h-full'
            />
            {prod.createdAt >= getDateInPast(NUM_DAYS_PRODUCT_NEW) && (
              <div className='flex py-1 px-2 items-center justify-center bg-home-popup absolute text-xs italic font-medium top-0 left-0'>
                New
              </div>
            )}
          </figure>
        </CardHeader>
        <CardContent className='p-0 flex flex-col gap-y-2 capitalize'>
          <span className='flex items-end justify-between w-full text-xs text-home-foreground gap-x-2'>
            <span className='truncate'>{prod.category.name}</span>
          </span>
          <h2 className='text-base font-medium truncate leading-none'>{prod.name}</h2>
          <div className='flex flex-col gap-y-2 items-start text-xs leading-none'>
            <span className='font-bold text-primary text-base leading-none'>
              {formatCurrency('VND', prod.regularPrice)}
            </span>
            <div className='flex items-center font-medium gap-x-1'>
              <span className='flex items-center gap-x-0.5'>
                <Image src={starSvg} alt='star' className='size-4' />
                {avgRating.toFixed(1)}
              </span>
              |<span>Sold {numSold}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProdCard;
