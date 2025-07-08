import type { Metadata } from 'next';
import '@/app/globals.css';
import LayoutTemplate from '@/components/common/LayoutTemplate';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/management/sidebar/DashboardSidebar';
import DashboardHeader from '@/components/management/sidebar/DashboardHeader';
import MainContent from '@/components/common/MainContent';
import ThemeProvider from '@/components/common/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { checkStripeAccountLinked } from '@/lib/auth-helper';

export const metadata: Metadata = {
  title: {
    default: 'Pursuit',
    template: '%s | Pursuit',
  },
  description: 'Find the best styles of modern shoes',
};

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await checkStripeAccountLinked();

  return (
    <LayoutTemplate bodyClassName='bg-muted'>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader />
            <MainContent>{children}</MainContent>
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors position='top-center' closeButton />
      </ThemeProvider>
    </LayoutTemplate>
  );
}
