'use client';

import ActionBtns from '@/components/common/ActionBtns';
import DataTable from '@/components/common/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, formatDistanceFromNow } from '@/lib/helpers';
import { ProductWithCateAndPrImg } from '@/types/products';
import { createColumnHelper } from '@tanstack/react-table';
import BtnSort from '@/components/management/filter/BtnSort';
import { deleteManyProds, deleteProd } from '@/actions/products';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ProdTableProps {
  products: ProductWithCateAndPrImg[];
  count: number;
}

const ProdTable = ({ products, count }: ProdTableProps) => {
  const columnHelper = createColumnHelper<ProductWithCateAndPrImg>();
  const prodColumns = [
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
    columnHelper.accessor('name', {
      header: () => <BtnSort header='Name' sortBy='name' />,
      cell: (info) => <span className='w-72 truncate block'>{info.getValue()}</span>,
    }),
    columnHelper.accessor('productImages', {
      header: () => 'Image',
      cell: (info) => (
        <figure className='relative size-14'>
          <Image
            src={info.getValue()[0].imageUrl}
            alt={info.getValue()[0].altText}
            width={56}
            height={56}
            className='object-cover absolute inset-0 w-full h-full rounded-md'
          />
        </figure>
      ),
    }),
    columnHelper.accessor('regularPrice', {
      header: () => <BtnSort header='Price' sortBy='regularPrice' />,
      cell: (info) => (
        <Badge className='text-base flex items-center bg-green-400 dark:bg-green-500'>
          {formatCurrency('VND', info.getValue())}
        </Badge>
      ),
    }),
    columnHelper.accessor('category', {
      header: () => 'Category',
      cell: ({ row }) => (
        <Badge className='text-base bg-amber-500 dark:bg-amber-700'>{row.original.category.name}</Badge>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => <BtnSort header='Date' sortBy='createdAt' />,
      cell: (info) => formatDistanceFromNow(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <ActionBtns
            model={row.original}
            editionContent={''}
            editionTitle='Edit Product'
            confirmText='Are you sure you want to delete this product?'
            deletionTitle={`Delete ${row.original.name} product`}
            editLink={`/mng/products/${row.original.slug}`}
            deletionAction={deleteProd}
          />
        </div>
      ),
    }),
  ];

  return (
    <DataTable<ProductWithCateAndPrImg, any>
      count={count}
      columns={prodColumns}
      data={products}
      handleDeleteSelectedRowsServer={deleteManyProds}
      showFilter={false}
    />
  );
};

export default ProdTable;
