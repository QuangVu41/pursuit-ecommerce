'use client';

import { Button } from '@/components/ui/button';
import { useUrl } from '@/hooks/use-url';

const FilterReset = () => {
  const { router, pathname, searchParams } = useUrl();

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    searchParams
      .entries()
      .toArray()
      .forEach((searchParam) => {
        if (searchParam[0] === 'sortBy' || searchParam[0] === 'order') return;
        newSearchParams.delete(searchParam[0]);
      });

    return router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Button variant='homeDefault' className='w-full rounded-none' onClick={handleClick}>
      Reset
    </Button>
  );
};

export default FilterReset;
