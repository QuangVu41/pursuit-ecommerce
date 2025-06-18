import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import MobileNav from '@/components/home/header/MobileNav';
import Link from 'next/link';

const HomeSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar className='top-[--header-height] !h-[calc(100svh-var(--header-height))] md:hidden' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild className='rounded-none'>
              <Link href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-home-primary text-sidebar-primary-foreground'>
                  P
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold text-home-primary-foreground'>Pursuit</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <MobileNav />
      </SidebarContent>
    </Sidebar>
  );
};

export default HomeSidebar;
