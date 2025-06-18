import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction } from 'react';

interface SheetSlideOverProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  title: string;
  content: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  description?: string;
}

const SheetSlideOver = ({
  children,
  title,
  content,
  isOpen,
  setIsOpen,
  className,
  description,
}: SheetSlideOverProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className={cn('overflow-y-auto', className)}>
        <SheetHeader>
          <SheetTitle className='text-xl capitalize'>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
};

export default SheetSlideOver;
