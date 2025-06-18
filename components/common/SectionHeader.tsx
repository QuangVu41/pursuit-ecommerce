import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader = ({ children, className }: SectionHeaderProps) => {
  return <div className={cn('flex items-start justify-between', className)}>{children}</div>;
};

export default SectionHeader;
