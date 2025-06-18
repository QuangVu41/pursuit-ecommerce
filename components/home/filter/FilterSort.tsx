'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUrl } from '@/hooks/use-url';

interface FilterSortProps {
  label: string;
  sortBy: string;
  criteria: {
    label: string;
    order: 'asc' | 'desc';
  }[];
}

const FilterSort = ({ label, criteria, sortBy }: FilterSortProps) => {
  const { router, pathname, searchParams } = useUrl();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sortBy);
    params.set('order', value);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={searchParams.get('order') || undefined}>
      <SelectTrigger
        className={`text-sm font-medium rounded-none bg-secondary border-0 data-[placeholder]:text-foreground cursor-pointer ${
          searchParams.get('sortBy') === sortBy ? 'text-home-primary font-semibold' : ''
        }`}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className='rounded-none border-0'>
        {criteria.map((item) => (
          <SelectItem key={item.label} value={item.order} className='rounded-none focus:text-home-primary'>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSort;
