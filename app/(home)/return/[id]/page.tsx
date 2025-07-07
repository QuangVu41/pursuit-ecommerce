import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const ReturnPage = () => {
  return (
    <HomeSectionContainer className='flex items-center justify-center mb-10 md:mb-[60px]'>
      <Card className='w-[350px] rounded-none'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            <Check className='size-12 rounded-full bg-green-500/30 text-green-500 p-2' />
          </div>
          <div className='mt-3 text-center sm:mt-5 w-full'>
            <h3 className='text-lg leading-6 font-medium'>Linking was Successful</h3>
            <p className='mt-2 text-sm text-muted-foreground'>
              Congrats on linking your account to Pursuit. You can now start selling your products.
            </p>
            <Button variant='homeDefault' className='mt-5 sm:mt-6 w-full rounded-none' asChild>
              <Link href='/'>Back to HomeReturnPage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </HomeSectionContainer>
  );
};

export default ReturnPage;
