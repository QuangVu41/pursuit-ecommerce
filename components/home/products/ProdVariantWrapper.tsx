'use client';

import { Button } from '@/components/ui/button';
import { useProdAddToCartStore } from '@/components/home/products/ProdAddToCartProvider';

interface ProdVariantWrapperProps {
  children: React.ReactNode;
}

const ProdVariantWrapper = ({ children }: ProdVariantWrapperProps) => {
  const firstAttrId = useProdAddToCartStore((state) => state.firstAttrId);
  const secondAttrId = useProdAddToCartStore((state) => state.secondAttrId);
  const hasTwoAttrs = useProdAddToCartStore((state) => state.hasTwoAttrs);
  const hasError = useProdAddToCartStore((state) => state.hasError);
  const setHasError = useProdAddToCartStore((state) => state.setHasError);

  const handleAddToCart = () => {
    if (hasTwoAttrs && (!firstAttrId || !secondAttrId)) return setHasError(true);
    if (!hasTwoAttrs && !firstAttrId) return setHasError(true);
  };

  const handlePurchaseNow = () => {
    if (hasTwoAttrs && (!firstAttrId || !secondAttrId)) return setHasError(true);
    if (!hasTwoAttrs && !firstAttrId) return setHasError(true);
  };

  return (
    <>
      <div className={`p-2 flex flex-col gap-y-5 ${hasError ? 'bg-destructive/5' : ''}`}>
        {children}
        {hasError && <p className='text-sm text-destructive'>Please, chose product variant!</p>}
      </div>
      <div className='flex items-center gap-x-4 mt-3'>
        <Button variant='outlinePrimary' size='homeDefault' className='rounded-none text-lg' onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button size='homeDefault' className='rounded-none text-lg' onClick={handlePurchaseNow}>
          Purchase now
        </Button>
      </div>
    </>
  );
};

export default ProdVariantWrapper;
