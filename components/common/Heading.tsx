import { cn } from '@/lib/utils';

interface HeadingProps {
  title: string;
  className?: string;
}

const Heading = ({ title, className }: HeadingProps) => {
  return <h1 className={cn('text-xl md:text-2xl font-bold', className)}>{title}</h1>;
};

export default Heading;
