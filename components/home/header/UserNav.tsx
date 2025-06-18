import { Heart, ShoppingCart } from 'lucide-react';
import AvatarDropdown from './AvatarDropdown';

const UserNav = () => {
  return (
    <div className='flex items-center gap-x-5 text-muted row-start-1 col-start-2 md:col-start-3 ml-auto'>
      <Heart />
      <ShoppingCart />
      <AvatarDropdown />
    </div>
  );
};

export default UserNav;
