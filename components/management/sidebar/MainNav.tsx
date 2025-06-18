import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { sidebarMenu } from '@/lib/links';
import CollapsibleMenuItem from './CollapsibleMenuItem';
import MenuItem from './MenuItem';

const MainNav = () => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarMenu.map((item) =>
          item.subMenu ? (
            <CollapsibleMenuItem key={item.label} item={item} />
          ) : (
            <MenuItem key={item.label} item={item} />
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default MainNav;
