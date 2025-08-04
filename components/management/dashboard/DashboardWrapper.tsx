import PaginationBtns from '@/components/common/PaginationBtns';
import SaleChart from '@/components/management/dashboard/SaleChart';
import Stats from '@/components/management/dashboard/Stats';
import SaleTable from '@/components/management/sales/SaleTable';
import { getAllUserSales, getSellerFilteredSales } from '@/services/orders';

interface DashboardWrapperProps {
  searchParams: { [key: string]: string };
}

const DashboardWrapper = async ({ searchParams }: DashboardWrapperProps) => {
  const { last = '7' } = searchParams;
  const orderItems = await getAllUserSales(searchParams);
  const { sales, count } = await getSellerFilteredSales(searchParams);

  return (
    <>
      <Stats searchParams={searchParams} />
      <SaleChart orderItems={orderItems} last={last} />
      <SaleTable sales={sales} count={count} />
      <PaginationBtns searchParams={searchParams} count={count!} segment='/mng/orders' />
    </>
  );
};

export default DashboardWrapper;
