import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { getAllCategoriesWithNoParent } from '@/services/categories';
import { CateWithSubCates } from '@/types/categories';
import { ChevronDown, Minus, OctagonAlert, ScrollText } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

type NavDropdownItem<T = unknown> = {
  title: string;
  subItems: T[];
  icon: React.ElementType;
  type: 'dropdown';
};

type NavLinkItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  type: 'link';
};

export type MainNavItems<T = unknown> = (NavDropdownItem<T> | NavLinkItem)[];

export const getMainNavItems = async (): Promise<MainNavItems<CateWithSubCates>> => {
  const categories = await getAllCategoriesWithNoParent();

  return [
    {
      title: 'Categories',
      subItems: categories,
      icon: ScrollText,
      type: 'dropdown',
    },
    {
      title: 'About',
      icon: OctagonAlert,
      href: '/about',
      type: 'link',
    },
  ];
};

export const navItems = getMainNavItems();

const MainNav = async () => {
  const mainNavItems = await navItems;

  return (
    <Menubar className='mx-auto rounded-none bg-transparent border-0 gap-2 hidden md:flex'>
      {mainNavItems.map((navItem) => {
        if (navItem.type === 'dropdown')
          return (
            <MenubarMenu key={navItem.title}>
              <MenubarTrigger className='group/mainNav text-base rounded-none text-muted gap-x-0.5 data-[state=open]:bg-home-primary-hover hover:bg-home-primary-hover px-4 focus:text-muted focus:bg-home-primary-hover data-[state=open]:text-muted'>
                {navItem.title}
                <ChevronDown className='size-4 group-data-[state=open]/mainNav:rotate-180 transition-transform' />
              </MenubarTrigger>
              <MenubarContent
                className='rounded-none p-0 bg-home-primary border-0 shadow-2xl hidden md:block'
                align='center'
                sideOffset={30}
              >
                {navItem.subItems?.map((subItem) => (
                  <Fragment key={subItem.id}>
                    <MenubarSeparator className='m-0 bg-home-primary-foreground' />
                    <MenubarItem
                      asChild
                      className='capitalize rounded-none text-muted focus:bg-home-primary-hover focus:text-muted px-6 py-2 text-base'
                    >
                      <Link href={`/products?category=${subItem.id}`}>{subItem.name}</Link>
                    </MenubarItem>
                    {!!subItem.subcategories.length &&
                      subItem.subcategories.map((subCate) => (
                        <Fragment key={subCate.id}>
                          <MenubarSeparator className='m-0 bg-home-primary-foreground' />
                          <MenubarItem className='capitalize rounded-none text-muted focus:bg-home-primary-hover focus:text-muted px-6 py-2 text-base'>
                            <Minus className='text-muted' />
                            <Link href={`/products?category=${subCate.id}`}>{subCate.name}</Link>
                          </MenubarItem>
                        </Fragment>
                      ))}
                  </Fragment>
                ))}
              </MenubarContent>
            </MenubarMenu>
          );
        if (navItem.type === 'link')
          return (
            <MenubarMenu key={navItem.title}>
              <MenubarTrigger
                className='text-base rounded-none text-muted gap-x-0.5 data-[state=open]:bg-home-primary-hover hover:bg-home-primary-hover px-4 focus:text-muted focus:bg-home-primary-hover data-[state=open]:text-muted'
                asChild
              >
                <Link href={navItem.href!}>{navItem.title}</Link>
              </MenubarTrigger>
            </MenubarMenu>
          );
      })}
    </Menubar>
  );
};

export default MainNav;
