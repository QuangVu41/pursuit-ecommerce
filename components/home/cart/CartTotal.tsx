'use client';

import { useCartItemsStore } from '@/components/home/cart/CartItemsProvider';
import { formatCurrency } from '@/lib/helpers';

interface CartTotalProps {
  selectedRowCount: number;
}

const CartTotal = ({ selectedRowCount }: CartTotalProps) => {
  const cartTotal = useCartItemsStore((state) => state.cartTotal);

  return (
    <div className='flex items-center gap-x-1'>
      <span className='text-base font-medium text-home-primary md:text-lg'>Total ({selectedRowCount}):</span>
      <span className='text-base md:text-xl text-primary'>{formatCurrency('VND', cartTotal)}</span>
    </div>
  );
};

export default CartTotal;
