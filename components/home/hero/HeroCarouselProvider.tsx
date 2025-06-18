import { Carousel } from '@/components/ui/carousel';

interface HeroCarouselProviderProps {
  children: React.ReactNode;
}

const HeroCarouselProvider = ({ children }: HeroCarouselProviderProps) => {
  return <Carousel>{children}</Carousel>;
};

export default HeroCarouselProvider;
