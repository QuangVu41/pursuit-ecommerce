import SigninForm from '@/components/auth/SigninForm';
import { Suspense } from 'react';

const SigninPage = () => {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
};

export default SigninPage;
