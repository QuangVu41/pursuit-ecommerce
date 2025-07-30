import HomeSectionContainer from '@/components/common/HomeSectionContainer';
import HomeSectionHeader from '@/components/common/HomeSectionHeader';
import SectionContent from '@/components/common/SectionContent';
import FilterBtnGroup from '@/components/home/filter/FilterBtnGroup';
import ProdFilter from '@/components/home/products/ProdFilter';
import ProdsPageContent from '@/components/home/products/ProdsPageContent';
import { getAllFilteredProducts } from '@/services/products';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from '../loading';

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
  const products = getAllFilteredProducts(queryParams);

  return (
    <HomeSectionContainer className='mb-[50px] md:mb-[100px]'>
      <HomeSectionHeader title='Find something you love' />
      <SectionContent className='grid grid-cols-12 gap-x-4'>
        <div className='hidden 2md:block col-span-3 xl:col-span-2'>
          <ProdFilter />
        </div>
        <div className='col-span-12 2md:col-span-9 xl:col-span-10 flex flex-col gap-y-4'>
          <FilterBtnGroup />
          <Suspense key={JSON.stringify(queryParams)} fallback={<Loading />}>
            <ProdsPageContent products={products} queryParams={queryParams} />
          </Suspense>
        </div>
      </SectionContent>
    </HomeSectionContainer>
  );
};

export default ProductsPage;
