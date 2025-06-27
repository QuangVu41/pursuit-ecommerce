'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FormWrapper from '@/components/common/FormWrapper';
import { useCateFormContext } from './CateFormProvider';
import { useRef } from 'react';
import { FilePenLine, FilePlus2 } from 'lucide-react';
import { MAX_IMAGE_SIZE } from '@/lib/constants';
import { toast } from 'sonner';
import { useWatch } from 'react-hook-form';
import Image from 'next/image';

const CateForm = () => {
  const { form, handleSubmit, isPending, mode, cateSelectItems } = useCateFormContext();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const imageUrl = useWatch({ control: form.control, name: 'imageUrl' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) return toast.error(`Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`);

      const imageUrl = URL.createObjectURL(file);
      form.setValue('imageFile', file);
      form.setValue('imageUrl', imageUrl);
    }
    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit}>
      {mode === 'edit' && (
        <FormField
          control={form.control}
          name='id'
          render={({ field }) => (
            <FormItem className='hidden'>
              <FormControl>
                <Input {...field} type='text' hidden />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name*</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Sweater' type='text' disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='parentId'
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
              <FormLabel>Parent category</FormLabel>
              <FormControl>
                <SelectTrigger className='w-full capitalize'>
                  <SelectValue placeholder='Clothing' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>{cateSelectItems}</SelectContent>
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Fashionable apparel for men.'
                className='resize-none'
                {...field}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='imageUrl'
        render={() => (
          <FormItem>
            <FormLabel htmlFor='cate-file'>Image*</FormLabel>
            <FormControl>
              <div className='flex aria-invalid:border-destructive aria-invalid:border rounded-lg'>
                <figure
                  className='group basis-full aspect-square relative flex flex-col items-center justify-center bg-muted rounded-lg shadow-md cursor-pointer p-2 overflow-hidden'
                  onClick={() => !isPending && inputFileRef.current?.click()}
                >
                  {imageUrl && (
                    <>
                      <Image
                        src={imageUrl}
                        alt={`${form.getValues('altText') || 'Category image'}`}
                        height={208}
                        width={208}
                        className='object-cover absolute inset-0 w-full h-full'
                      />
                      <FilePenLine className='w-5 h-5 text-foreground/70 group-hover:text-foreground top-2 right-2 absolute' />
                    </>
                  )}
                  {!imageUrl && (
                    <>
                      <FilePlus2 className='w-5 h-5 text-primary/70 group-hover:text-primary top-2 right-2 absolute' />
                      <p className='font-manrope text-xl font-bold text-foreground/70 group-hover:text-foreground'>
                        320 X 320
                      </p>
                      <p className='text-foreground/70 group-hover:text-foreground text-center text-sm w-9/10'>
                        Upload an image according to the expected ratio
                      </p>
                    </>
                  )}
                  <input
                    ref={inputFileRef}
                    id='cate-file'
                    type='file'
                    onChange={handleInputChange}
                    hidden
                    name='imageFile'
                  />
                </figure>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className='w-full lg:h-[52px] h-12 text-lg bg-primary' disabled={isPending}>
        {mode === 'create' ? 'Create Category' : 'Save Changes'}
      </Button>
    </FormWrapper>
  );
};

export default CateForm;
