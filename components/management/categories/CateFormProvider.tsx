'use client';

import { createCate, updateCate } from '@/actions/categories';
import { CreateCateSchema, CreateCateSchemaType, UpdateCateSchema, UpdateCateSchemaType } from '@/schemas/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, useTransition } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface InitialState {
  handleSubmit: (data: CreateCateSchemaType | UpdateCateSchemaType, btnCloseRef?: HTMLButtonElement | null) => void;
  form: UseFormReturn<CreateCateSchemaType | UpdateCateSchemaType>;
  isPending: boolean;
  mode?: 'edit' | 'create';
  cateSelectItems: React.ReactNode;
}

interface CateFormProviderProps {
  children: React.ReactNode;
  mode?: 'edit' | 'create';
  category?: UpdateCateSchemaType;
  cateSelectItems: React.ReactNode;
}

const CateFormContext = createContext<InitialState | undefined>(undefined);

const CateFormProvider = ({ children, mode = 'create', category, cateSelectItems }: CateFormProviderProps) => {
  const defaultValues: CreateCateSchemaType | UpdateCateSchemaType =
    mode === 'create'
      ? { name: '', description: '', parentId: '' }
      : {
          id: category?.id,
          name: category?.name || '',
          description: category?.description || '',
          parentId: category?.parentId || '',
        };
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateCateSchemaType | UpdateCateSchemaType>({
    resolver: zodResolver(mode === 'create' ? CreateCateSchema : UpdateCateSchema),
    defaultValues,
  });

  const handleSubmit = (data: CreateCateSchemaType | UpdateCateSchemaType, btnCloseRef?: HTMLButtonElement | null) => {
    startTransition(() => {
      if (mode === 'create')
        createCate(data).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            form.reset();
            btnCloseRef?.click();
          }
        });
      else {
        updateCate(data as UpdateCateSchemaType).then((res) => {
          if (res?.error) {
            toast.error(res?.error);
          }
          if (res?.success) {
            toast.success(res?.success);
            btnCloseRef?.click();
          }
        });
      }
    });
  };

  return (
    <CateFormContext.Provider
      value={{
        handleSubmit,
        form,
        isPending,
        mode,
        cateSelectItems,
      }}
    >
      {children}
    </CateFormContext.Provider>
  );
};

export const useCateFormContext = () => {
  const context = useContext(CateFormContext);
  if (!context) {
    throw new Error('useCateFormContext must be used within a CateFormProvider');
  }
  return context;
};

export default CateFormProvider;
