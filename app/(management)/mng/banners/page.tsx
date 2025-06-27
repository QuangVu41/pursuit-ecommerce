import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import SheetSlideOver from '@/components/common/SheetSlideOver';
import BannerForm from '@/components/management/banners/BannerForm';
import BannerTable from '@/components/management/banners/BannerTable';
import FilterHeader from '@/components/management/filter/FilterHeader';
import { Button } from '@/components/ui/button';
import { getFilteredBanners } from '@/services/banners';
import { Plus } from 'lucide-react';

interface BannersPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

const BannersPage = async ({ searchParams }: BannersPageProps) => {
  const queryParams = await searchParams;
  const { banners, count } = await getFilteredBanners(queryParams);

  return (
    <>
      <Heading title='Banner List' />
      <FilterHeader>
        <DateRangePicker />
        <SheetSlideOver title='Create Banner' content={<BannerForm mode='create' />}>
          <Button className='ml-auto text-primary-foreground'>
            <Plus className='size-5 stroke-primary-foreground' />
            <span className='hidden sm:inline'>New Banner</span>
          </Button>
        </SheetSlideOver>
      </FilterHeader>
      {banners.length ? (
        <>
          <BannerTable banners={banners} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/banners' />
        </>
      ) : (
        <Empty title='No banners found!' />
      )}
    </>
  );
};

export default BannersPage;
