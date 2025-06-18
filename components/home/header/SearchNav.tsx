import LogoText from '@/components/common/LogoText';
import MainSearch from '@/components/home/header/MainSearch';
import UserNav from '@/components/home/header/UserNav';
import { SidebarTrigger } from '@/components/ui/sidebar';

const SearchNav = () => {
  return (
    <div className='grid justify-items-start md:justify-items-start gap-y-5 md:items-center md:justify-between md:gap-x-14 lg:gap-x-16 xl:gap-x-20 grid-cols-2 md:grid-cols-[auto_1fr_auto]'>
      <LogoText className='text-muted hidden md:inline-flex' />
      <SidebarTrigger className='md:hidden text-muted hover:bg-home-primary-hover hover:text-muted' />
      <MainSearch />
      <UserNav />
    </div>
  );
};

export default SearchNav;
