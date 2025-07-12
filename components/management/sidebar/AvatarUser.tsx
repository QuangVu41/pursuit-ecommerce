import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserSession } from '@/hooks/use-user-session';
import { getUsernameFallback } from '@/lib/helpers';

const AvatarUser = () => {
  const user = useUserSession();

  return (
    <>
      <Avatar className='h-8 w-8 rounded-lg'>
        <AvatarImage src={`${user?.image}`} alt={user?.name || 'User name'} className='object-cover' />
        <AvatarFallback>{getUsernameFallback(user?.name || 'User name')}</AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-semibold'>{user?.name}</span>
        <span className='truncate text-xs'>{user?.email}</span>
      </div>
    </>
  );
};

export default AvatarUser;
