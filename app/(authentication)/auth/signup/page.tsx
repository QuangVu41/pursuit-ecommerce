import SignupForm from '@/components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignupPage = () => {
  return <SignupForm />;
};

export default SignupPage;
