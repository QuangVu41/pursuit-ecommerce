import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getAllCatesWithNoParentCates } from '@/services/categories';
import { CateWithSubCates } from '@/types/categories';
import { Minus, OctagonAlert, ScrollText } from 'lucide-react';
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
  const categories = await getAllCatesWithNoParentCates();

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
    <NavigationMenu className='mx-auto rounded-none bg-transparent border-0 gap-2 hidden md:flex' viewport={false}>
      <NavigationMenuList>
        {mainNavItems.map((navItem) => {
          if (navItem.type === 'dropdown')
            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuTrigger className='group/mainNav bg-home-primary text-base hover:bg-home-primary-hover focus:bg-home-primary-hover hover:text-muted rounded-none text-muted gap-x-0.5 data-[state=open]:hover:bg-home-primary-hover data-[state=open]:bg-home-primary-hover px-4 focus:text-muted data-[state=open]:focus:bg-home-primary-hover data-[state=open]:text-muted'>
                  {navItem.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className='!rounded-none p-0 !bg-home-primary !border-0 shadow-2xl hidden md:block'>
                  <div className='flex flex-col'>
                    {navItem.subItems?.map((subItem) => (
                      <Fragment key={subItem.id}>
                        <Separator className='m-0 bg-home-primary-foreground' />
                        <NavigationMenuLink
                          asChild
                          className='w-full whitespace-nowrap py-2 bg-home-primary text-base hover:bg-home-primary-hover focus:bg-home-primary-hover hover:text-muted rounded-none text-muted gap-x-0.5 data-[state=open]:hover:bg-home-primary-hover data-[state=open]:bg-home-primary-hover px-4 focus:text-muted data-[state=open]:focus:bg-home-primary-hover data-[state=open]:text-muted capitalize'
                        >
                          <Link href={`/products?category=${subItem.id}`}>{subItem.name}</Link>
                        </NavigationMenuLink>
                        {!!subItem.subcategories.length &&
                          subItem.subcategories.map((subCate) => (
                            <Fragment key={subCate.id}>
                              <Separator className='m-0 bg-home-primary-foreground' />
                              <NavigationMenuLink
                                className='w-full whitespace-nowrap py-2 bg-home-primary text-base hover:bg-home-primary-hover focus:bg-home-primary-hover hover:text-muted rounded-none text-muted gap-x-0.5 data-[state=open]:hover:bg-home-primary-hover data-[state=open]:bg-home-primary-hover px-4 focus:text-muted data-[state=open]:focus:bg-home-primary-hover data-[state=open]:text-muted capitalize'
                                asChild
                              >
                                <Link
                                  href={`/products?category=${subCate.id}`}
                                  className='items-center gap-x-1 flex-row'
                                >
                                  <Minus className='text-muted' />
                                  {subCate.name}
                                </Link>
                              </NavigationMenuLink>
                            </Fragment>
                          ))}
                      </Fragment>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          if (navItem.type === 'link')
            return (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    'bg-home-primary text-base hover:bg-home-primary-hover focus:bg-home-primary-hover hover:text-muted rounded-none text-muted gap-x-0.5 data-[state=open]:hover:bg-home-primary-hover data-[state=open]:bg-home-primary-hover px-4 focus:text-muted data-[state=open]:focus:bg-home-primary-hover data-[state=open]:text-muted'
                  )}
                  asChild
                >
                  <Link href={navItem.href!}>{navItem.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
