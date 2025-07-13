'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatCurrency } from '@/lib/helpers';
import { OrderItem } from '@prisma/client';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  totalSales: {
    label: 'Sales',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface SaleChartProps {
  orderItems: OrderItem[];
  last: string;
}

const SaleChart = ({ orderItems, last }: SaleChartProps) => {
  const allDates = eachDayOfInterval({
    start: subDays(new Date(), +last),
    end: new Date(),
  });

  const chartData = allDates.map((date) => ({
    date: format(date, 'MMM dd'),
    totalSales: orderItems
      .filter((item) => isSameDay(date, new Date(item.createdAt)))
      .reduce((acc, curr) => acc + curr.total - curr.platformFee, 0),
  }));

  return (
    <Card className='@container/card font-manrope'>
      <CardHeader>
        <CardTitle>Sales Chart</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>Total for the last {last} days</span>
          <span className='@[540px]/card:hidden'>Last {last} days</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id='fillTotalSales' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-totalSales)' stopOpacity={1.0} />
                <stop offset='95%' stopColor='var(--color-totalSales)' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <YAxis
              tick={{ fill: 'var(--primary)' }}
              tickLine={{ stroke: 'var(--primary)' }}
              tickSize={4}
              width={80}
              tickFormatter={(value) => formatCurrency('VND', value)}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={-1}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='totalSales'
              type='monotone'
              fill='url(#fillTotalSales)'
              stroke='var(--color-totalSales)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SaleChart;
