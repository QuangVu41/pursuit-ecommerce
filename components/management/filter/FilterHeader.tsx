import FilterSearch from './FilterSearch';

interface FilterHeaderProps {
  children?: React.ReactNode;
  showSearch?: boolean;
}

const FilterHeader = ({ children, showSearch = true }: FilterHeaderProps) => {
  return (
    <header className='flex flex-col md:flex-row md:items-center justify-between bg-muted rounded-[8px] p-2 gap-2 shadow-md'>
      <div className='flex items-center gap-x-2 flex-1'>{children}</div>
      {showSearch && <FilterSearch />}
    </header>
  );
};

export default FilterHeader;
