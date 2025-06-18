import { Button } from '@/components/ui/button';
import { CustomDotButton } from '@/components/ui/carousel';
import Link from 'next/link';

const HeroCTA = () => {
  return (
    <div className='flex flex-col items-start gap-y-5 flex-1'>
      <h1 className='text-[40px] sm:text-[46px] lg:text-[50px] xl:text-[58px] font-bold leading-none'>
        Find the best styles of modern T-Shirt
      </h1>
      <p className='max-w-[470px] text-lg leading-relaxed text-foreground'>
        The most wanted styles is waiting for you. Find the best styles of modern T-Shirt for you .
      </p>
      <Button variant='homeDefault' size='homeDefault' className='mt-[14px] text-lg font-semibold' asChild>
        <Link href='/products'>Explore Products</Link>
      </Button>
      <div className='mt-10 md:mt-[60px] gap-x-2 w-full hidden md:block'>
        <CustomDotButton ctnClassName='w-[110px] gap-x-2' className='bg-background' />
      </div>
    </div>
  );
};

export default HeroCTA;
