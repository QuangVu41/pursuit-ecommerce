import { Skeleton } from '@/components/ui/skeleton';
import { RECORDS_PER_PAGE } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

interface TableSkeletonProps {
  rows?: number; // Number of skeleton rows
  columns?: number; // Number of skeleton columns
}

const TableSkeleton = ({ rows = RECORDS_PER_PAGE, columns = 3 }: TableSkeletonProps) => {
  return (
    <div className='w-full rounded-md overflow-hidden'>
      {/* Table Header */}
      <div>
        <div className='flex items-center p-4'>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className='h-6 w-1/4 mx-2' style={{ flex: 1 }} />
          ))}
        </div>
        <Separator />
      </div>

      {/* Table Body */}
      <div className='divide-y divide-border'>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className='flex items-center p-4'>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className='h-4 w-full mx-2' style={{ flex: 1 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
