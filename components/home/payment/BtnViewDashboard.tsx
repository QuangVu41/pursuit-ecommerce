'use client';

import { getStripeDashboardLink } from '@/actions/payment';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

const BtnViewDashboard = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant='homeDefault'
      size='homeDefault'
      className='rounded-none text-lg'
      onClick={() => {
        startTransition(() => {
          getStripeDashboardLink();
        });
      }}
      disabled={isPending}
    >
      View Dashboard
    </Button>
  );
};

export default BtnViewDashboard;
