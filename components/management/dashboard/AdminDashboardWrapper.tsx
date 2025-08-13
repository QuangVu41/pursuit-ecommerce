import { getAllSales } from '@/services/orders';
import RevenueChart from './RevenueChart';
import RevenueStat from './RevenueStat';
import UserStat from './UserStat';
import LatestTransactionsStat from './LatestTransactionsStat';
import PopularProdStat from './PopularProdStat';

interface AdminDashboardWrapperProps {
  searchParams: { [key: string]: string };
}

const AdminDashboardWrapper = async ({ searchParams }: AdminDashboardWrapperProps) => {
  const { last = '3' } = searchParams;
  const orderItems = await getAllSales(searchParams);

  return (
    <div className='grid grid-cols-12 grid-rows-4 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs'>
      <RevenueStat searchParams={searchParams} />
      <UserStat />
      <RevenueChart orderItems={orderItems} last={last} />
      <LatestTransactionsStat searchParams={searchParams} />
      <PopularProdStat searchParams={searchParams} />
    </div>
  );
};

export default AdminDashboardWrapper;
