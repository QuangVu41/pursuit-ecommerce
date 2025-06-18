import { Button } from '@/components/ui/button';
import { HeaderContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

interface THBtnSortProps<D, V> {
  info: HeaderContext<D, V>;
  name: string;
}

function THBtnSort<D, V>({ info: { column }, name }: THBtnSortProps<D, V>) {
  return (
    <Button
      className='text-lg font-semibold !p-1'
      type='button'
      variant='lighterGhost'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {name}
      <ArrowUpDown />
    </Button>
  );
}

export default THBtnSort;
