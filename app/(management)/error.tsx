'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset, error }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error(error);

  return (
    <div className='flex flex-col items-center justify-center gap-y-2'>
      <h2 className='text-2xl text-destructive'>Something went wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
