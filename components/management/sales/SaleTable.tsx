'use client';

import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import { formatCurrency, formatDateSmart } from '@/lib/helpers';
import BtnSort from '@/components/management/filter/BtnSort';
import { OrderItemWithPayload } from '@/types/orders';
import Link from 'next/link';
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
        <Link href={`/products/${info.row.original.productVariant.product.slug}`} className='w-44 truncate block'>
          {info.getValue()}
        </Link>
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
      cell: (info) => <span className='text-amber-500 font-semibold text-base lowercase'>x{info.getValue()}</span>,
    }),
    columnHelper.accessor('orderId', {
      header: () => 'Variant',
      cell: (info) => (
        <span className='text-base text-primary font-semibold'>
          {info.row.original.productVariant.firstAttr.name}
          {info.row.original.productVariant.secondAttr ? ` - ${info.row.original.productVariant.secondAttr.name}` : ''}
        </span>
      ),
    }),
    columnHelper.accessor('productVariant.price', {
      header: () => 'Unit Price',
      cell: (info) => (
        <span className='text-gray-500 font-semibold text-base'>{formatCurrency('VND', info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('total', {
      header: () => 'Total Price',
      cell: (info) => (
        <span className='text-blue-500 font-semibold text-base'>{formatCurrency('VND', info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('platformFee', {
      header: () => 'Platform Fee',
      cell: (info) => (
        <span className='text-base text-destructive font-semibold'>{formatCurrency('VND', info.getValue())}</span>
      ),
    }),
    columnHelper.accessor('id', {
      header: () => 'Receipt',
      cell: (info) => (
        <span className='text-green-500 font-semibold text-base'>
          {formatCurrency('VND', info.row.original.total - info.row.original.platformFee)}
        </span>
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
