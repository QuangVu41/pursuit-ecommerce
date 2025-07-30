'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DeleteConfirm from './DeleteConfirm';
import ModalPopup from './ModalPopup';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  handleDeleteSelectedRows?: (rowSelection: { [key: string]: boolean }) => void;
  name?: TData[keyof TData];
  showFilter?: boolean;
  count: number;
  handleDeleteSelectedRowsServer?: (
    originalSelectedRows: string[]
  ) => Promise<{ success?: string; error?: string } | void>;
  showPagination?: boolean;
  showDeleteButton?: boolean;
}

const DataTable = <TData extends { id: string }, TValue>({
  columns,
  data,
  handleDeleteSelectedRows,
  name,
  showFilter = true,
  count,
  handleDeleteSelectedRowsServer,
  showPagination = false,
  showDeleteButton = true,
}: DataTableProps<TData, TValue>) => {
  const [isPending, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
  });

  return (
    <div className='w-full'>
      <div className='flex items-end pb-4 gap-2 justify-between flex-wrap'>
        {showFilter && name && (
          <Input
            placeholder='Filter names...'
            value={(table.getColumn(name as string)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(name as string)?.setFilterValue(event.target.value)}
            className='max-w-sm bg-background'
          />
        )}
        {showDeleteButton && (
          <>
            <ModalPopup
              title='Delete Rows'
              content={
                <DeleteConfirm
                  clientAction={() => {
                    handleDeleteSelectedRows?.(rowSelection);
                    startTransition(() => {
                      handleDeleteSelectedRowsServer?.(
                        table.getSelectedRowModel().rows.map((row) => row.original.id)
                      ).then((res) => {
                        if (res?.error) toast.error(res.error);
                        if (res?.success) toast.success(res.success);
                      });
                    });
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
                disabled={!Object.keys(rowSelection).length || isPending}
              >
                <Trash2 />
              </Button>
            </ModalPopup>
            <div className='text-sm text-muted-foreground font-manrope ml-auto shrink-0 h-9 flex items-end'>
              {table.getFilteredSelectedRowModel().rows.length} of {count} row(s) selected.
            </div>
          </>
        )}
      </div>
      <div className='rounded-md border bg-background/70'>
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
      {showPagination && (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
