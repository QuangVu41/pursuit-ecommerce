import { formatCurrency } from '@/lib/helpers';
import { ProductWithPayLoad } from '@/types/products';
import starSvg from '@/public/star.svg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProdSummaryVariant from '@/components/home/products/ProdSummaryVariant';
import ProdInputQty from '@/components/home/products/ProdInputQty';

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
      <span className='text-3xl text-primary font-medium'>{formatCurrency('VND', prod.regularPrice)}</span>
      {prod.productVariants.length > 0 && <ProdSummaryVariant productVariants={prod.productVariants} />}
      <ProdInputQty prod={prod} />
      <p className='text-base mt-2'>{prod.summary}</p>
      <div className='flex items-center gap-x-4 mt-3'>
        <Button variant='outlinePrimary' size='homeDefault' className='rounded-none text-lg'>
          Add to Cart
        </Button>
        <Button size='homeDefault' className='rounded-none text-lg'>
          Purchase now
        </Button>
      </div>
    </div>
  );
};

export default ProdSummary;
