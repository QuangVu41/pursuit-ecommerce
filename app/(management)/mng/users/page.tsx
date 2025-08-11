import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import FilterHeader from '@/components/management/filter/FilterHeader';
import UserMngTable from '@/components/management/users/UserMngTable';
import { checkUserHasAdminRole } from '@/lib/auth-helper';
import { getAllFilteredMngUsers } from '@/services/users';
import { Metadata } from 'next';

interface UsersPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Users Management',
};

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  await checkUserHasAdminRole();
  const queryParams = await searchParams;
  const { users, count } = await getAllFilteredMngUsers(queryParams);

  return (
    <>
      <Heading title='Users List' />
      <FilterHeader>
        <DateRangePicker />
      </FilterHeader>
      {users.length ? (
        <>
          <UserMngTable users={users} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/users' />
        </>
      ) : (
        <Empty title='No users found!' />
      )}
    </>
  );
};

export default UsersPage;
