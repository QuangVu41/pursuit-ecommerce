'use client';

import DataTable from '@/components/common/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency, formatDateSmart } from '@/lib/helpers';
import { ProductWithCateAndPrImg } from '@/types/products';
import { createColumnHelper } from '@tanstack/react-table';
import BtnSort from '@/components/management/filter/BtnSort';
import { deleteManyProds, deleteProd } from '@/actions/products';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';
import ModalPopup from '@/components/common/ModalPopup';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ProdMngTableProps {
  products: ProductWithCateAndPrImg[];
  count: number;
}

const ProdMngTable = ({ products, count }: ProdMngTableProps) => {
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
    columnHelper.accessor('user', {
      header: () => 'Owner',
      cell: (info) => (
        <div className='flex items-start gap-2'>
          <figure className='relative size-8'>
            <Image
              src={info.getValue().image || '/default-avatar.png'}
              alt={info.getValue().name || 'Product Image'}
              width={32}
              height={32}
              className='object-cover absolute inset-0 w-full h-full rounded-full'
            />
          </figure>
          <div className='flex flex-col'>
            <span className='text-xs font-semibold'>{info.getValue().name}</span>
            <Badge
              variant='outline'
              className={`text-[10px] ${
                info.getValue().role === UserRole.admin
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-blue-500 bg-blue-500/10 text-blue-500'
              }`}
            >
              {info.getValue().role}
            </Badge>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: () => <BtnSort header='Name' sortBy='name' />,
      cell: (info) => <span className='w-44 truncate block'>{info.getValue()}</span>,
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
        <span className='text-base font-semibold flex items-center text-green-400 dark:text-green-500'>
          {formatCurrency('VND', info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('discountPercentage', {
      header: () => <BtnSort header='Discount' sortBy='discountPercentage' />,
      cell: (info) => (
        <Badge className='text-sm border-green-500 bg-green-500/10 text-green-500 rounded-full' variant='outline'>
          {info.getValue()}%
        </Badge>
      ),
    }),
    columnHelper.accessor('category', {
      header: () => 'Category',
      cell: ({ row }) => (
        <span className='text-base font-semibold text-amber-500 dark:text-amber-700'>{row.original.category.name}</span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: () => <BtnSort header='Date' sortBy='createdAt' />,
      cell: (info) => <span className='lowercase'>{formatDateSmart(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <ModalPopup
            title={`Delete ${row.original.name} product`}
            content={
              <DeleteConfirm
                id={row.original.id}
                confirmText='Are you sure you want to delete this product?'
                serverAction={deleteProd}
              />
            }
            className='md:max-w-[450px]'
          >
            <Button variant='destructive' size='icon'>
              <Trash2 />
            </Button>
          </ModalPopup>
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

export default ProdMngTable;
