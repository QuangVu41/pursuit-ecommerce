import SearchNav from '@/components/home/header/SearchNav';
import MainNav from '@/components/home/header/MainNav';
import Container from '@/components/common/Container';

const Header = () => {
  return (
    <header className='bg-home-primary py-5 px-2'>
      <Container className='flex flex-col lg:gap-y-7 md:gap-y-6'>
        <SearchNav />
        <MainNav />
      </Container>
    </header>
  );
};

export default Header;
