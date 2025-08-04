import BtnFilter from '@/components/common/BtnFilter';
import Heading from '@/components/common/Heading';
import DashboardWrapper from '@/components/management/dashboard/DashboardWrapper';
import FilterHeader from '@/components/management/filter/FilterHeader';
import { dashboardSortBy } from '@/lib/searchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingPage from './loading';

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const queryParams = await searchParams;

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
      <Suspense key={JSON.stringify(queryParams)} fallback={<LoadingPage />}>
        <DashboardWrapper searchParams={queryParams} />
      </Suspense>
    </>
  );
};

export default DashboardPage;
