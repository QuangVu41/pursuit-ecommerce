import BtnFilter from '@/components/common/BtnFilter';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import SaleChart from '@/components/management/dashboard/SaleChart';
import Stats from '@/components/management/dashboard/Stats';
import FilterHeader from '@/components/management/filter/FilterHeader';
import SaleTable from '@/components/management/sales/SaleTable';
import { dashboardSortBy } from '@/lib/searchParams';
import { getAllUserSales, getSellerFilteredSales } from '@/services/orders';
import { Metadata } from 'next';

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const queryParams = await searchParams;
  const { last = '7' } = queryParams;
  const orderItems = await getAllUserSales(queryParams);
  const { sales, count } = await getSellerFilteredSales(queryParams);

  return (
    <>
      <Heading title='Dashboard' />
      <FilterHeader showSearch={false}>
        {dashboardSortBy.map((item) => (
          <BtnFilter
            queryKey='last'
            variant='outline'
            activeClass='bg-primary dark:bg-primary'
            className='rounded-md font-manrope hover:bg-primary hover:text-muted dark:hover:bg-primary active:bg-primary active:text-muted dark:active:bg-primary text-xs md:text-sm py-1 px-3 md:py-2 md:px-4'
            key={item.query}
            label={item.label}
            query={item.query}
            isDefault={item.isDefault}
          />
        ))}
      </FilterHeader>
      <Stats searchParams={queryParams} />
      <SaleChart orderItems={orderItems} last={last} />
      <SaleTable sales={sales} count={count} />
      <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/orders' />
    </>
  );
};

export default DashboardPage;
