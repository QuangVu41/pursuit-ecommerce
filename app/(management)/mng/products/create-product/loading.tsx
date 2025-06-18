import { Skeleton } from '@/components/ui/skeleton';

const CreateProdLoading = () => {
  return (
    <div className='space-y-3'>
      {/* Image Section Skeleton */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-1/4 sm:w-1/6' />
        <div className='flex gap-4'>
          <Skeleton className='aspect-square basis-full xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5' />
          <Skeleton className='aspect-square basis-full xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5' />
        </div>
      </div>

      {/* Detail Section Skeleton */}
      <div className='space-y-4'>
        <Skeleton className='h-6 w-1/4 sm:w-1/6' />
        <Skeleton className='h-96 w-full' />
      </div>
    </div>
  );
};

export default CreateProdLoading;
