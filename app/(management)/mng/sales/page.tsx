import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import FilterHeader from '@/components/management/filter/FilterHeader';
import OrderTable from '@/components/management/sales/SaleTable';
import { formatCurrency } from '@/lib/helpers';
import { getSellerFilteredSales, getTotalSellerSales } from '@/services/orders';

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const queryParams = await searchParams;
  const { sales, count } = await getSellerFilteredSales(queryParams);
  const totalSales = await getTotalSellerSales(queryParams);

  return (
    <>
      <Heading title='Your Sales' />
      <FilterHeader showSearch={false}>
        <DateRangePicker />
        <div className='bg-background py-1 px-2 rounded-md border ml-auto'>
          <h2 className='text-primary font-semibold font-manrope'>
            Total Sales:{' '}
            <span className='text-green-500 text-lg font-semibold'>{formatCurrency('VND', totalSales)}</span>
          </h2>
        </div>
      </FilterHeader>
      {sales.length ? (
        <>
          <OrderTable sales={sales} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/orders' />
        </>
      ) : (
        <Empty title='No sales found!' />
      )}
    </>
  );
};

export default OrdersPage;
