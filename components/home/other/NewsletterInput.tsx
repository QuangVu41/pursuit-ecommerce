import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const NewsletterInput = () => {
  return (
    <div className='flex items-center p-3 bg-background max-w-full w-[450px] mt-5'>
      <InputHome
        className='h-8 lg:h-10 placeholder:text-foreground/70 text-foreground'
        placeholder='Enter your email address'
      />
      <Button variant='homeDefault' size='icon' className='size-8 lg:size-10 rounded-none'>
        <Send />
      </Button>
    </div>
  );
};

export default NewsletterInput;
