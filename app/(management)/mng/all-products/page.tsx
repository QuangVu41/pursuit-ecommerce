import BtnCombobox from '@/components/common/BtnCombobox';
import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import FilterHeader from '@/components/management/filter/FilterHeader';
import { Button } from '@/components/ui/button';
import { flattenNestedArray } from '@/lib/helpers';
import { getAllCatesWithNoParentCates } from '@/services/categories';
import { getAllFilteredMngProducts } from '@/services/products';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { checkUserHasAdminRole } from '@/lib/auth-helper';
import ProdMngTable from '@/components/management/products/ProdMngTable';

export const metadata: Metadata = {
  title: 'All Products Management',
};

interface AllProductsPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

const AllProductsPage = async ({ searchParams }: AllProductsPageProps) => {
  await checkUserHasAdminRole();

  const queryParams = await searchParams;
  const { products, count } = await getAllFilteredMngProducts(queryParams);
  const categories = flattenNestedArray(await getAllCatesWithNoParentCates(), 'subcategories');

  return (
    <>
      <Heading title='All Products' />
      <FilterHeader>
        <DateRangePicker />
        <BtnCombobox items={categories} inputText='Category' />
        <Button className='ml-auto text-primary-foreground' asChild>
          <Link href='/mng/products/create-product'>
            <Plus className='size-5 stroke-primary-foreground' />
            <span className='hidden sm:inline'>New Product</span>
          </Link>
        </Button>
      </FilterHeader>
      {products.length ? (
        <>
          <ProdMngTable products={products} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/all-products' />
        </>
      ) : (
        <Empty title='No products found!' />
      )}
    </>
  );
};

export default AllProductsPage;
