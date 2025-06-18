import { cn } from '@/lib/utils';

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

const SectionContent = ({ children, className }: SectionContentProps) => {
  return <div className={cn('mt-10 lg:mt-[70px]', className)}>{children}</div>;
};

export default SectionContent;
