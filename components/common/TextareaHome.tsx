import { ComponentProps } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const TextareaHome = ({ className, ...props }: ComponentProps<'textarea'>) => {
  return (
    <Textarea
      className={cn(
        `rounded-none text-muted placeholder:text-muted focus-visible:ring-home-primary-foreground focus-visible:border-home-primary-foreground focus-visible:ring-[1px] selection:bg-home-primary-hover`,
        className
      )}
      {...props}
    />
  );
};

export default TextareaHome;
