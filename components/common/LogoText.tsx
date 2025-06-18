import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LogoTextProps {
  className?: string;
}

const LogoText = ({ className }: LogoTextProps) => {
  return (
    <Button
      variant='link'
      size='sm'
      asChild
      className={cn('text-primary text-2xl font-bold p-0 hover:no-underline items-end', className)}
    >
      <Link href='/'>Pursuit</Link>
    </Button>
  );
};

export default LogoText;
