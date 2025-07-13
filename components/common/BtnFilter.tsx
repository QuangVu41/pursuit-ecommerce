'use client';

import { useUrl } from '@/hooks/use-url';
import { Button, buttonVariants } from '@/components/ui/button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface BtnFilterProps {
  label: string;
  query: string;
  isDefault: boolean;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  activeClass?: string;
  queryKey?: string;
}

const BtnFilter = ({
  label,
  query,
  isDefault,
  variant = 'homeSecondary',
  className,
  activeClass = 'bg-home-primary',
  queryKey = 'sortBy',
}: BtnFilterProps) => {
  const { router, pathname, searchParams } = useUrl();
  const isActive = searchParams.has(queryKey) ? searchParams.get(queryKey) === query : isDefault;

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.has('order')) newSearchParams.delete('order');
    newSearchParams.set(queryKey, query);
    newSearchParams.set('page', '1');
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Button
      className={cn(`rounded-none cursor-pointer ${isActive ? `${activeClass} text-muted` : ''}`, className)}
      variant={variant}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default BtnFilter;
