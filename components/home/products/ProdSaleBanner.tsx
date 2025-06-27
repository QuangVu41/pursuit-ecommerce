'use client';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRef } from 'react';
import { BannerImage } from '@prisma/client';

interface ProdSaleBannerProps {
  bannerImages: BannerImage[];
}

const ProdSaleBanner = ({ bannerImages }: ProdSaleBannerProps) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
      <CarouselContent>
        {bannerImages.map((img) => (
          <CarouselItem key={img.id}>
            <figure className='overflow-hidden relative w-full h-[220px] md:h-[360px] bg-home-banner '>
              <Image src={img.imageUrl} alt={img.altText} fill className='object-contain' />
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ProdSaleBanner;
