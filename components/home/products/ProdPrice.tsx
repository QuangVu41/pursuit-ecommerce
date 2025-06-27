'use client';

import { formatCurrency } from '@/lib/helpers';
import { useProdAddToCartStore } from './ProdAddToCartProvider';

const ProdPrice = () => {
  const regularPrice = useProdAddToCartStore((state) => state.regularPrice);
  const variantPrice = useProdAddToCartStore((state) => state.variantPrice);

  return (
    <span className='text-3xl text-primary font-medium'>{formatCurrency('VND', variantPrice || regularPrice)}</span>
  );
};

export default ProdPrice;
