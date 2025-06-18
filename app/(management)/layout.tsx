import type { Metadata } from 'next';
import '../globals.css';
import LayoutTemplate from '@/components/common/LayoutTemplate';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DashboardSidebar from '@/components/management/sidebar/DashboardSidebar';
import DashboardHeader from '@/components/management/sidebar/DashboardHeader';
import MainContent from '@/components/common/MainContent';

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
    <LayoutTemplate bodyClassName='bg-muted'>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <MainContent>{children}</MainContent>
        </SidebarInset>
      </SidebarProvider>
    </LayoutTemplate>
  );
}
