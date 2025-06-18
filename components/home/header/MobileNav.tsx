import { ChevronDown, Minus } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Fragment } from 'react';
import { navItems } from '@/components/home/header/MainNav';

const MobileNav = async () => {
  const mainNavItems = await navItems;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-home-primary-foreground'>Home</SidebarGroupLabel>
      <SidebarMenu>
        {mainNavItems.map((item) => {
          if (item.type === 'dropdown')
            return (
              <Collapsible key={item.title} asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className='text-home-primary hover:text-home-primary-hover capitalize'
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                      <ChevronDown className='ml-auto text-inherit transition-transform duration-200 group-data-[state=open]/menu-item:rotate-180' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.subItems?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems?.map((subItem) => (
                          <Fragment key={subItem.name}>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                className='text-home-primary hover:text-home-primary-hover capitalize'
                                asChild
                              >
                                <Link href={`/products?category=${subItem.id}`}>
                                  <span>{subItem.name}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            {!!subItem.subcategories.length &&
                              subItem.subcategories.map((subCate) => (
                                <SidebarMenuSubItem key={subCate.id}>
                                  <SidebarMenuSubButton
                                    className='text-home-primary hover:text-home-primary-hover capitalize'
                                    asChild
                                  >
                                    <Link href={`/products?category=${subItem.id}`}>
                                      <Minus className='stroke-home-primary' />
                                      <span>{subCate.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                          </Fragment>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            );
          if (item.type === 'link')
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className='text-home-primary hover:text-home-primary-hover capitalize'
                  asChild
                  tooltip={item.title}
                >
                  <Link href={item.href!}>
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default MobileNav;
