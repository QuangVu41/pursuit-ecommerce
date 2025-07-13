import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import SheetSlideOver from '@/components/common/SheetSlideOver';
import AttrForm from '@/components/management/attributes/AttrForm';
import AttrFormProvider from '@/components/management/attributes/AttrFormProvider';
import AttrTable from '@/components/management/attributes/AttrTable';
import FilterHeader from '@/components/management/filter/FilterHeader';
import { Button } from '@/components/ui/button';
import { getAllUserFilteredAttributes } from '@/services/attributes';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';

interface AttributesPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Attribute Management',
};

const AttributesPage = async ({ searchParams }: AttributesPageProps) => {
  const queryParams = await searchParams;
  const { attributes, count } = await getAllUserFilteredAttributes(queryParams);

  return (
    <>
      <Heading title='Attribute List' />
      <AttrFormProvider mode='create'>
        <FilterHeader>
          <DateRangePicker />
          <SheetSlideOver title='Create Attribute' content={<AttrForm />}>
            <Button className='ml-auto text-primary-foreground'>
              <Plus className='size-5 stroke-primary-foreground' />
              <span className='hidden sm:inline'>New Attribute</span>
            </Button>
          </SheetSlideOver>
        </FilterHeader>
      </AttrFormProvider>
      {attributes.length ? (
        <>
          <AttrTable attributes={attributes} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/products/attributes' />
        </>
      ) : (
        <Empty title='No attributes found!' />
      )}
    </>
  );
};

export default AttributesPage;
