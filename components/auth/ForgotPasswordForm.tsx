'use client';

import { ForgotPasswordSchema, ForgotPasswordSchemaType } from '@/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthForm from '@/components/auth/AuthForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { sendPasswordResetVerification } from '@/actions/auth';
import { toast } from 'sonner';

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleResendCode = () => {
    if (!form.getValues('email')) {
      form.setError('email', { type: 'onChange', message: 'Email is required to resend the verification link.' });
      return;
    }
    startTransition(() => {
      const email = form.getValues('email');
      sendPasswordResetVerification(email).then((res) => {
        if (res?.error) toast.error(res?.error);
        else toast.success(res?.success);
      });
    });
  };

  const handleSubmit = (data: ForgotPasswordSchemaType) => {
    startTransition(() => {
      sendPasswordResetVerification(data.email).then((res) => {
        if (res?.error) {
          toast.error(res?.error);
        } else {
          toast.success(res?.success);
        }
      });
    });
  };

  return (
    <AuthForm
      title='Forgot Password'
      description='Enter your email below to receive a password reset link.'
      form={form}
      buttonLinkLabel='Sign In'
      buttonLinkHref='/auth/signin'
      ctaQuestion='Back to Sign In?'
      handleSubmit={handleSubmit}
      showSocial={false}
    >
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <div className='flex items-center justify-between'>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Button
                type='button'
                variant='link'
                className='text-foreground'
                size='sm'
                onClick={handleResendCode}
                disabled={isPending}
              >
                Don&apos;t get the link?
              </Button>
            </div>
            <FormControl>
              <Input {...field} id='email' placeholder='example@gmai.com' type='email' disabled={isPending} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button className='w-full' disabled={isPending}>
        Submit
      </Button>
    </AuthForm>
  );
};

export default ForgotPasswordForm;
