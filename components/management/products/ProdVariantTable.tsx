'use client';

import DataTable from '@/components/common/DataTable';
import { Checkbox } from '@/components/ui/checkbox';
import { ProdFormSchemaType } from '@/schemas/products';
import { createColumnHelper } from '@tanstack/react-table';
import { FieldArrayWithId } from 'react-hook-form';
import ActionBtns from '@/components/common/ActionBtns';
import ProdVariantEditForm from './ProdVariantEditForm';
import { useProdVariantContext } from './ProdVariantProvider';
import { Button } from '@/components/ui/button';
import { SquarePlus } from 'lucide-react';

const columnHelper = createColumnHelper<FieldArrayWithId<ProdFormSchemaType, 'variants', 'id'>>();

const ProdVariantTable = () => {
  const {
    fieldVariantArrUtils: { remove, fields },
    handleAppendSameVariantType,
    isEnoughVariant,
  } = useProdVariantContext();

  const count = fields.length;

  const columns = [
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
    columnHelper.accessor('variantName', {
      header: () => 'Variant Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: () => 'Price',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('stock', {
      header: () => 'Stock',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-x-2'>
          <Button
            type='button'
            variant='lighterGhost'
            className={isEnoughVariant(row.original) ? 'hidden' : ''}
            size='icon'
            onClick={() => handleAppendSameVariantType(row.original)}
          >
            <SquarePlus className='size-6' />
          </Button>
          <ActionBtns
            editionContent={<ProdVariantEditForm variant={row.original} />}
            editionTitle='Edit Variant'
            confirmText='Are you sure you want to delete this variant?'
            deletionTitle={`Delete ${row.original.variantName} product`}
            clientAction={() => {
              const fieldIdx = fields.findIndex((field) => field.id === row.original.id);
              remove(fieldIdx);
            }}
          />
        </div>
      ),
    }),
  ];

  const handleDeleteSelectedRows = (rowSelection: { [key: string]: boolean }) => {
    const selectedRowIndexes = Object.keys(rowSelection).map((key) => parseInt(key, 10));
    remove(selectedRowIndexes);
  };

  return (
    <DataTable<FieldArrayWithId<ProdFormSchemaType, 'variants', 'id'>, any>
      count={count}
      columns={columns}
      data={fields}
      handleDeleteSelectedRows={handleDeleteSelectedRows}
      name='variantName'
    />
  );
};

export default ProdVariantTable;
