import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FilterPopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const FilterPopover = ({ children, content }: FilterPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='w-auto' align='start'>
        {content}
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
