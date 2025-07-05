'use client';

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DeleteConfirm from '@/components/common/DeleteConfirm';
import ModalPopup from '@/components/common/ModalPopup';
import { Trash2 } from 'lucide-react';
import { UserCartItemsWithPayload } from '@/types/products';
import CartTotal from '@/components/home/cart/CartTotal';
import { useCartItemsStore } from '@/components/home/cart/CartItemsProvider';
import { Checkbox } from '@/components/ui/checkbox';

interface CartDataTableProps {
  columns: ColumnDef<UserCartItemsWithPayload>[];
  data: UserCartItemsWithPayload[];
}

const CartDataTable = ({ columns, data }: CartDataTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const setCartTotal = useCartItemsStore((state) => state.setCartTotal);
  const isPending = useCartItemsStore((state) => state.isPending);
  const deleteManyCartItems = useCartItemsStore((state) => state.deleteManyCartItems);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (Object.keys(rowSelection).length) {
      const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
      setCartTotal(selectedRowIds);
    } else {
      setCartTotal([]);
    }
  }, [rowSelection, setCartTotal, table]);

  return (
    <div className='w-full'>
      <div className='border bg-background/70'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='text-base font-semibold'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className='text-base capitalize font-manrope' key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='border mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center p-2 md:p-4'>
        <div className='flex items-center gap-x-2 md:gap-x-4'>
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label='Select all'
          />
          <span className='text-sm md:text-lg'>Select All({data.length})</span>
          <ModalPopup
            title='Delete Rows'
            content={
              <DeleteConfirm
                clientAction={() => {
                  deleteManyCartItems(table.getSelectedRowModel().rows.map((row) => row.original.id));
                  setRowSelection({});
                }}
                confirmText='Are you sure you want to delete these rows?'
              />
            }
          >
            <Button
              type='button'
              variant='destructive'
              size='icon'
              className='size-8 md:size-9'
              disabled={!Object.keys(rowSelection).length || isPending}
            >
              <Trash2 />
            </Button>
          </ModalPopup>
        </div>
        <div className='flex items-center ml-auto gap-x-2 md:gap-x-4'>
          <CartTotal selectedRowCount={table.getFilteredSelectedRowModel().rows.length} />
          <Button
            disabled={!Object.keys(rowSelection).length || isPending}
            className='rounded-none text-base md:text-lg h-auto px-6 py-2 md:px-9 md:py-3'
          >
            Purchase Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartDataTable;
