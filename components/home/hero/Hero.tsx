import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HeroCTA from '@/components/home/hero/HeroCTA';
import HeroImage from './HeroImage';
import HeroCarouselProvider from './HeroCarouselProvider';
import { getHeroBanner } from '@/services/banners';

const Hero = async () => {
  const heroBanner = await getHeroBanner();

  return (
    heroBanner && (
      <HomeSectionContainer className='!mt-0 py-[60px] md:py-[70px] bg-home-hero'>
        <HeroCarouselProvider>
          <div className='flex flex-col md:flex-row md:gap-x-10 lg:gap-x-16 xl:gap-x-32 md:items-center gap-y-10'>
            <HeroCTA title={heroBanner.title} description={heroBanner.description} />
            <HeroImage bannerImages={heroBanner.bannerImages} />
          </div>
        </HeroCarouselProvider>
      </HomeSectionContainer>
    )
  );
};

export default Hero;
