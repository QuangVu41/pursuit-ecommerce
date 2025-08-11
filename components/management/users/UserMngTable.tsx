'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { User, UserRole } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import BtnSort from '@/components/management/filter/BtnSort';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatDateSmart } from '@/lib/helpers';
import { CircleAlert, CircleCheck, Trash2 } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import ModalPopup from '@/components/common/ModalPopup';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import { Button } from '@/components/ui/button';
import { deleteUserAct } from '@/actions/user';

interface UserMngTableProps {
  users: User[];
  count: number;
}

const UserMngTable = ({ users, count }: UserMngTableProps) => {
  const columnHelper = createColumnHelper<User>();
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
    columnHelper.accessor('image', {
      header: () => 'Image',
      cell: (info) => (
        <figure className='relative size-14'>
          <Image
            src={info.getValue() || '/default-avatar.png'}
            alt={info.row.original.name || 'User Image'}
            width={56}
            height={56}
            className='object-cover absolute inset-0 w-full h-full rounded-md'
          />
        </figure>
      ),
    }),
    columnHelper.accessor('name', {
      header: () => <BtnSort header='Name' sortBy='name' />,
      cell: (info) => <span className='w-44 truncate block'>{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: () => 'Email',
      cell: (info) => (
        <Badge
          className='text-sm border-green-500 bg-green-500/10 text-green-500 rounded-full lowercase'
          variant='outline'
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('role', {
      header: () => 'Role',
      cell: (info) => (
        <Badge
          variant='outline'
          className={`text-[10px] ${
            info.getValue() === UserRole.admin
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-blue-500 bg-blue-500/10 text-blue-500'
          }`}
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('stripeConnectedLinked', {
      header: () => 'Account Connected',
      cell: (info) => (
        <Badge className='text-muted-foreground' variant='outline'>
          {info.getValue() ? (
            <>
              <CircleCheck className='fill-green-500 dark:fill-green-400 stroke-muted !size-4' />
              Connected
            </>
          ) : (
            <>
              <CircleAlert className='fill-destructive stroke-muted !size-4' />
              Not connected
            </>
          )}
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
        <div className='flex items-center gap-x-2'>
          <ModalPopup
            title={`Delete ${row.original.name} user`}
            content={
              <DeleteConfirm
                id={row.original.id}
                confirmText='Are you sure you want to delete this user?'
                serverAction={deleteUserAct}
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

  return <DataTable<User, any> count={count} columns={prodColumns} data={users} showFilter={false} />;
};

export default UserMngTable;
