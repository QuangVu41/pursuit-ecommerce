import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import SheetSlideOver from '@/components/common/SheetSlideOver';
import CateForm from '@/components/management/categories/CateForm';
import CateFormProvider from '@/components/management/categories/CateFormProvider';
import CateSelectItems from '@/components/management/categories/CateSelectItems';
import CateTable from '@/components/management/categories/CateTable';
import FilterHeader from '@/components/management/filter/FilterHeader';
import { Button } from '@/components/ui/button';
import { getFilteredCategories } from '@/services/categories';
import { Plus } from 'lucide-react';

interface CategoriesPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

const CategoriesPage = async ({ searchParams }: CategoriesPageProps) => {
  const queryParams = await searchParams;
  const { categories, count } = await getFilteredCategories(queryParams);

  return (
    <>
      <Heading title='Category List' />
      <CateFormProvider mode='create' cateSelectItems={<CateSelectItems />}>
        <FilterHeader>
          <DateRangePicker />
          <SheetSlideOver title='Create Category' content={<CateForm />}>
            <Button className='ml-auto text-primary-foreground'>
              <Plus className='size-5 stroke-primary-foreground' />
              <span className='hidden sm:inline'>New Category</span>
            </Button>
          </SheetSlideOver>
        </FilterHeader>
      </CateFormProvider>
      {categories.length ? (
        <>
          <CateTable categories={categories} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/products/categories' />
        </>
      ) : (
        <Empty title='No categories found!' />
      )}
    </>
  );
};

export default CategoriesPage;
