import { Syne } from 'next/font/google';
import { Manrope } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const LayoutTemplate = async ({
  children,
  bodyClassName,
}: Readonly<{
  children: React.ReactNode;
  bodyClassName?: string;
}>) => {
  const session = await auth();

  return (
    <html lang='en' className={`${syne.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className={bodyClassName}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default LayoutTemplate;
