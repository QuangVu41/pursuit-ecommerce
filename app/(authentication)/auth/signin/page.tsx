import SigninForm from '@/components/auth/SigninForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SigninPage = () => {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
};

export default SigninPage;
