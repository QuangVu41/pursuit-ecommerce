import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import starSvg from '@/public/star.svg';
import { ProductWithCateAndImg } from '@/types/products';
import { formatCurrency, getDateInPast } from '@/lib/helpers';
import { NUM_DAYS_PRODUCT_NEW } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProdCardProps {
  prod: ProductWithCateAndImg;
  className?: string;
}

const ProdCard = ({ prod, className }: ProdCardProps) => {
  return (
    <Link href={`/products/${prod.slug}`}>
      <Card className={cn('border-0 rounded-none p-2 gap-y-2 shadow-md hover:shadow-lg transition-shadow', className)}>
        <CardHeader className='p-0 gap-0'>
          <figure className='group/prod-img relative w-full h-[150px] md:h-[200px]'>
            <Image
              src={prod.productImages[0].imageUrl}
              alt={prod.productImages[0].altText}
              fill
              className='object-cover'
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
            <Heart className='size-5 stroke-foreground hover:fill-destructive hover:stroke-destructive transition-colors cursor-pointer' />
          </span>
          <h2 className='text-base font-medium truncate leading-none'>{prod.name}</h2>
          <div className='flex flex-col gap-y-2 items-start text-xs leading-none'>
            <span className='font-bold text-primary text-base leading-none'>
              {formatCurrency('VND', prod.regularPrice)}
            </span>
            <div className='flex items-center font-medium gap-x-1'>
              <span className='flex items-center gap-x-0.5'>
                <Image src={starSvg} alt='star' className='size-4' />0
              </span>
              |<span>Sold 0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProdCard;
