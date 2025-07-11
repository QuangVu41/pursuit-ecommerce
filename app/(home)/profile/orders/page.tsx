import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import OrderTable from '@/components/home/profile/OrderTable';
import { getAllUserFilteredOrders } from '@/services/orders';

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const queryParams = await searchParams;
  const { orders, count } = await getAllUserFilteredOrders(queryParams);

  return (
    <div className='bg-muted rounded-lg p-4 flex flex-col gap-4'>
      <Heading title='Your latest orders' />
      {orders.length ? (
        <>
          <OrderTable orders={orders} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/orders' />
        </>
      ) : (
        <Empty title='No orders found!' />
      )}
    </div>
  );
};

export default OrdersPage;
