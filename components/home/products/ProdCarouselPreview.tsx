import { Carousel, CarouselContent, CarouselItem, CustomDotButton } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ProductWithCateAndImg } from '@/types/products';
import ProdCard from '@/components/home/products/ProdCard';
import Link from 'next/link';

interface ProdCarouselPreviewProps {
  products: ProductWithCateAndImg[];
  buttonLink?: string;
}

const ProdCarouselPreview = ({ products, buttonLink }: ProdCarouselPreviewProps) => {
  return (
    <Carousel>
      <CarouselContent className='-ml-2 md:-ml-4 pb-5 px-2 md:px-4'>
        {products.map((prod) => (
          <CarouselItem key={prod.id} className='basis-1/2 sm:basis-1/3 2md:basis-1/4 xl:basis-1/5 pl-2 md:pl-4'>
            <ProdCard prod={prod} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CustomDotButton className='mt-5 md:mt-[35px]' ctnClassName='' />
      {buttonLink && (
        <Button variant='homeOutline' size='homeDefault' asChild className='flex md:hidden w-full mt-10 text-base py-3'>
          <Link href={buttonLink}>Browse All</Link>
        </Button>
      )}
    </Carousel>
  );
};

export default ProdCarouselPreview;
