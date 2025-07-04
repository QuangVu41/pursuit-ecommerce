'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ProductImage } from '@prisma/client';
import Image from 'next/image';
import { useProdImgPreviewStore } from './ProdImagePreviewProvider';

interface ProdImgPreviewProps {
  prodImgs: ProductImage[];
}

const ProdImgPreview = ({ prodImgs }: ProdImgPreviewProps) => {
  const mainImg = useProdImgPreviewStore((state) => state.mainImg);
  const variantImg = useProdImgPreviewStore((state) => state.variantImg);
  const setMainImg = useProdImgPreviewStore((state) => state.setMainImg);

  return (
    <div className='flex flex-col gap-5 w-full 2md:w-auto'>
      <figure className='aspect-square 2md:aspect-auto w-full 2md:size-[370px] lg:size-[450] relative'>
        <Image
          src={variantImg.imgUrl || mainImg.imgUrl}
          alt={variantImg.altText || mainImg.altText}
          width={450}
          height={450}
          className='object-cover absolute inset-0 w-full h-full'
        />
      </figure>
      <Carousel>
        <CarouselContent>
          {prodImgs.map((img) => (
            <CarouselItem key={img.id} className='basis-1/4'>
              <figure
                className={`aspect-square 2md:aspect-auto 2md:h-[100px] relative border-2 ${
                  img.imageUrl === mainImg.imgUrl ? 'border-home-primary' : 'border-transparent'
                }`}
                onMouseOver={() => setMainImg({ imgUrl: img.imageUrl, altText: img.altText })}
                onTouchStart={() => setMainImg({ imgUrl: img.imageUrl, altText: img.altText })}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.altText}
                  width={100}
                  height={100}
                  className='object-cover absolute inset-0 w-full h-full'
                />
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className='hidden lg:inline-flex' />
        <CarouselPrevious className='hidden lg:inline-flex' />
      </Carousel>
    </div>
  );
};

export default ProdImgPreview;
