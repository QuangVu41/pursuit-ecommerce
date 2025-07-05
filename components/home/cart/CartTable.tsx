'use client';

import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/helpers';
import { UserCartItemsWithPayload } from '@/types/products';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCartItemsStore } from '@/components/home/cart/CartItemsProvider';
import CartDataTable from '@/components/home/cart/CartDataTable';
import EmptyCart from '@/components/home/header/EmptyCart';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const CartTable = () => {
  const cartItems = useCartItemsStore((state) => state.cartItems);
  const increaseQty = useCartItemsStore((state) => state.increaseQty);
  const decreaseQty = useCartItemsStore((state) => state.decreaseQty);
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);
  const setQty = useCartItemsStore((state) => state.setQty);
  const isPending = useCartItemsStore((state) => state.isPending);

  const handleInputChange = useDebouncedCallback((value: string | number, id: string) => {
    const quantity = +value;
    if (!isNaN(quantity)) setQty(id, quantity);
    else setQty(id, 1);
  }, 500);

  const columnHelper = createColumnHelper<UserCartItemsWithPayload>();
  const cartColumns: ColumnDef<UserCartItemsWithPayload>[] = [
    columnHelper.display({
      id: 'selects',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
    }),
    columnHelper.display({
      id: 'image',
      header: () => 'Image',
      cell: ({ row }) => (
        <figure className='relative size-14'>
          <Image
            src={row.original.productVariant.imageUrl || row.original.productVariant.product.productImages[0].imageUrl}
            alt={row.original.productVariant.altText || row.original.productVariant.product.productImages[0].altText}
            width={56}
            height={56}
            className='object-cover absolute inset-0 w-full h-full rounded-md'
          />
        </figure>
      ),
    }),
    columnHelper.display({
      id: 'name',
      header: () => 'Name',
      cell: ({ row }) => <span className='max-w-72 truncate block'>{row.original.productVariant.product.name}</span>,
    }),
    columnHelper.display({
      id: 'variant',
      header: () => 'Variant',
      cell: ({ row }) => (
        <div className='flex items-center gap-x-1'>
          <span>
            {row.original.productVariant.firstAttr.attribute.name}: {row.original.productVariant.firstAttr.name}
          </span>

          {row.original.productVariant.secondAttr && (
            <>
              -
              <span>
                {row.original.productVariant.secondAttr?.attribute.name}: {row.original.productVariant.secondAttr?.name}
              </span>
            </>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'unit-price',
      header: () => 'Unit Price',
      cell: ({ row }) => (
        <span className='text-home-primary font-medium'>
          {formatCurrency('VND', row.original.productVariant.price)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'quantity',
      header: () => 'Quantity',
      cell: function Quantity({ row }) {
        const [value, setValue] = useState<string | number>(row.original.quantity);

        return (
          <div className='flex items-start'>
            <div className='flex items-center'>
              <Button
                size='icon'
                className='rounded-none'
                variant='outline'
                disabled={isPending}
                onClick={() => decreaseQty(row.original.id)}
              >
                <Minus />
              </Button>
              <InputHome
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                className='w-16 text-home-primary relative z-10 text-center bg-background'
                value={value}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isNaN(+value)) return;
                  if (value === '0') return;
                  setValue(
                    +e.target.value > row.original.productVariant.stock
                      ? row.original.productVariant.stock
                      : e.target.value
                  );
                }}
                onBlur={() => {
                  handleInputChange(value, row.original.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInputChange(value, row.original.id);
                }}
                disabled={isPending}
              />
              <Button
                size='icon'
                className='rounded-none'
                variant='outline'
                onClick={() => increaseQty(row.original.id)}
                disabled={isPending}
              >
                <Plus />
              </Button>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'price',
      header: () => 'Price',
      cell: ({ row }) => (
        <span className='text-primary font-medium'>
          {formatCurrency('VND', row.original.productVariant.price * row.original.quantity)}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <Button size='icon' variant='destructive' onClick={() => deleteCartItem(row.original.id)}>
          <Trash2 />
        </Button>
      ),
    }),
  ];

  return cartItems.length > 0 ? <CartDataTable columns={cartColumns} data={cartItems} /> : <EmptyCart />;
};

export default CartTable;
