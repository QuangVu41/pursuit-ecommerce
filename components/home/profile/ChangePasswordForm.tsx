'use client';

import { UserPasswordChangeSchema, UserPasswordChangeSchemaType } from '@/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import FormWrapper from '@/components/common/FormWrapper';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import InputHome from '@/components/common/InputHome';
import { Button } from '@/components/ui/button';
import { changeUserPasswordAct } from '@/actions/user';
import { toast } from 'sonner';

const ChangePasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<UserPasswordChangeSchemaType>({
    resolver: zodResolver(UserPasswordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = (data: UserPasswordChangeSchemaType) => {
    startTransition(() => {
      changeUserPasswordAct(data).then((res) => {
        if (res?.error) {
          toast.error(res.error);
        }
        if (res?.success) {
          toast.success(res.success);
          form.reset();
        }
      });
    });
  };

  return (
    <FormWrapper form={form} handleSubmit={handleSubmit} isModal={false} className='!px-0'>
      <FormField
        control={form.control}
        name='currentPassword'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current password*</FormLabel>
            <FormControl>
              <InputHome
                {...field}
                placeholder='********'
                type='password'
                disabled={isPending}
                className='text-foreground bg-background placeholder:text-muted-foreground'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='newPassword'
        render={({ field }) => (
          <FormItem>
            <FormLabel>New password*</FormLabel>
            <FormControl>
              <InputHome
                {...field}
                placeholder='********'
                type='password'
                className='text-foreground bg-background placeholder:text-muted-foreground'
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='confirmPassword'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm password*</FormLabel>
            <FormControl>
              <InputHome
                {...field}
                placeholder='********'
                type='password'
                disabled={isPending}
                className='text-foreground bg-background placeholder:text-muted-foreground'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex'>
        <Button variant='homeDefault' className='w-full md:w-auto ml-auto rounded-none text-base' disabled={isPending}>
          Save Changes
        </Button>
      </div>
    </FormWrapper>
  );
};

export default ChangePasswordForm;
