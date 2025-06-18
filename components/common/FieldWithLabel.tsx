import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FieldWithLabelProps {
  children: React.ReactNode;
  label: string;
  className?: string;
  htmlFor?: string;
}

const FieldWithLabel = ({ children, label, className, htmlFor }: FieldWithLabelProps) => {
  return (
    <div className={cn('flex flex-col gap-y-1', className)}>
      <Label htmlFor={htmlFor} className='capitalize'>
        {label}
      </Label>
      {children}
    </div>
  );
};

export default FieldWithLabel;
