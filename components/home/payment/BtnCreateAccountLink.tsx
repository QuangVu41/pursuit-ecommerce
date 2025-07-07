'use client';

import { createStripeAccountLink } from '@/actions/payment';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

const BtnCreateAccountLink = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant='homeDefault'
      size='homeDefault'
      className='rounded-none text-lg'
      onClick={() => {
        startTransition(() => {
          createStripeAccountLink();
        });
      }}
      disabled={isPending}
    >
      Link your account to Stripe
    </Button>
  );
};

export default BtnCreateAccountLink;
