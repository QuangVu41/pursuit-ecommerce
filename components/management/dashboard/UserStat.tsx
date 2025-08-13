import { getTotalUsers } from '@/services/users';
import Stat from './Stat';
import { User } from 'lucide-react';

const UserStat = async () => {
  const totalUsers = await getTotalUsers();

  return (
    <Stat
      title='Total Users'
      value={<span className='text-blue-500'>{totalUsers}</span>}
      icon={<User className='stroke-blue-500' />}
      className='xl:col-span-3 row-start-2 row-end-3 lg:col-span-4 col-span-12'
    />
  );
};

export default UserStat;
