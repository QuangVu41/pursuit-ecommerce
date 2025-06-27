'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { FilePlus2, Minus } from 'lucide-react';
import { useRef } from 'react';
import SectionContainer from '@/components/common/SectionContainer';
import { Checkbox } from '@/components/ui/checkbox';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import { ProdImagesWithIdType } from '@/types/products';
import { MAX_PROD_IMAGE_UPLOAD } from '@/lib/constants';
import { UseFormReturn } from 'react-hook-form';
import { ProdFormSchemaType } from '@/schemas/products';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ProdImageSectionProps {
  form: UseFormReturn<ProdFormSchemaType>;
  fields: ProdImagesWithIdType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (idx: number) => void;
  handleCheckboxChange: (isChecked: boolean, idx: number) => void;
  isPending: boolean;
}

const ProdImageSection = ({
  fields,
  handleFileChange,
  handleRemoveImage,
  handleCheckboxChange,
  isPending,
  form,
}: ProdImageSectionProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  return (
    <SectionContainer>
      <FormField
        control={form.control}
        name='images'
        render={() => (
          <FormItem>
            <FormLabel htmlFor='prod-img' className='font-medium text-base'>
              Product Images*
            </FormLabel>
            <FormControl>
              <Carousel
                opts={{
                  align: 'start',
                }}
                className='w-full group/prod-img'
              >
                <CarouselContent>
                  {fields.length < MAX_PROD_IMAGE_UPLOAD && (
                    <CarouselItem className='basis-full xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5'>
                      <div
                        className={`relative group aspect-square rounded-lg overflow-hidden flex flex-col items-center justify-center bg-background/70 cursor-pointer p-2  group-aria-invalid/prod-img:border-destructive group-aria-invalid/prod-img:border ${
                          isPending ? 'opacity-50' : ''
                        }`}
                        onClick={() => inputFileRef.current?.click()}
                      >
                        <input
                          ref={inputFileRef}
                          type='file'
                          id='prod-img'
                          hidden
                          onChange={handleFileChange}
                          multiple
                          disabled={isPending}
                        />
                        <FilePlus2 className='w-5 h-5 text-primary/70 group-hover:text-primary top-2 right-2 absolute' />
                        <p className='font-manrope text-lg font-bold text-foreground/70 group-hover:text-foreground'>
                          870 X 870
                        </p>
                        <p className='text-foreground/70 group-hover:text-foreground text-center text-sm'>
                          Expected ratio (max 10 images)
                        </p>
                      </div>
                    </CarouselItem>
                  )}
                  {fields.map((field, idx) => (
                    <CarouselItem
                      key={`${field.id}-${Math.random()}`}
                      className='xs:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 group'
                    >
                      <figure className='relative aspect-square rounded-lg overflow-hidden shadow-md'>
                        <Image
                          src={field.imageUrl}
                          alt={field.altText || `Product image ${idx + 1}`}
                          fill
                          className='object-cover'
                        />
                        <div className='absolute flex gap-x-2 right-2 top-2 invisible group-hover:visible transition-all'>
                          <TooltipWrapper
                            content={field.isPrimary ? undefined : 'Mark as primary image, only 1 image can be primary'}
                          >
                            <Checkbox
                              className='w-6 h-6'
                              checked={field.isPrimary}
                              onCheckedChange={(isChecked) => handleCheckboxChange(isChecked as boolean, idx)}
                              disabled={isPending}
                            />
                          </TooltipWrapper>
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
                </CarouselContent>
              </Carousel>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SectionContainer>
  );
};

export default ProdImageSection;
