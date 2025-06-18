'use client';

import { Button } from '@/components/ui/button';
import { PopoverClose } from '@radix-ui/react-popover';
import { useRef } from 'react';

interface FilterFormWrapperProps {
  children: React.ReactNode;
  handleSubmit: () => void;
  handleReset: () => void;
}

const FilterFormWrapper = ({ children, handleReset, handleSubmit }: FilterFormWrapperProps) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeBtnRef.current?.click();
    handleSubmit();
  };

  const handleFormReset = () => {
    closeBtnRef.current?.click();
    handleReset();
  };

  return (
    <form onSubmit={handleFormSubmit} className='flex flex-col gap-y-2'>
      <span className='text-xl'>Filter</span>
      {children}
      <div className='flex items-center gap-x-2'>
        <Button type='button' className='flex-1' size='sm' variant='outline' onClick={handleFormReset}>
          Reset
        </Button>
        <Button className='flex-1' size='sm'>
          Apply
        </Button>
      </div>
      <PopoverClose asChild>
        <button ref={closeBtnRef} type='button' hidden>
          Close
        </button>
      </PopoverClose>
    </form>
  );
};

export default FilterFormWrapper;
