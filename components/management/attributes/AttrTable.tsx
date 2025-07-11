'use client';

import { ProductAttributeWithValues } from '@/types/attributes';
import { ProductAttributeValue } from '@prisma/client';
import ActionBtns from '@/components/common/ActionBtns';
import { deleteAttr, deleteManyAttrs } from '@/actions/attributes';
import AttrForm from './AttrForm';
import AttrFormProvider from './AttrFormProvider';
import { createColumnHelper } from '@tanstack/react-table';
import DataTable from '@/components/common/DataTable';
import { formatDateSmart } from '@/lib/helpers';
import { Checkbox } from '@/components/ui/checkbox';
import BtnSort from '../filter/BtnSort';

interface AttrTableProps {
  attributes: ProductAttributeWithValues[];
  count: number;
}

const AttrTable = ({ attributes, count }: AttrTableProps) => {
  const columnHelper = createColumnHelper<ProductAttributeWithValues>();
  const prodAttrColumns = [
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
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('productAttributeValues', {
      header: () => 'Values',
      cell: ({ row }) => (
        <span className='truncate'>
          {(row.original.productAttributeValues as ProductAttributeValue[]).map((val) => val.name).join(', ')}
        </span>
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
        <AttrFormProvider mode='edit' attribute={row.original}>
          <ActionBtns
            model={row.original}
            confirmText='Are you sure you want to delete this attribute?'
            deletionTitle={`Delete ${row.original.name} attribute`}
            editionTitle='Edit Attribute'
            deletionAction={deleteAttr}
            editionContent={<AttrForm />}
            showSheet
          />
        </AttrFormProvider>
      ),
    }),
  ];

  return (
    <DataTable<ProductAttributeWithValues, any>
      count={count}
      columns={prodAttrColumns}
      data={attributes}
      handleDeleteSelectedRowsServer={deleteManyAttrs}
      showFilter={false}
    />
  );
};

export default AttrTable;
