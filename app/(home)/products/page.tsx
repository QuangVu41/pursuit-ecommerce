import Empty from '@/components/common/Empty';
import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import PaginationBtns from '@/components/common/PaginationBtns';
import SectionContent from '@/components/common/SectionContent';
import FilterBtnGroup from '@/components/home/filter/FilterBtnGroup';
import ProdFilter from '@/components/home/products/ProdFilter';
import ProdList from '@/components/home/products/ProdList';
import { getAllFilteredProducts } from '@/services/products';
import { Metadata } from 'next';

interface ProductsPageProps {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Products',
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const queryParams = await searchParams;
  const { products, count } = await getAllFilteredProducts(queryParams);

  return (
    <HomeSectionContainer className='mb-[50px] md:mb-[100px]'>
      <HomeSectionHeader title='Find something you love' />
      <SectionContent className='grid grid-cols-12 gap-x-4'>
        <div className='hidden 2md:block col-span-3 xl:col-span-2'>
          <ProdFilter />
        </div>
        <div className='col-span-12 2md:col-span-9 xl:col-span-10 flex flex-col gap-y-4'>
          <FilterBtnGroup />
          {count ? (
            <>
              <ProdList prods={products} />
              <PaginationBtns searchParams={queryParams} count={count} segment='/products' />
            </>
          ) : (
            <Empty title='No products found!' />
          )}
        </div>
      </SectionContent>
    </HomeSectionContainer>
  );
};

export default ProductsPage;
