import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

const FooterSocial = () => {
  return (
    <div className='flex flex-col gap-y-4 text-base text-muted'>
      <h5 className='text-lg font-bold mt-2'>Follow us</h5>
      <div className='flex items-center gap-x-2'>
        <Button className='bg-home-foreground hover:bg-home-primary rounded-none' size='icon' asChild>
          <Link href='#'>
            <Facebook />
          </Link>
        </Button>
        <Button className='bg-home-foreground hover:bg-home-primary rounded-none' size='icon' asChild>
          <Link href='#'>
            <Linkedin />
          </Link>
        </Button>
        <Button className='bg-home-foreground hover:bg-home-primary rounded-none' size='icon' asChild>
          <Link href='#'>
            <Twitter />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FooterSocial;
