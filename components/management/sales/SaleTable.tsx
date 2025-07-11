'use client';

import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import { formatCurrency, formatDateSmart } from '@/lib/helpers';
import BtnSort from '@/components/management/filter/BtnSort';
import { OrderItemWithPayload } from '@/types/orders';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SaleTableProps {
  sales: OrderItemWithPayload[];
  count: number;
}

const SaleTable = ({ sales, count }: SaleTableProps) => {
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
    columnHelper.accessor('productVariant.imageUrl', {
      header: () => 'Image',
      cell: (info) => (
        <figure className='relative size-14'>
          <Image
            src={info.getValue() || info.row.original.productVariant.product.productImages[0].imageUrl}
            alt={
              info.row.original.productVariant.altText ||
              info.row.original.productVariant.product.productImages[0].altText
            }
            width={56}
            height={56}
            className='object-cover absolute inset-0 w-full h-full rounded-md'
          />
        </figure>
      ),
    }),
    columnHelper.accessor('quantity', {
      header: () => 'Quantity',
      cell: (info) => <Badge className='bg-amber-500 text-base lowercase'>x{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('orderId', {
      header: () => 'Variant',
      cell: (info) => (
        <Badge className='text-base'>
          {info.row.original.productVariant.firstAttr.name}
          {info.row.original.productVariant.secondAttr ? ` - ${info.row.original.productVariant.secondAttr.name}` : ''}
        </Badge>
      ),
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
      cell: (info) => <span className='lowercase'>{formatDateSmart(info.getValue())}</span>,
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

export default SaleTable;
