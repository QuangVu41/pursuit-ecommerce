'use client';

import DropdownItemLogoutBtn from '@/components/common/DropdownItemLogoutBtn';
import AvatarUser from '@/components/management/sidebar/AvatarUser';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { userMenu } from '@/lib/links';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

const UserNav = () => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <AvatarUser />
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'top' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <AvatarUser />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userMenu.map((item) => (
                <Fragment key={item.href}>
                  <DropdownMenuItem>
                    <item.icon className='text-inherit' />
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </Fragment>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownItemLogoutBtn />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserNav;
