import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <HomeSectionContainer ctnClassName='flex items-center justify-center mb-10 md:mb-[60px]'>
      <Card className='w-[350px] rounded-none'>
        <div className='p-6'>
          <div className='w-full flex justify-center'>
            <XCircle className='size-12 rounded-full bg-destructive/30 text-destructive p-2' />
          </div>
          <div className='mt-3 text-center sm:mt-5 w-full'>
            <h3 className='text-lg text-destructive leading-6 font-medium'>404 Page Not Found!</h3>
          </div>
        </div>
      </Card>
    </HomeSectionContainer>
  );
};

export default NotFound;
