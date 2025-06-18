import InputHome from '@/components/common/InputHome';
import { Search } from 'lucide-react';

const MainSearch = () => {
  return (
    <div className='flex items-center w-full col-span-2 md:col-span-1'>
      <InputHome className='h-10 md:h-11' placeholder='Search products...' />
      <span className='flex size-10 md:size-11 items-center justify-center bg-home-popup hover:bg-home-popup/90 transition- shrink-0 -ml-[1px]'>
        <Search className='text-home-primary' />
      </span>
    </div>
  );
};

export default MainSearch;
