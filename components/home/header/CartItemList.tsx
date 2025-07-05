import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/helpers';
import { CartItemWithPayload } from '@/types/products';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemListProps {
  items: CartItemWithPayload[];
}

const CartItemList = ({ items }: CartItemListProps) => {
  return (
    <div className='flex flex-col divide-y'>
      <h2 className='text-muted-foreground font-medium p-2 pb-1'>New Added Items</h2>
      <ul className='h-96 overflow-y-auto'>
        {items.map((item) => (
          <li key={item.id} className='border-b'>
            <Link
              href={`/products/${item.productVariant.product.slug}`}
              className='p-2 flex justify-between hover:bg-muted gap-x-2'
            >
              <div className='flex items-start gap-2'>
                <figure className='relative size-14'>
                  <Image
                    src={item.productVariant.imageUrl || item.productVariant.product.productImages[0].imageUrl}
                    alt={item.productVariant.altText || item.productVariant.product.productImages[0].altText}
                    width={56}
                    height={56}
                    className='object-cover absolute inset-0 w-full h-full'
                  />
                </figure>
                <div className='flex flex-col gap-y-2 w-48'>
                  <h2 className='text-sm truncate'>{item.productVariant.product.name}</h2>
                  <div className='flex item-center gap-x-1 text-sm text-muted-foreground'>
                    <span className='truncate'>Quantity: {item.quantity}</span>-
                    <span className='capitalize truncate'>
                      Variant: {item.productVariant.firstAttr.name}
                      {item.productVariant.secondAttr ? `-${item.productVariant.secondAttr.name}` : ''}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className='text-primary font-semibold'>{formatCurrency('VND', item.productVariant.price)}</h2>
            </Link>
          </li>
        ))}
      </ul>
      <div className='p-2 ml-auto mt-1'>
        <Button className='rounded-none' variant='homeDefault'>
          <Link href='/cart'>View Cart</Link>
        </Button>
      </div>
    </div>
  );
};

export default CartItemList;
