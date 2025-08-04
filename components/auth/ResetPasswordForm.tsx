'use client';

import { ResetPasswordSchema, ResetPasswordSchemaType } from '@/schemas/auth';
import AuthForm from '@/components/auth/AuthForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/actions/auth';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useUrl } from '@/hooks/use-url';

const ResetPasswordForm = () => {
  const { router } = useUrl();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, startTransition] = useTransition();
  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSubmit = (data: ResetPasswordSchemaType) => {
    startTransition(() => {
      resetPassword(data, token).then((res) => {
        if (res?.error) {
          toast.error(res.error);
        } else {
          toast.success('Password reset successfully!');
          router.push('/auth/signin');
        }
      });
    });
  };

  return (
    <AuthForm
      title='Reset Password'
      description='Enter your new password below.'
      form={form}
      buttonLinkLabel='Sign In'
      buttonLinkHref='/auth/signin'
      ctaQuestion='Back to Sign In?'
      handleSubmit={handleSubmit}
      showSocial={false}
    >
      <FormField
        control={form.control}
        name='password'
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor='password'>New password</FormLabel>
            <FormControl>
              <Input {...field} id='password' placeholder='********' type='password' disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className='w-full' disabled={isPending}>
        Save Change
      </Button>
    </AuthForm>
  );
};

export default ResetPasswordForm;
