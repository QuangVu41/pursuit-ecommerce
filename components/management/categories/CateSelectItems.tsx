import { getAllCategoriesWithNoParent } from '@/services/categories';
import { SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { Minus } from 'lucide-react';

interface CateSelectItemsProps {
  id?: string;
  showSubCates?: boolean;
}

const CateSelectItems = async ({ id, showSubCates = false }: CateSelectItemsProps) => {
  const categories = await getAllCategoriesWithNoParent(id);

  return (
    <>
      {categories.map((category) => {
        return (
          <SelectGroup key={category.name}>
            <SelectLabel className='capitalize'>{category.name}</SelectLabel>
            <SelectItem className='capitalize' value={category.id}>
              {category.name}
            </SelectItem>
            {showSubCates &&
              category.subcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id} className='capitalize'>
                  <Minus className='text-muted-foreground' />
                  {sub.name}
                </SelectItem>
              ))}
          </SelectGroup>
        );
      })}
    </>
  );
};

export default CateSelectItems;
