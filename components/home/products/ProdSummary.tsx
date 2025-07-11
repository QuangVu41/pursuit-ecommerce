import { ProductWithPayLoad } from '@/types/products';
import starSvg from '@/public/star.svg';
import Image from 'next/image';
import ProdSummaryVariant from '@/components/home/products/ProdSummaryVariant';
import ProdInputQty from '@/components/home/products/ProdInputQty';
import ProdPrice from '@/components/home/products/ProdPrice';
import ProdVariantWrapper from '@/components/home/products/ProdVariantWrapper';
import { getNumProductsSold } from '@/services/products';
import { getAverageRating, getNumReviews } from '@/services/reviews';

interface ProdSummaryProps {
  prod: ProductWithPayLoad;
}

const ProdSummary = async ({ prod }: ProdSummaryProps) => {
  const numSold = await getNumProductsSold(prod.id);
  const numReviews = await getNumReviews(prod.id);
  const avgRating = await getAverageRating(prod.id);

  return (
    <div className='flex flex-col flex-1 gap-y-3 w-full'>
      <h1 className='text-2xl font-medium capitalize'>{prod.name}</h1>
      <div className='flex items-center gap-x-3 font-medium'>
        <span className='flex items-center gap-x-0.5'>
          <Image src={starSvg} alt='star' className='size-4' />
          {avgRating.toFixed(1)}
        </span>
        |<span>{numSold} Sold</span>|
        <span>
          {numReviews} Review{numReviews > 1 ? 's' : ''}
        </span>
      </div>
      <ProdPrice />
      <p className='text-base mt-2'>{prod.summary}</p>
      <ProdVariantWrapper>
        {prod.productVariants.length > 0 && <ProdSummaryVariant productVariants={prod.productVariants} />}
        <ProdInputQty prod={prod} />
      </ProdVariantWrapper>
    </div>
  );
};

export default ProdSummary;
