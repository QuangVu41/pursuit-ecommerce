'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FilePlus2, Minus } from 'lucide-react';
import { useRef } from 'react';
import { MAX_PROD_IMAGE_UPLOAD } from '@/lib/constants';
import { BannerImagesWithIdType } from '@/types/banners';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { BannerFormSchemaType } from '@/schemas/banners';
import { BannerType } from '@prisma/client';

interface BannerImagePreviewProps {
  form: UseFormReturn<BannerFormSchemaType>;
  fields: BannerImagesWithIdType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (idx: number) => void;
  isPending: boolean;
}

const BannerImagePreview = ({
  fields,
  handleFileChange,
  handleRemoveImage,
  isPending,
  form,
}: BannerImagePreviewProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const bannerType = useWatch({ control: form.control, name: 'type' });

  return (
    <FormField
      control={form.control}
      name='images'
      render={() => (
        <FormItem>
          <FormLabel htmlFor='banner-img'>Banner images*</FormLabel>
          <FormControl>
            <Carousel orientation='vertical' className='aria-invalid:border-destructive aria-invalid:border rounded-lg'>
              <CarouselContent>
                {fields.map((field, idx) => (
                  <CarouselItem key={`${field.id}`} className='basis-full xs:basis-1/2 group'>
                    <figure className='relative aspect-square rounded-lg overflow-hidden'>
                      <Image
                        src={field.imageUrl}
                        alt={field.altText || `Product image ${idx + 1}`}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute flex gap-x-2 right-2 top-2 md:invisible md:group-hover:visible transition-all'>
                        <Button
                          type='button'
                          variant='destructive'
                          size='icon'
                          className='w-6 h-6'
                          onClick={() => {
                            handleRemoveImage(idx);
                            if (inputFileRef.current) inputFileRef.current.value = '';
                          }}
                          disabled={isPending}
                        >
                          <Minus />
                        </Button>
                      </div>
                    </figure>
                  </CarouselItem>
                ))}
                {fields.length < MAX_PROD_IMAGE_UPLOAD && (
                  <CarouselItem className='basis-full xs:basis-1/2'>
                    <div
                      className={`relative group aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center bg-muted/70 cursor-pointer p-2 ${
                        isPending ? 'opacity-50' : ''
                      }`}
                      onClick={() => inputFileRef.current?.click()}
                    >
                      <input
                        ref={inputFileRef}
                        type='file'
                        id='banner-img'
                        hidden
                        onChange={handleFileChange}
                        multiple
                        disabled={isPending}
                      />
                      <FilePlus2 className='w-5 h-5 text-primary/70 group-hover:text-primary top-2 right-2 absolute' />
                      <p className='font-manrope text-lg font-bold text-foreground/70 group-hover:text-foreground'>
                        {bannerType === BannerType.hero ? '870 X 870' : '1265 x 360'}
                      </p>
                      <p className='text-foreground/70 group-hover:text-foreground text-center text-sm'>
                        Expected ratio (max 10 images)
                      </p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BannerImagePreview;
