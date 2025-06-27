import { CarouselContent, CarouselItem, CustomDotButton } from '@/components/ui/carousel';
import { BannerImage } from '@prisma/client';
import Image from 'next/image';

interface HeroImageProps {
  bannerImages: BannerImage[];
}

const HeroImage = ({ bannerImages }: HeroImageProps) => {
  return (
    <div className='flex-1 relative'>
      <CarouselContent className='relative z-10'>
        {bannerImages.map(
          (img) =>
            img.imageUrl && (
              <CarouselItem key={img.imageUrl}>
                <div className='relative w-full xs:w-3/5 mx-auto md:w-full h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] z-10'>
                  <figure className='absolute inset-5 md:inset-7 z-10'>
                    <Image
                      src={img.imageUrl}
                      alt={img.altText}
                      className='object-cover object-center'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      fill
                    />
                  </figure>
                </div>
              </CarouselItem>
            )
        )}
      </CarouselContent>
      <CustomDotButton ctnClassName='mt-[60px] w-[110px] gap-x-2' className='bg-background md:hidden' />
      <span className='absolute top-0 left-0 xs:left-2/10 md:left-0 right-1/2 bottom-2/5 border-[6px] border-home-primary z-1'></span>
      <span className='absolute bottom-[12%] md:bottom-1/10 right-0 xs:right-2/10 md:right-0 top-3/10 left-1/2 bg-home-primary z-1'></span>
    </div>
  );
};

export default HeroImage;
