import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className='w-full h-screen flex justify-center'>
      <Loader2 className='size-24 mt-6 text-home-primary animate-spin' />
    </div>
  );
};

export default Loading;
