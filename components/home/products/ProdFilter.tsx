import { getAllCategories } from '@/services/categories';
import FilterBy from '@/components/home/filter/FilterBy';
import FilterReset from '@/components/home/filter/FilterReset';
import FilterRange from '@/components/home/filter/FilterRange';

const ProdFilter = async () => {
  const categories = await getAllCategories();

  return (
    <div className='flex flex-col gap-y-4'>
      <FilterBy title='Categories' items={categories} filterBy='category' />
      <FilterRange title='Price Range' />
      <FilterReset />
    </div>
  );
};

export default ProdFilter;
