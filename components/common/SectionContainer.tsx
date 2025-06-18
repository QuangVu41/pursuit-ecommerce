import { cn } from '@/lib/utils';

interface SectionContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const SectionContainer = ({ children, className }: SectionContainerProps) => {
  return (
    <section className={cn('bg-muted shadow-md rounded-xl p-4 flex flex-col gap-y-4', className)}>{children}</section>
  );
};

export default SectionContainer;
