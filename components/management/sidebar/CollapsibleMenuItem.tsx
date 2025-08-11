import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronDown } from 'lucide-react';
import { UserRole } from '@prisma/client';
import { getUserSession } from '@/auth';

interface CollapsibleMenuItemProps {
  item: {
    label: string;
    href: string;
    icon: React.ComponentType;
    onlyAdmin?: boolean;
    subMenu: {
      label: string;
      href: string;
      role?: UserRole;
    }[];
  };
}

const CollapsibleMenuItem = async ({ item }: CollapsibleMenuItemProps) => {
  const user = await getUserSession();

  return (
    <Collapsible key={item.href} className='group/collapsible' asChild>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={item.label} asChild href={item.href}>
          <Link href={item.href}>
            {item.icon && <item.icon />}
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
        {item.subMenu?.length ? (
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className='data-[state=open]:rotate-180 hover:bg-background'>
                <ChevronDown />
                <span className='sr-only'>Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subMenu?.map((subItem) =>
                  subItem.role && subItem.role !== user?.role ? null : (
                    <SidebarMenuSubItem key={subItem.label}>
                      <SidebarMenuSubButton asChild href={subItem.href}>
                        <Link href={subItem.href}>
                          <span>{subItem.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                )}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
};

{
  /* <CollapsibleTrigger asChild>
                    <SidebarMenuAction className='data-[state=open]:rotate-90'>
                      <ChevronRight />
                      <span className='sr-only'>Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent> */
}

export default CollapsibleMenuItem;
