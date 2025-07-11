import { getUserSession } from '@/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUsernameFallback } from '@/lib/helpers';
import { CircleUserRound, HandCoins, LayoutDashboard, LogIn, Receipt, Truck, User } from 'lucide-react';
import Link from 'next/link';
import DropdownItemLogoutBtn from '../../common/DropdownItemLogoutBtn';

const AvatarDropdown = async () => {
  const user = await getUserSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user ? (
          <Avatar>
            <AvatarImage
              src={user.image || '/default-avatar.png'}
              alt={user.name || 'User name'}
              className='object-cover'
            />
            <AvatarFallback className='text-home-primary'>
              {getUsernameFallback(user.name || 'User Name')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <CircleUserRound />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        sideOffset={10}
        className='rounded-none bg-home-primary-hover border-0 p-0 w-[180px]'
      >
        {user ? (
          <>
            <DropdownMenuLabel className='grid text-left items-start text-muted'>
              <span className='truncate'>{user.name}</span>
              <span className='truncate font-normal text-muted/80 text-xs'>{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-home-primary-foreground m-0' />
            <DropdownMenuItem
              asChild
              className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none'
            >
              <Link href='/mng/dashboard'>
                <LayoutDashboard className='text-inherit' />
                Sell your Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none'
            >
              <Link href='/billing'>
                <Receipt className='text-inherit' />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none'
            >
              <Link href='/profile'>
                <User className='text-inherit' />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none'
            >
              <Link href='/profile/orders'>
                <Truck className='text-inherit' />
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className='bg-home-primary-foreground m-0' />
            <DropdownItemLogoutBtn className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none' />
          </>
        ) : (
          <>
            <DropdownMenuLabel className='grid text-left items-start text-muted'>
              <span className='truncate flex items-center gap-x-1'>
                Become a vendor
                <HandCoins className='size-4' />
              </span>
              <span className='text-nowrap font-normal text-muted/80 text-xs'>Start selling your first product</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-home-primary-foreground m-0' />
            <DropdownMenuItem
              asChild
              className='text-muted focus:text-muted focus:bg-home-primary-foreground rounded-none'
            >
              <Link href='/auth/signin'>
                <LogIn className='text-inherit' />
                Log in or sign up
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
