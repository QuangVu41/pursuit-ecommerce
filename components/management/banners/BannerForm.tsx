'use client';

import { BannerFormsSchema, BannerFormSchemaType } from '@/schemas/banners';
import { zodResolver } from '@hookform/resolvers/zod';
import { BannerType } from '@prisma/client';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormWrapper from '@/components/common/FormWrapper';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import BannerImagePreview from './BannerImagePreview';
import { useBannerPreviewImage } from '@/hooks/use-banner-preview-image';
import { createBannerAct, updateBannerAct } from '@/actions/banners';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { BannerWithImagesType } from '@/types/banners';

type BannerFormProps = { mode: 'create'; banner?: never } | { mode: 'edit'; banner: BannerWithImagesType };

const BannerForm = ({ mode, banner }: BannerFormProps) => {
  const defaultValues: BannerFormSchemaType =
    mode === 'create'
      ? {
          title: '',
          description: '',
          type: BannerType.hero,
          images: [],
          mode,
        }
      : {
          id: banner.id,
          title: banner.title,
          description: banner.description,
          type: banner.type,
          images: banner.bannerImages.map((img) => ({
            imgId: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            imageFile: new File([], img.imageUrl),
          })),
          mode,
        };
  const [isPending, startTransition] = useTransition();
  const form = useForm<BannerFormSchemaType>({
    resolver: zodResolver(BannerFormsSchema),
    defaultValues: defaultValues,
  });
  const fieldImagesArrUtils = useFieldArray({
    control: form.control,
    name: 'images',
  });
  const { handleFileChange, handleRemoveImage } = useBannerPreviewImage(fieldImagesArrUtils);

  const handleSubmit = (data: BannerFormSchemaType, btnCloseRef?: HTMLButtonElement | null) => {
    startTransition(() => {
      if (mode === 'create')
        createBannerAct(data).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            form.reset();
            btnCloseRef?.click();
          }
        });
      else if (mode === 'edit') {
        updateBannerAct(data).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            btnCloseRef?.click();
          }
        });
      }
    });
  };

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit} className='overflow-y-auto'>
      {mode === 'edit' && (
        <FormField
          control={form.control}
          name='id'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder='Find the best styles of modern T-Shirt' type='text' hidden />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Find the best styles of modern T-Shirt' type='text' disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='type'
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
              <FormLabel>Banner type*</FormLabel>
              <FormControl>
                <SelectTrigger className='w-full capitalize'>
                  <SelectValue placeholder='Clothing' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.values(BannerType).map((type) => (
                  <SelectItem key={type} value={type} className='capitalize'>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description*</FormLabel>
            <FormControl>
              <Textarea
                placeholder='The most wanted styles is waiting for you. Find the best styles of modern T-Shirt for you .'
                className='resize-none'
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <BannerImagePreview
        form={form}
        fields={fieldImagesArrUtils.fields}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        isPending={isPending}
      />
      <Button className='w-full lg:h-[52px] h-12 text-lg bg-primary' disabled={isPending}>
        {mode === 'create' ? 'Create' : 'Save Changes'}
      </Button>
    </FormWrapper>
  );
};

export default BannerForm;
