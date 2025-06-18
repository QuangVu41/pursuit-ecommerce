import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import BreadcrumbNav from './BreadcrumbNav';
import ButtonGroup from './ButtonGroup';

const DashboardHeader = () => {
  return (
    <header className='flex justify-between h-14 my-1 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10 group-has-[[data-collapsible=icon]]/sidebar-wrapper:my-1 px-4'>
      <div className='flex items-center gap-2'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 !h-4 !w-[1.5px]' />
        <BreadcrumbNav />
      </div>
      <ButtonGroup />
    </header>
  );
};

export default DashboardHeader;
