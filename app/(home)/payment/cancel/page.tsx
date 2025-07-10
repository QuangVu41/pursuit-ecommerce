import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

const CancelPage = () => {
  return (
    <HomeSectionContainer ctnClassName='flex items-center justify-center mb-10 md:mb-[60px]'>
      <Card className='w-[350px] rounded-none'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            <XCircle className='size-12 rounded-full bg-destructive/30 text-destructive p-2' />
          </div>
          <div className='mt-3 text-center sm:mt-5 w-full'>
            <h3 className='text-lg leading-6 font-medium'>Payment Canceled</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Something went wrong with your payment. You haven&apos;t get charged. Please try again!
            </p>
            <Button variant='homeDefault' className='mt-5 sm:mt-6 w-full rounded-none' asChild>
              <Link href='/'>Back to Home page</Link>
            </Button>
          </div>
        </div>
      </Card>
    </HomeSectionContainer>
  );
};

export default CancelPage;
