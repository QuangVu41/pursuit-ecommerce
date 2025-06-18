'use client';

import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { useUrl } from '@/hooks/use-url';
import { Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FilterRangeProps {
  title: string;
}

const FilterRange = ({ title }: FilterRangeProps) => {
  const { router, pathname, searchParams } = useUrl();
  const [fieldValues, setFieldValues] = useState<{
    minPrice: string;
    maxPrice: string;
  }>({ minPrice: '', maxPrice: '' });

  useEffect(() => {
    if (!searchParams.has('minPrice')) setFieldValues((prev) => ({ ...prev, minPrice: '' }));
    if (!searchParams.has('maxPrice')) setFieldValues((prev) => ({ ...prev, maxPrice: '' }));
  }, [searchParams]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldValues((prev) => ({
      ...prev,
      [name]: value, // Allow only digits
    }));
  };

  const handleApplyFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (fieldValues.minPrice) {
      newSearchParams.set('minPrice', fieldValues.minPrice);
    } else {
      newSearchParams.delete('minPrice');
      setFieldValues((prev) => ({ ...prev, minPrice: '' }));
    }
    if (fieldValues.maxPrice) {
      newSearchParams.set('maxPrice', fieldValues.maxPrice);
    } else {
      newSearchParams.delete('maxPrice');
      setFieldValues((prev) => ({ ...prev, maxPrice: '' }));
    }
    if (
      fieldValues.minPrice &&
      fieldValues.maxPrice &&
      parseInt(fieldValues.minPrice) > parseInt(fieldValues.maxPrice)
    ) {
      newSearchParams.set('minPrice', fieldValues.maxPrice);
      newSearchParams.set('maxPrice', fieldValues.minPrice);
    }
    newSearchParams.set('page', '1');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className='p-3 border'>
      <h4 className='text-lg mb-4 font-bold'>{title}</h4>
      <div className='flex items-center gap-1'>
        <InputHome
          type='number'
          name='minPrice'
          placeholder='₫ From'
          maxLength={10}
          value={fieldValues.minPrice}
          onChange={handleValueChange}
          className='placeholder:text-foreground/70 text-foreground placeholder:text-sm text-base 2md:text-xs px-1'
        />
        <Minus />
        <InputHome
          type='number'
          name='maxPrice'
          placeholder='₫ To'
          maxLength={10}
          value={fieldValues.maxPrice}
          onChange={handleValueChange}
          className='placeholder:text-foreground/70 text-foreground placeholder:text-sm text-base 2md:text-xs px-1'
        />
      </div>
      <Button variant='homeDefault' className='w-full rounded-none mt-3' onClick={handleApplyFilter}>
        Apply
      </Button>
    </div>
  );
};

export default FilterRange;
