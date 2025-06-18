import SearchNav from '@/components/home/header/SearchNav';
import MainNav from '@/components/home/header/MainNav';

const Header = () => {
  return (
    <header className='flex flex-col bg-home-primary py-5 px-2 sm:px-6 md:py-7 lg:px-24 xl:px-32 lg:gap-y-7 md:gap-y-6'>
      <SearchNav />
      <MainNav />
    </header>
  );
};

export default Header;
