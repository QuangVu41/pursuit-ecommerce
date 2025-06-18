import Link from 'next/link';

const BtnLogo = () => {
  return (
    <Link href='/'>
      <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
        P
      </div>
      <div className='flex flex-col gap-0.5 leading-none'>
        <span className='font-semibold'>Pursuit</span>
      </div>
    </Link>
  );
};

export default BtnLogo;
