import BtnCombobox from '@/components/common/BtnCombobox';
import DateRangePicker from '@/components/common/DateRangePicker';
import Empty from '@/components/common/Empty';
import Heading from '@/components/common/Heading';
import PaginationBtns from '@/components/common/PaginationBtns';
import FilterHeader from '@/components/management/filter/FilterHeader';
import ProdTable from '@/components/management/products/ProdTable';
import { Button } from '@/components/ui/button';
import { flattenNestedArray } from '@/lib/helpers';
import { getAllCatesWithNoParentCates } from '@/services/categories';
import { getAllUserFilteredProducts } from '@/services/products';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

interface ProductsPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Product Management',
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const queryParams = await searchParams;
  const { products, count } = await getAllUserFilteredProducts(queryParams);
  const categories = flattenNestedArray(await getAllCatesWithNoParentCates(), 'subcategories');

  return (
    <>
      <Heading title='Product List' />
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
          <ProdTable products={products} count={count} />
          <PaginationBtns searchParams={queryParams} count={count!} segment='/mng/products' />
        </>
      ) : (
        <Empty title='No products found!' />
      )}
    </>
  );
};

export default ProductsPage;
