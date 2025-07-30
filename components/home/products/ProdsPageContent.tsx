import Empty from '@/components/common/Empty';
import PaginationBtns from '@/components/common/PaginationBtns';
import ProdList from '@/components/home/products/ProdList';
import { ProductWithCateAndImg } from '@/types/products';

interface ProdsPageContentProps {
  products: Promise<{
    products: ProductWithCateAndImg[];
    count: number;
  }>;
  queryParams: { [key: string]: string };
}

const ProdsPageContent = async ({ products, queryParams }: ProdsPageContentProps) => {
  const { products: prodList, count } = await products;

  return count ? (
    <>
      <ProdList prods={prodList} />
      <PaginationBtns searchParams={queryParams} count={count} segment='/products' />
    </>
  ) : (
    <Empty title='No products found!' />
  );
};

export default ProdsPageContent;
