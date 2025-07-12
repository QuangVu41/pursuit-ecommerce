'use client';

import FormWrapper from '@/components/common/FormWrapper';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { MAX_ALLOWED_ATTR_VALUE } from '@/lib/constants';
import { useAttrFormContext } from './AttrFormProvider';

const AttrForm = () => {
  const { handleSubmit, form, fields, remove, append, isPending, mode } = useAttrFormContext();

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
              <Input {...field} placeholder='Size' type='text' disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {fields.map((fieldWId, index) => (
        <FormField
          key={`${fieldWId.id}${Math.random()}`}
          control={form.control}
          name={`values.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`Value ${index + 1}*`}</FormLabel>
              <div className='flex items-center gap-x-2'>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={`M-55kg (Maximum ${MAX_ALLOWED_ATTR_VALUE} values)`}
                    type='text'
                    disabled={isPending}
                  />
                </FormControl>
                {index > 0 && (
                  <Button
                    variant='destructive'
                    size='icon'
                    type='button'
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Minus />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      {fields.length < MAX_ALLOWED_ATTR_VALUE && (
        <div className='flex justify-end'>
          <Button type='button' onClick={() => append(mode === 'create' ? { value: '' } : { value: '', fieldId: '' })}>
            <Plus /> More value
          </Button>
        </div>
      )}
      <Button className='w-full text-base bg-primary' disabled={isPending}>
        {mode === 'create' ? 'Create Attribute' : 'Save Changes'}
      </Button>
    </FormWrapper>
  );
};

export default AttrForm;
