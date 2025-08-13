import { getTotalRevenue } from '@/services/orders';
import Stat from './Stat';
import { Banknote } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';

interface RevenueStatProps {
  searchParams: { [key: string]: string };
}

const RevenueStat = async ({ searchParams }: RevenueStatProps) => {
  const totalRevenue = await getTotalRevenue(searchParams);

  return (
    <Stat
      title='Total Revenue'
      value={<span className='text-green-500'>{formatCurrency('VND', totalRevenue)}</span>}
      icon={<Banknote className='stroke-green-500' />}
      className='xl:col-span-3 row-span-1 lg:col-span-4 col-span-12'
    />
  );
};

export default RevenueStat;
