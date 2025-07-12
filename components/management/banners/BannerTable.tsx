'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { createColumnHelper } from '@tanstack/react-table';
import BtnSort from '@/components/management/filter/BtnSort';
import { formatDateSmart } from '@/lib/helpers';
import ActionBtns from '@/components/common/ActionBtns';
import BannerForm from '@/components/management/banners/BannerForm';
import DataTable from '@/components/common/DataTable';
import { BannerWithImagesType } from '@/types/banners';
import { Badge } from '@/components/ui/badge';
import { BannerType } from '@prisma/client';
import { deleteBannerAction, deleteManyBannersAction } from '@/actions/banners';

interface BannerTableProps {
  banners: BannerWithImagesType[];
  count: number;
}

const BannerTable = ({ banners, count }: BannerTableProps) => {
  const columnHelper = createColumnHelper<BannerWithImagesType>();
  const bannerColumns = [
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
    columnHelper.accessor('title', {
      header: () => <BtnSort header='Title' sortBy='title' />,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: () => <BtnSort header='Type' sortBy='type' />,
      cell: (info) => (
        <Badge
          variant='outline'
          className={`text-sm ${info.getValue() === BannerType.hero ? 'text-green-600' : 'text-yellow-500'}`}
        >
          {info.getValue()}
        </Badge>
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
        <ActionBtns
          model={row.original}
          confirmText='Are you sure you want to delete this banner?'
          deletionAction={deleteBannerAction}
          deletionTitle={`Delete ${row.original.title} banner`}
          editionTitle='Edit Banner'
          editionContent={<BannerForm mode='edit' banner={row.original} />}
          showSheet
        />
      ),
    }),
  ];

  return (
    <DataTable<BannerWithImagesType, any>
      count={count}
      columns={bannerColumns}
      data={banners}
      showFilter={false}
      handleDeleteSelectedRowsServer={deleteManyBannersAction}
    />
  );
};

export default BannerTable;
