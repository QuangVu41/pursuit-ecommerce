import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

const AboutPage = () => {
  return (
    <HomeSectionContainer className='mb-10 md:mb-[60px]'>
      <h1 className='flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center text-4xl font-bold leading-none tracking-wide sm:text-6xl'>
        We love
        <span className='bg-home-primary py-2 px-4 rounded-lg tracking-widest text-white'>Pursuit</span>
      </h1>
      <p className='mt-6 text-center text-lg tracking-wide leading-8 max-w-2xl mx-auto text-muted-foreground'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero hic distinctio ducimus temporibus nobis autem
        laboriosam repellat, magni fugiat minima excepturi neque, tenetur possimus nihil atque! Culpa nulla labore nam?
      </p>
    </HomeSectionContainer>
  );
};

export default AboutPage;
