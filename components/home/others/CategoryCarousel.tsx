import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Category } from '@prisma/client';
import Image from 'next/image';

interface CategoryCarouselProps {
  categories: Category[][];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
  return (
    <Carousel>
      <CarouselContent className='ml-0'>
        {categories.map((cateGroup, idx) => (
          <CarouselItem key={idx} className='basis-1/8 pl-0'>
            <div className='flex flex-col h-full'>
              {cateGroup.map((cate) => (
                <section key={cate.id} className='grid grid-rows-2 gap-y-2 justify-items-center px-3 py-4 border'>
                  <figure className='relative size-20'>
                    <Image
                      src={cate.imageUrl}
                      alt={cate.altText}
                      width={80}
                      height={80}
                      className='absolute inset-0 w-full h-full object-cover rounded-sm'
                    />
                  </figure>
                  <h3 className='text-sm text-center capitalize'>{cate.name}</h3>
                </section>
              ))}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CategoryCarousel;
