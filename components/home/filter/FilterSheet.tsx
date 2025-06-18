import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';

interface FilterSheetProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const FilterSheet = ({ label, children, icon }: FilterSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='homeSecondary' className='rounded-none cursor-pointer 2md:hidden'>
          {label}
          {icon}
        </Button>
      </SheetTrigger>
      <SheetContent overlayClassName='2md:hidden' className='2md:hidden'>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
