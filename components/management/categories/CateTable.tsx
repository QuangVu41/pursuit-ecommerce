'use client';

import { formatDateSmart } from '@/lib/helpers';
import ActionBtns from '@/components/common/ActionBtns';
import { deleteCate, deleteManyCates } from '@/actions/categories';
import CateForm from './CateForm';
import CateFormProvider from './CateFormProvider';
import CateSelectItemsClient from './CateSelectItemsClient';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import DataTable from '@/components/common/DataTable';
import BtnSort from '../filter/BtnSort';
import { Badge } from '@/components/ui/badge';
import { CateWithParentCate } from '@/types/categories';
import { Minus } from 'lucide-react';
import Image from 'next/image';

interface CateTableProps {
  categories: CateWithParentCate[];
  count: number;
}

const CateTable = ({ categories, count }: CateTableProps) => {
  const columnHelper = createColumnHelper<CateWithParentCate>();
  const cateColumns = [
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
      cell: (info) => <Badge className='text-base bg-amber-500 dark:bg-amber-700'>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('imageUrl', {
      header: () => 'Image',
      cell: (info) => (
        <figure className='relative size-14'>
          <Image
            src={info.getValue()}
            alt={info.row.original.altText}
            width={56}
            height={56}
            className='object-cover absolute inset-0 w-full h-full rounded-md'
          />
        </figure>
      ),
    }),
    columnHelper.accessor('parent', {
      header: () => 'Parent Category',
      cell: (info) => <Badge className='text-base bg-home-primary'>{info.getValue()?.name || <Minus />}</Badge>,
    }),
    columnHelper.accessor('createdAt', {
      header: () => <BtnSort header='Date' sortBy='createdAt' />,
      cell: (info) => <span className='lowercase'>{formatDateSmart(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <CateFormProvider
          mode='edit'
          category={row.original}
          cateSelectItems={<CateSelectItemsClient id={row.original.id} />}
        >
          <ActionBtns
            model={row.original}
            confirmText='Are you sure you want to delete this category?'
            deletionAction={deleteCate}
            deletionTitle={`Delete ${row.original.name} category`}
            editionTitle='Edit Category'
            editionContent={<CateForm />}
            showSheet
          />
        </CateFormProvider>
      ),
    }),
  ];

  return (
    <DataTable<CateWithParentCate, any>
      count={count}
      columns={cateColumns}
      data={categories}
      showFilter={false}
      handleDeleteSelectedRowsServer={deleteManyCates}
    />
  );
};

export default CateTable;
