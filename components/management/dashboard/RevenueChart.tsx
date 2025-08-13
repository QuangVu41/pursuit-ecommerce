'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { eachMonthOfInterval, format, isSameMonth, subMonths } from 'date-fns';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig } from '@/components/ui/chart';
import { OrderItem } from '@prisma/client';
import { formatCurrency } from '@/lib/helpers';

const chartConfig = {
  totalRevenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

interface SaleChartProps {
  orderItems: OrderItem[];
  last: string;
}

const RevenueChart = ({ orderItems, last }: SaleChartProps) => {
  const allMonths = eachMonthOfInterval({
    start: subMonths(new Date(), +last),
    end: new Date(),
  });

  const chartData = allMonths.map((date) => ({
    date: format(date, 'MMM dd'),
    totalRevenue: orderItems
      .filter((item) => isSameMonth(date, new Date(item.createdAt)))
      .reduce((acc, curr) => acc + curr.platformFee, 0),
  }));

  return (
    <Card className='@container/card font-manrope xl:col-span-6 row-span-2 lg:col-span-8 col-span-12'>
      <CardHeader>
        <CardTitle>Revenue Chart</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>Total for the last {last} months</span>
          <span className='@[540px]/card:hidden'>Last {last} months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickSize={0} width={60} tickFormatter={(value) => formatCurrency('VND', value)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='totalRevenue' fill='var(--color-totalRevenue)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
