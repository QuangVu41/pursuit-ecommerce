import { cn } from '@/lib/utils';

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContent = ({ children, className }: SectionContentProps) => {
  return <div className={cn('mt-8 md:mt-10', className)}>{children}</div>;
};

export default SectionContent;
