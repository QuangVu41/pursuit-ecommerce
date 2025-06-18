import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  className?: string;
}

const SectionTitle = ({ title, className }: SectionTitleProps) => {
  return <h2 className={cn('text-foreground font-medium', className)}>{title}</h2>;
};

export default SectionTitle;
