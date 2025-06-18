import BtnFilter from '@/components/common/BtnFilter';
import { sortBy, sortCriteria } from '@/lib/searchParams';
import FilterSort from '@/components/home/filter/FilterSort';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FilterSheet from '@/components/home/filter/FilterSheet';
import { Funnel } from 'lucide-react';
import ProdFilter from '@/components/home/products/ProdFilter';

const FilterBtnGroup = () => {
  return (
    <ScrollArea>
      <div className='flex items-center gap-x-4'>
        {sortBy.map((item) => (
          <BtnFilter key={item.query} label={item.label} query={item.query} isDefault={item.isDefault} />
        ))}
        <FilterSort label='Price' criteria={sortCriteria} sortBy='regularPrice' />
        <FilterSheet icon={<Funnel />} label='Filter'>
          <div className='p-2'>
            <ProdFilter />
          </div>
        </FilterSheet>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};

export default FilterBtnGroup;
