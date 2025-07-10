'use client';

import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import { formatCurrency, formatDistanceFromNow } from '@/lib/helpers';
import BtnSort from '../filter/BtnSort';
import { OrderItemWithPayload } from '@/types/orders';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface OrderTableProps {
  sales: OrderItemWithPayload[];
  count: number;
}

const OrderTable = ({ sales, count }: OrderTableProps) => {
  const columnHelper = createColumnHelper<OrderItemWithPayload>();
  const saleColumns = [
    columnHelper.accessor('productVariant.product.name', {
      header: () => 'Product Name',
      cell: (info) => (
        <Button variant='link' className='text-base' asChild>
          <Link href={`/products/${info.row.original.productVariant.product.slug}`}>{info.getValue()}</Link>
        </Button>
      ),
    }),
    columnHelper.accessor('quantity', {
      header: () => 'Quantity',
      cell: (info) => <Badge className='bg-amber-500 text-base'>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('productVariant.price', {
      header: () => 'Unit Price',
      cell: (info) => <Badge className='bg-gray-500 text-base'>{formatCurrency('VND', info.getValue())}</Badge>,
    }),
    columnHelper.accessor('total', {
      header: () => 'Total Price',
      cell: (info) => <Badge className='bg-blue-500 text-base'>{formatCurrency('VND', info.getValue())}</Badge>,
    }),
    columnHelper.accessor('platformFee', {
      header: () => 'Platform Fee',
      cell: (info) => (
        <Badge variant='destructive' className='text-base'>
          {formatCurrency('VND', info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor('id', {
      header: () => 'Receipt',
      cell: (info) => (
        <Badge className='bg-green-500 text-base'>
          {formatCurrency('VND', info.row.original.total - info.row.original.platformFee)}
        </Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => <BtnSort header='Date' sortBy='createdAt' />,
      cell: (info) => formatDistanceFromNow(info.getValue()),
    }),
  ];

  return (
    <DataTable<OrderItemWithPayload, any>
      count={count}
      columns={saleColumns}
      data={sales}
      showFilter={false}
      showDeleteButton={false}
    />
  );
};

export default OrderTable;
