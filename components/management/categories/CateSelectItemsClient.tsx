'use client';

import { SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { CateWithSubCates } from '@/types/categories';
import { Loader2, Minus } from 'lucide-react';
import useSWR from 'swr';

interface CateSelectItemsClientProps {
  id: string;
  showSubCates?: boolean;
}

const fetchCategories = async (endpoint: string): Promise<{ data: CateWithSubCates[] }> => {
  const res = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
};

const CateSelectItemsClient = ({ id, showSubCates = false }: CateSelectItemsClientProps) => {
  const { data: categories, isLoading, error } = useSWR(`/api/categories/${id}`, fetchCategories);

  if (error instanceof Error) return <span className='py-1.5 pl-2'>{error.message}</span>;

  if (isLoading && !categories) return <Loader2 className='animate-spin ml-2' />;

  return (
    <>
      {categories!.data.map((category) => {
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

export default CateSelectItemsClient;
