import { ProductWithCateAndImg } from '@/types/products';
import ProdCard from './ProdCard';

interface ProdListProps {
  prods: ProductWithCateAndImg[];
}

const ProdList = ({ prods }: ProdListProps) => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4'>
      {prods.map((prod) => (
        <ProdCard key={prod.id} prod={prod} />
      ))}
    </div>
  );
};

export default ProdList;
