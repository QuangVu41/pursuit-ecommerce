'use client';

import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import { formatCurrency, formatDateSmart } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import BtnSort from '@/components/management/filter/BtnSort';
import { OrderWithPayload } from '@/types/orders';
import { OrderStatus } from '@prisma/client';
import { CircleCheck, Loader } from 'lucide-react';

interface OrderTableProps {
  orders: OrderWithPayload[];
  count: number;
}

const OrderTable = ({ orders, count }: OrderTableProps) => {
  const columnHelper = createColumnHelper<OrderWithPayload>();
  const orderColumns = [
    columnHelper.accessor('id', {
      header: () => 'Order ID',
      cell: (info) => <span className='lowercase'>{info.getValue()}</span>,
    }),
    columnHelper.accessor('orderItems', {
      header: () => 'Image',
      cell: (info) => (
        <div className='flex *:not-first:-ml-4'>
          {info.getValue().map((item, idx) => (
            <figure className='relative size-14 shadow-md' key={idx}>
              <Image
                src={item.productVariant.imageUrl || item.productVariant.product.productImages[0].imageUrl}
                alt={item.productVariant.altText || item.productVariant.product.productImages[0].altText}
                width={56}
                height={56}
                className='object-cover absolute inset-0 w-full h-full rounded-md'
              />
            </figure>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('updatedAt', {
      header: () => 'Quantity',
      cell: (info) => (
        <span className='text-amber-500 font-semibold text-base lowercase'>x{info.row.original.orderItems.length}</span>
      ),
    }),
    columnHelper.accessor('total', {
      header: () => 'Total Price',
      cell: (info) => (
        <span className='text-blue-500 font-semibold text-base'>{formatCurrency('VND', info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => <BtnSort header='Date' sortBy='createdAt' />,
      cell: (info) => <span className='lowercase'>{formatDateSmart(info.getValue())}</span>,
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: (info) => (
        <Badge className='text-muted-foreground' variant='outline'>
          {info.row.original.status === OrderStatus.completed ? (
            <CircleCheck className='fill-green-500 dark:fill-green-400 stroke-muted' />
          ) : (
            <Loader />
          )}
          {info.getValue()}
        </Badge>
      ),
    }),
  ];

  return (
    <DataTable<OrderWithPayload, any>
      count={count}
      columns={orderColumns}
      data={orders}
      showFilter={false}
      showDeleteButton={false}
    />
  );
};

export default OrderTable;
