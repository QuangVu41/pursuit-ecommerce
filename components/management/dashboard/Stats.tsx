import Stat from '@/components/management/dashboard/Stat';
import { formatCurrency } from '@/lib/helpers';
import { getTotalOrders, getTotalRevenue } from '@/services/orders';
import { getUserAverageRating, getUserTotalReview } from '@/services/reviews';
import { SquareChartGantt, Star, Truck } from 'lucide-react';

interface StatsProps {
  searchParams: { [key: string]: string };
}

const Stats = async ({ searchParams }: StatsProps) => {
  const totalRevenue = await getTotalRevenue(searchParams);
  const totalOrders = await getTotalOrders(searchParams);
  const totalReviews = await getUserTotalReview(searchParams);
  const avgRating = await getUserAverageRating(searchParams);

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid xs:grid-cols-2 md:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Stat
        title='Total Revenue'
        value={<span className='text-green-500'>{formatCurrency('VND', totalRevenue)}</span>}
      />
      <Stat
        title='Total Orders'
        value={
          <span className='flex items-end gap-1 leading-none'>
            {totalOrders.toString()}
            <Truck />
          </span>
        }
      />
      <Stat
        title='Total Reviews'
        value={
          <span className='flex items-end gap-1 leading-none'>
            {totalReviews.toString()}
            <SquareChartGantt />
          </span>
        }
      />
      <Stat
        title='Average Rating'
        value={
          <span className='flex items-end gap-1 leading-none'>
            {avgRating.toFixed(1)}
            <Star className='fill-yellow-500 stroke-yellow-500' />
          </span>
        }
      />
    </div>
  );
};

export default Stats;
