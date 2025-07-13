import AvatarDropdown from './AvatarDropdown';
import UserCart from '@/components/home/header/UserCart';

const UserNav = () => {
  return (
    <div className='flex items-center gap-x-5 text-muted row-start-1 col-start-2 md:col-start-3 ml-auto'>
      <UserCart />
      <AvatarDropdown />
    </div>
  );
};

export default UserNav;
