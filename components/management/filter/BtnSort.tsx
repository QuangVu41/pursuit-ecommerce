'use client';

import { Button } from '@/components/ui/button';
import { useUrl } from '@/hooks/use-url';
import { ArrowUpDown } from 'lucide-react';

interface BtnSortProps {
  header: string;
  sortBy: string;
}

const BtnSort = ({ header, sortBy }: BtnSortProps) => {
  const { router, pathname, searchParams } = useUrl();

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const currentSortBy = searchParams.get('sortBy') || sortBy;
    const currentOrder = searchParams.get('order') || 'desc';
    const newOrder = currentOrder === 'asc' && currentSortBy === sortBy ? 'desc' : 'asc';
    const newSortBy = currentSortBy === sortBy ? currentSortBy : sortBy;

    newSearchParams.set('sortBy', newSortBy);
    newSearchParams.set('order', newOrder);
    router.push(`${pathname}?${newSearchParams}`);
  };

  return (
    <Button variant='lighterGhost' size='sm' className='text-base font-semibold' onClick={handleClick}>
      {header}
      <ArrowUpDown className='size-5 stroke-foreground' />
    </Button>
  );
};

export default BtnSort;
