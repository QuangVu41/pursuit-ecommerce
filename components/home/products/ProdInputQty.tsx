'use client';

import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { useProdAddToCartStore } from './ProdAddToCartProvider';
import { ProductWithPayLoad } from '@/types/products';

interface ProdInputQtyProps {
  prod: ProductWithPayLoad;
}

const ProdInputQty = ({ prod }: ProdInputQtyProps) => {
  const quantity = useProdAddToCartStore((state) => state.quantity);
  const increaseQty = useProdAddToCartStore((state) => state.increaseQty);
  const decreaseQty = useProdAddToCartStore((state) => state.decreaseQty);
  const firstAttrId = useProdAddToCartStore((state) => state.firstAttrId);
  const secondAttrId = useProdAddToCartStore((state) => state.secondAttrId);
  const hasTwoAttrs = useProdAddToCartStore((state) => state.hasTwoAttrs);
  const totalQty = prod.productVariants
    .filter((v) => {
      if (firstAttrId && secondAttrId) {
        return v.firstAttrId === firstAttrId && v.secondAttrId === secondAttrId;
      }
      if (firstAttrId) {
        return v.firstAttrId === firstAttrId;
      }
      if (secondAttrId) {
        return v.secondAttrId === secondAttrId;
      }
      return true;
    })
    .reduce((acc, variant) => acc + variant.stock, 0);
  const isDisabled = hasTwoAttrs ? !firstAttrId || !secondAttrId : !firstAttrId;

  return (
    <div className='flex items-start mt-2'>
      <h2 className='text-base text-muted-foreground w-[100px] shrink-0'>Quantity</h2>
      <div className='flex items-center'>
        <Button size='icon' className='rounded-none' variant='outline' onClick={decreaseQty} disabled={isDisabled}>
          <Minus />
        </Button>
        <InputHome
          type='number'
          className='w-12 text-home-primary relative z-10 text-center'
          value={Math.min(quantity, totalQty)}
          disabled={isDisabled}
        />
        <Button
          size='icon'
          className='rounded-none'
          variant='outline'
          onClick={() => increaseQty(totalQty)}
          disabled={isDisabled}
        >
          <Plus />
        </Button>
        <span className='text-muted-foreground text-sm ml-2'>{totalQty} products available</span>
      </div>
    </div>
  );
};

export default ProdInputQty;
