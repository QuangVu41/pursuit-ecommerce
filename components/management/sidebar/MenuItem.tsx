import { getUserSession } from '@/auth';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { UserRole } from '@prisma/client';
import Link from 'next/link';

interface MenuItemProps {
  item: {
    label: string;
    href: string;
    icon: React.ComponentType;
    subMenu?: undefined;
    role?: UserRole;
  };
}

const MenuItem = async ({ item }: MenuItemProps) => {
  const user = await getUserSession();

  if (user && item.role && user.role !== item.role) return;

  return (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton tooltip={item.label} asChild href={item.href}>
        <Link href={item.href}>
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default MenuItem;
