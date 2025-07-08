'use client';

import { SignupSchema, SignupSchemaType } from '@/schemas/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import AuthForm from '@/components/auth/AuthForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { sendEmailVerification, signup, verifyEmailVerificationToken } from '@/actions/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleResendCode = () => {
    startTransition(() => {
      const email = form.getValues('email');
      sendEmailVerification(email).then((res) => {
        if (res?.error) toast.error(res?.error);
        else toast.success(res?.success);
      });
    });
  };

  const handleSubmit = (data: SignupSchemaType) => {
    startTransition(() => {
      if (!data.code)
        signup(data).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            setShowEmailVerification(true);
          }
        });
      else {
        verifyEmailVerificationToken({ email: data.email, code: data.code }, 'signup').then((res) => {
          if (res?.error) {
            toast.error(res.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            form.reset();
            router.replace('/auth/signin');
          }
        });
      }
    });
  };

  return (
    <AuthForm
      title='Sign Up'
      description='Enter your email below to register an account'
      form={form}
      buttonLinkLabel='Sign In'
      buttonLinkHref='/auth/signin'
      ctaQuestion='Already have an account?'
      handleSubmit={handleSubmit}
    >
      {!showEmailVerification && (
        <>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='name'>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} id='name' placeholder='John Doe' type='text' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <FormControl>
                  <Input {...field} id='email' placeholder='example@gmai.com' type='email' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <FormControl>
                  <Input {...field} id='password' placeholder='********' type='password' disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      {showEmailVerification && (
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>One-Time Code</FormLabel>
                <Button
                  type='button'
                  variant='link'
                  className='text-foreground'
                  size='sm'
                  onClick={handleResendCode}
                  disabled={isPending}
                >
                  Don&apos;t get the code?
                </Button>
              </div>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className='w-full'>
                    {Array.from({ length: 6 }, (_, index) => (
                      <InputOTPSlot key={index} className='flex-1' index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <Button type='submit' className='w-full' disabled={isPending}>
        {showEmailVerification ? 'Confirm' : 'Sign Up'}
      </Button>
      <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
        <span className='relative z-10 bg-background px-2 text-muted-foreground'>Or continue with</span>
      </div>
    </AuthForm>
  );
};

export default SignupForm;
