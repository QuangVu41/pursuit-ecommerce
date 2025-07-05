'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset, error }: { error: Error & { digest?: string }; reset: () => void }) {
  console.log(error);

  return (
    <div className='flex flex-col items-center justify-center gap-y-2 my-10 md:my-[60px]'>
      <h2 className='text-2xl text-destructive'>Something went wrong!</h2>
      <Button variant='homeDefault' className='rounded-none' onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
