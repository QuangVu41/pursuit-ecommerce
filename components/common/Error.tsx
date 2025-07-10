import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({ reset, error }: { error: Error & { digest?: string }; reset: () => void }) {
  console.log(error);

  return (
    <HomeSectionContainer ctnClassName='flex items-center justify-center mb-10 md:mb-[60px]'>
      <Card className='w-[350px] rounded-none'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            <XCircle className='size-12 rounded-full bg-destructive/30 text-destructive p-2' />
          </div>
          <div className='mt-3 text-center sm:mt-5 w-full'>
            <h3 className='text-lg text-destructive leading-6 font-medium'>Something went wrong!</h3>
            <div className='flex items-center gap-x-2'>
              <Button variant='homeOutline' className='mt-5 sm:mt-6 flex-1 rounded-none' asChild>
                <Link href='/'>Back to Home page</Link>
              </Button>
              <Button variant='homeDefault' className='mt-5 sm:mt-6 flex-1 rounded-none' onClick={() => reset()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </HomeSectionContainer>
  );
}
