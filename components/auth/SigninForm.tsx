'use client';

import { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { SigninSchema, SigninSchemaType } from '@/schemas/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import AuthForm from '@/components/auth/AuthForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { sendEmailVerification, signin, verifyEmailVerificationToken } from '@/actions/auth';

const SigninForm = () => {
  const [isPending, startTransition] = useTransition();
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const searchParams = useSearchParams();
  const errorParam =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider' : '';
  const callbackUrl = searchParams.get('callbackUrl');
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (errorParam) toast.error(errorParam);
  }, [errorParam]);

  const handleResendCode = () => {
    startTransition(() => {
      const email = form.getValues('email');
      sendEmailVerification(email).then((res) => {
        if (res?.error) toast.error(res?.error);
        else toast.success(res?.success);
      });
    });
  };

  const handleSubmit = (data: SigninSchemaType) => {
    startTransition(() => {
      if (!data.code) {
        signin(data, callbackUrl).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            setShowEmailVerification(true);
            toast.success(res.success);
            form.reset();
          }
        });
      } else {
        verifyEmailVerificationToken(data, 'signin').then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
        });
      }
    });
  };

  return (
    <AuthForm
      title='Sign In'
      description='Enter your email below to login to your account'
      form={form}
      buttonLinkLabel='Sign Up'
      buttonLinkHref='/auth/signup'
      ctaQuestion="Don't have an account?"
      handleSubmit={handleSubmit}
    >
      {!showEmailVerification && (
        <>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <FormControl>
                  <Input {...field} id='email' placeholder='example@gmail.com' type='email' disabled={isPending} />
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
                <div className='flex items-center'>
                  <FormLabel htmlFor='password'>Password</FormLabel>
                  <Link href='#' className='ml-auto text-sm underline-offset-4 hover:underline'>
                    Forgot your password?
                  </Link>
                </div>
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
                  size='sm'
                  className='text-foreground'
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
        {showEmailVerification ? 'Confirm' : 'Sign In'}
      </Button>
      <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
        <span className='relative z-10 bg-background px-2 text-muted-foreground'>Or continue with</span>
      </div>
    </AuthForm>
  );
};

export default SigninForm;
