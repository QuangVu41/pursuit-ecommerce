import Image from 'next/image';
import Link from 'next/link';

const BtnLogo = () => {
  return (
    <Link href='/'>
      <Image src={'/logo.png'} alt='Logo' width={32} height={32} className='size-8 object-cover bg-primary rounded-md' />
      <div className='flex flex-col gap-0.5 leading-none'>
        <span className='font-semibold'>Pursuit</span>
      </div>
    </Link>
  );
};

export default BtnLogo;
