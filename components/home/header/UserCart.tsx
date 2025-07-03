import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { getUserCartItems, numItemsInUserCart } from '@/services/products';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import CartItemList from './CartItemList';
import EmptyCart from '@/components/home/header/EmptyCart';

const UserCart = async () => {
  const numItemsInCart = await numItemsInUserCart();
  const cartItems = await getUserCartItems();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href='/cart'>
          <span className='relative'>
            {numItemsInCart !== 0 && (
              <Badge className='absolute -top-2 -right-4 border-2 border-home-primary'>{numItemsInCart}</Badge>
            )}
            <ShoppingCart />
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className='hidden sm:block w-96 p-0' sideOffset={14} align='end'>
        {cartItems.length > 0 ? <CartItemList items={cartItems} /> : <EmptyCart />}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserCart;
