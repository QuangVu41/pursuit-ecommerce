'use client';

import { useUrl } from '@/hooks/use-url';
import { Button } from '@/components/ui/button';

interface BtnFilterProps {
  label: string;
  query: string;
  isDefault: boolean;
}

const BtnFilter = ({ label, query, isDefault }: BtnFilterProps) => {
  const { router, pathname, searchParams } = useUrl();
  const isActive = searchParams.has('sortBy') ? searchParams.get('sortBy') === query : isDefault;

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newSearchParams.has('order')) newSearchParams.delete('order');
    newSearchParams.set('sortBy', query);
    newSearchParams.set('page', '1');
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Button
      className={`rounded-none cursor-pointer ${isActive ? 'bg-home-primary text-muted' : ''}`}
      variant='homeSecondary'
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default BtnFilter;
