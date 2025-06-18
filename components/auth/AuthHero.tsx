import Image from 'next/image';
import authHeroImg from '@/public/hero-auth.svg';

const AuthHero = () => {
  return (
    // <figure className='flex-1 hidden md:flex items-center justify-center flex-col gap-10 h-full'>
    //   <h2 className='font-bold text-3xl md:text-4xl lg:text-[46px] xl:text-[52px] max-w-[570px]'>
    //     Shop like a pro and save money
    //   </h2>
    //   <Image src={authHeroImg} alt='Hero Auth' className='object-contain' />
    // </figure>
    <figure className='relative hidden bg-tertiary lg:block'>
      <Image src={authHeroImg} alt='Hero Auth' className='object-contain p-4' fill />
    </figure>
  );
};

export default AuthHero;
