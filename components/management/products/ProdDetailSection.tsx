import dynamic from 'next/dynamic';
import SectionContainer from '@/components/common/SectionContainer';
import SectionHeader from '@/components/common/SectionHeader';
import SectionTitle from '@/components/common/SectionTitle';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProdFormSchemaType } from '@/schemas/products';
import { UseFormReturn } from 'react-hook-form';
import 'react-quill-new/dist/quill.snow.css';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      ['link', 'formula'],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['clean'],
    ],
  },
};

interface ProdDetailSectionProps {
  form: UseFormReturn<ProdFormSchemaType>;
  cateSelectItems: React.ReactNode;
  isPending: boolean;
}

const ProdDetailSection = ({ form, cateSelectItems, isPending }: ProdDetailSectionProps) => {
  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle title='Product Detail' />
      </SectionHeader>
      <div className='grid sm:grid-cols-2 xl:grid-cols-3 gap-3 items-start'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='sm:col-span-2 xl:col-span-1'>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input
                  className='bg-background flex-1'
                  {...field}
                  placeholder='Modern T-Shirt'
                  type='text'
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormLabel>Category*</FormLabel>
                <FormControl>
                  <SelectTrigger className='w-full bg-background capitalize' disabled={isPending}>
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
          name='regularPrice'
          render={({ field }) => (
            <FormItem className='flex-2'>
              <FormLabel>Regular price*</FormLabel>
              <FormControl>
                <Input
                  className='bg-background resize-none'
                  {...field}
                  placeholder='₫ 70000'
                  type='number'
                  maxLength={10}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name='summary'
        render={({ field }) => (
          <FormItem className='sm:col-span-2'>
            <FormLabel>Summary*</FormLabel>
            <FormControl>
              <Textarea
                className='bg-background resize-none'
                {...field}
                placeholder='70 characters long'
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem className='flex flex-col gap-y-2'>
            <FormLabel>Description*</FormLabel>
            <FormControl>
              <ReactQuill
                modules={modules}
                theme='snow'
                className={`bg-background h-auto rounded-md dark:bg-input/30 ${isPending ? 'opacity-50' : ''}`}
                readOnly={isPending}
                value={field.value}
                onChange={field.onChange}
                placeholder='100 characters long'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </SectionContainer>
  );
};

export default ProdDetailSection;
