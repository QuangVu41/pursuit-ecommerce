'use client';

import { useUrl } from '@/hooks/use-url';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const FilterSearch = () => {
  const { router, pathname, searchParams } = useUrl();
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const containerClassName = isFocused ? 'border-ring ring-ring/50 ring-[3px] border-transparent' : '';
  const iconClassName = isFocused ? 'text-ring/50' : 'stroke-muted-foreground';

  const handleChange = useDebouncedCallback((value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set('search', value);
      newSearchParams.set('page', '1');
    } else newSearchParams.delete('search');
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, 300);

  return (
    <div
      className={`flex items-center gap-x-2 border rounded-[8px] p-2 bg-background max-md:w-full ${containerClassName}`}
    >
      <Search className={`size-5 ${iconClassName}`} />
      <input
        type='text'
        alt='Search Bar'
        placeholder='Search name...'
        className='size-full text-base border-none border-0 border-transparent outline-transparent outline-0 p-0'
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleChange(e.target.value);
        }}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
      />
    </div>
  );
};

export default FilterSearch;
