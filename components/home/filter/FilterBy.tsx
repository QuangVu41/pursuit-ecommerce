'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useUrl } from '@/hooks/use-url';
import { Fragment } from 'react';

interface FilterByProps<T> {
  items: T[];
  title: string;
  filterBy: string;
}

const FilterBy = <T extends { id: string; name: string }>({ items, title, filterBy }: FilterByProps<T>) => {
  const { router, pathname, searchParams } = useUrl();

  const handleClick = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const currentFilterBy = searchParams.get(filterBy as string);
    if (currentFilterBy === value) {
      newSearchParams.delete(filterBy);
      newSearchParams.set('page', '1');
      return router.push(`${pathname}?${newSearchParams.toString()}`);
    }
    newSearchParams.set(filterBy, value);
    newSearchParams.set('page', '1');
    return router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className='p-3 border'>
      <h4 className='text-lg mb-4 font-bold'>{title}</h4>
      <ScrollArea className='h-60'>
        <ul className='flex flex-col gap-y-3 text-sm capitalize divide-y-1'>
          {items.map((item) => (
            <Fragment key={item.id}>
              <li
                className={`cursor-pointer hover:text-home-primary hover:font-bold transition-all duration-100 ${
                  searchParams.get(filterBy) === item.id ? 'text-home-primary font-bold' : ''
                }`}
                onClick={() => handleClick(item.id)}
              >
                {item.name}
              </li>
            </Fragment>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default FilterBy;
