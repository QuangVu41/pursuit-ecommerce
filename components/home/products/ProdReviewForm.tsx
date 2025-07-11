'use client';

import { createReviewAct } from '@/actions/reviews';
import FormWrapper from '@/components/common/FormWrapper';
import InputHome from '@/components/common/InputHome';
import TextareaHome from '@/components/common/TextareaHome';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReviewSchema, ReviewSchemaType } from '@/schemas/review';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProdReviewFormProps {
  hasPurchased: boolean;
  hasReviewed: boolean;
  productId: string;
}

const ProdReviewForm = ({ hasPurchased, hasReviewed, productId }: ProdReviewFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ReviewSchemaType>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 5,
      title: '',
      content: '',
      productId,
    },
  });

  const handleSubmit = async (data: ReviewSchemaType) => {
    startTransition(() => {
      createReviewAct(data).then((res) => {
        if (res?.error) return toast.error(res.error);
        if (res?.success) {
          toast.success(res.success);
          form.reset();
        }
      });
    });
  };

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit} isModal={false} className='!px-0 flex-1'>
      <div className='flex flex-col gap-4'>
        <h3 className='font-bold'>How would you rate this?</h3>
        <div className='flex flex-col lg:flex-row lg:items-center gap-1 italic'>
          <FormField
            control={form.control}
            name='rating'
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                  disabled={hasReviewed || !hasPurchased || isPending}
                >
                  <FormControl>
                    <SelectTrigger className='capitalize rounded-none'>
                      <SelectValue placeholder='5' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, idx) => (
                      <SelectItem key={idx} value={(5 - idx).toString()}>
                        {5 - idx} <Star className='fill-yellow-500 stroke-yellow-500' />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {hasPurchased ? (
            <p className='text-sm 2md:text-base flex items-center gap-0.5 font-medium'>
              You have purchased this product.
              <Link className='text-primary flex items-center gap-0.5 hover:underline' href='/profile/orders'>
                Go to Orders
                <ArrowRight className='size-4' />
              </Link>
            </p>
          ) : (
            <p className='text-sm 2md:text-base text-amber-600 font-medium'>Purchase to leave a review!</p>
          )}
        </div>
      </div>
      <FormField
        control={form.control}
        name='productId'
        render={({ field }) => (
          <FormItem className='hidden'>
            <FormControl>
              <InputHome {...field} type='text' hidden />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <InputHome
                {...field}
                placeholder='Great product!'
                type='text'
                className='text-foreground bg-background placeholder:text-foreground/70'
                disabled={hasReviewed || !hasPurchased || isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='content'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Write a review*</FormLabel>
            <FormControl>
              <TextareaHome
                {...field}
                placeholder='This product is amazing! I love it because...'
                className='text-foreground bg-background placeholder:text-foreground/70 resize-none'
                disabled={hasReviewed || !hasPurchased || isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex'>
        <Button
          className='rounded-none ml-auto'
          variant='homeDefault'
          disabled={hasReviewed || !hasPurchased || isPending}
        >
          Submit Review
        </Button>
      </div>
    </FormWrapper>
  );
};

export default ProdReviewForm;
