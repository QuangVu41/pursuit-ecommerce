import type { Metadata } from 'next';
import '../globals.css';
import LayoutTemplate from '@/components/common/LayoutTemplate';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import HomeSidebar from '@/components/home/header/HomeSidebar';
import Header from '@/components/home/header/Header';
import Footer from '@/components/home/footer/Footer';
import FooterCopyright from '@/components/home/footer/FooterCopyright';

export const metadata: Metadata = {
  title: {
    default: 'Pursuit',
    template: '%s | Pursuit',
  },
  description: 'Find the best styles of modern shoes',
};

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutTemplate bodyClassName='bg-background font-manrope overflow-x-hidden'>
      <SidebarProvider className='flex flex-col'>
        <HomeSidebar />
        <SidebarInset>
          <Header />
          {children}
          <Footer />
          <FooterCopyright />
        </SidebarInset>
      </SidebarProvider>
    </LayoutTemplate>
  );
}
