import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className='flex flex-col gap-y-2 items-center p-8'>
      <ShoppingBag className='size-10 text-home-primary' />
      <h2 className='text-lg font-semibold text-muted-foreground'>Your cart is empty</h2>
    </div>
  );
};

export default EmptyCart;
