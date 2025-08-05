'use client';

import { formatCurrency } from '@/lib/helpers';
import { useProdAddToCartStore } from './ProdAddToCartProvider';

interface ProdPriceProps {
  discountPercentage: number;
}

const ProdPrice = ({ discountPercentage }: ProdPriceProps) => {
  const regularPrice = useProdAddToCartStore((state) => state.regularPrice);
  const variantPrice = useProdAddToCartStore((state) => state.variantPrice);
  const hasDiscount = discountPercentage > 0;

  return (
    <div className='flex items-center gap-2'>
      {hasDiscount && (
        <span className='text-3xl font-medium text-primary'>
          {formatCurrency(
            'VND',
            (variantPrice || regularPrice) - ((variantPrice || regularPrice) * discountPercentage) / 100
          )}
        </span>
      )}
      <span
        className={`font-medium ${
          hasDiscount ? 'line-through text-xl text-muted-foreground' : 'text-3xl text-primary'
        }`}
      >
        {formatCurrency('VND', variantPrice || regularPrice)}
      </span>
    </div>
  );
};

export default ProdPrice;
