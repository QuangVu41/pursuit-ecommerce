import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import BtnSort from '../management/filter/BtnSort';

export type Column<T> = {
  header: string; // Column header text
  accessor: keyof T; // Key of the object to access the value
  render?: (value: T[keyof T] | T[keyof T][]) => React.ReactNode; // Optional custom render function
  className?: string;
  isSorted?: boolean;
};

type ReusableTableProps<T extends { id: string }> = {
  data: T[]; // Array of objects to display
  columns: Column<T>[]; // Column configuration
  actions?: (row: T) => React.ReactNode; // Optional actions for each row
};

const ReusableTable = <T extends { id: string }>({ data, columns, actions }: ReusableTableProps<T>) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(({ header, accessor, isSorted = true }, index) => (
            <TableHead key={index}>
              {isSorted ? (
                <BtnSort header={header} sortBy={accessor as string} />
              ) : (
                <span className='text-lg font-bold'>{header}</span>
              )}
            </TableHead>
          ))}
          {actions && <TableHead className='text-lg font-bold'>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.header} className={cn('text-lg capitalize', col.className)}>
                {col.render ? col.render(row[col.accessor]) : (row[col.accessor] as string as React.ReactNode)}
              </TableCell>
            ))}
            {actions && <TableCell className='text-lg'>{actions(row)}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
