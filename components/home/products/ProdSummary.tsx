import { ProductWithPayLoad } from '@/types/products';
import starSvg from '@/public/star.svg';
import Image from 'next/image';
import ProdSummaryVariant from '@/components/home/products/ProdSummaryVariant';
import ProdInputQty from '@/components/home/products/ProdInputQty';
import ProdPrice from '@/components/home/products/ProdPrice';
import ProdVariantWrapper from '@/components/home/products/ProdVariantWrapper';

interface ProdSummaryProps {
  prod: ProductWithPayLoad;
}

const ProdSummary = ({ prod }: ProdSummaryProps) => {
  return (
    <div className='flex flex-col flex-1 gap-y-3'>
      <h1 className='text-2xl font-medium capitalize'>{prod.name}</h1>
      <div className='flex items-center gap-x-3 font-medium'>
        <span className='flex items-center gap-x-0.5'>
          <Image src={starSvg} alt='star' className='size-4' />0
        </span>
        |<span>Sold 0</span>|<span>Review 0</span>
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
