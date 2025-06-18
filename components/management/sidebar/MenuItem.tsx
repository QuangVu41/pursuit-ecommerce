import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

interface MenuItemProps {
  item: {
    label: string;
    href: string;
    icon: React.ComponentType;
    subMenu?: undefined;
  };
}

const MenuItem = ({ item }: MenuItemProps) => {
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
