'use client';

import { Carousel } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

interface HeroCarouselProviderProps {
  children: React.ReactNode;
}

const HeroCarouselProvider = ({ children }: HeroCarouselProviderProps) => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <Carousel plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
      {children}
    </Carousel>
  );
};

export default HeroCarouselProvider;
