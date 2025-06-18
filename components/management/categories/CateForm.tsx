'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import FormWrapper from '@/components/common/FormWrapper';
import { useCateFormContext } from './CateFormProvider';

const CateForm = () => {
  const { form, handleSubmit, isPending, mode, cateSelectItems } = useCateFormContext();

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit}>
      {mode === 'edit' && (
        <FormField
          control={form.control}
          name='id'
          render={({ field }) => (
            <FormItem className='hidden'>
              <FormControl>
                <Input className='md:text-xl' {...field} type='text' hidden />
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
              <Input className='md:text-xl' {...field} placeholder='Sweater' type='text' disabled={isPending} />
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
              <FormLabel>Parent Category</FormLabel>
              <FormControl>
                <SelectTrigger className='w-full md:text-xl capitalize'>
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
                className='md:text-xl resize-none'
                {...field}
                disabled={isPending}
              />
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
