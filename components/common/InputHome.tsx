import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

const InputHome = ({ className, type, ...props }: ComponentProps<'input'>) => {
  return (
    <Input
      className={cn(
        `rounded-none text-muted placeholder:text-muted focus-visible:ring-home-primary-foreground focus-visible:border-home-primary-foreground focus-visible:ring-[1px] selection:bg-home-primary-hover`,
        className
      )}
      type={type}
      {...props}
    />
  );
};

export default InputHome;
