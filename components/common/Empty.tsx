import { cn } from '@/lib/utils';

interface EmptyProps {
  title: string;
  className?: string;
}

const Empty = ({ title, className }: EmptyProps) => {
  return <p className={cn('text-base md:text-xl flex justify-center', className)}>{title}</p>;
};

export default Empty;
