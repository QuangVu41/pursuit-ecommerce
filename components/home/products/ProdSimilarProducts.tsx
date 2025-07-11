import { ProductWithCateAndPrimaryImg } from '@/types/products';
import ProdCarouselPreview from './ProdCarouselPreview';

interface ProdSimilarProductsProps {
  prods?: ProductWithCateAndPrimaryImg[];
}

const ProdSimilarProducts = ({ prods }: ProdSimilarProductsProps) => {
  return (
    prods?.length !== 0 && (
      <div className='flex flex-col gap-y-4'>
        <h3 className='text-lg font-bold uppercase'>Similar Products</h3>
        <ProdCarouselPreview products={prods!} showNavbarBtn={false} />
      </div>
    )
  );
};

export default ProdSimilarProducts;
