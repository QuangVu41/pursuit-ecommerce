import type { Metadata } from 'next';
import '../globals.css';
import AuthHero from '@/components/auth/AuthHero';
import LayoutTemplate from '@/components/common/LayoutTemplate';
import LogoText from '@/components/common/LogoText';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'Pursuit',
    template: '%s | Pursuit',
  },
  description: 'Shop like a pro and save money',
};

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutTemplate>
      <div className='grid min-h-svh lg:grid-cols-2'>
        <div className='flex flex-col gap-4 p-10'>
          <div className='flex justify-center gap-2 md:justify-start'>
            <LogoText />
          </div>
          <div className='flex flex-1 items-center justify-center'>
            <div className='w-full max-w-xs'>{children}</div>
          </div>
        </div>
        <AuthHero />
      </div>
      <Toaster richColors position='top-center' theme='light' closeButton />
    </LayoutTemplate>
  );
}
