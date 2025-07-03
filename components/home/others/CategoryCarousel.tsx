import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Category } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCarouselProps {
  categories: Category[][];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  return (
    <Carousel>
      <CarouselContent className='ml-0'>
        {categories.map((cateGroup, idx) => (
          <CarouselItem
            key={idx}
            className='basis-1/3 xs:basis-1/4 sm:basis-1/5 md:basis-1/6 lg:basis-1/7 xl:basis-1/8 pl-0 border-t border-home-primary first:border-l'
          >
            <div className='grid grid-rows-2 h-full'>
              {cateGroup.map((cate) => (
                <Link
                  key={cate.id}
                  href={`/products?category=${cate.id}`}
                  className='block px-2 sm:px-3 py-4 border-b border-r border-home-primary hover:shadow-xl transition-shadow'
                >
                  <figure className='relative size-20 mx-auto bg-home-hero rounded-sm overflow-hidden'>
                    <Image
                      src={cate.imageUrl}
                      alt={cate.altText}
                      width={80}
                      height={80}
                      className='absolute inset-0 w-full h-full object-cover'
                    />
                  </figure>
                  <h3 className='text-sm text-center capitalize mt-2'>{cate.name}</h3>
                </Link>
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='hidden md:inline-flex' />
      <CarouselNext className='hidden md:inline-flex' />
    </Carousel>
  );
};

export default CategoryCarousel;
