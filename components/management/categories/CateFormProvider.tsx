'use client';

import { createCate, updateCate } from '@/actions/categories';
import { CateFormSchema, CateFormSchemaType } from '@/schemas/categories';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@prisma/client';
import { createContext, useContext, useTransition } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface InitialState {
  handleSubmit: (data: CateFormSchemaType, btnCloseRef?: HTMLButtonElement | null) => void;
  form: UseFormReturn<CateFormSchemaType>;
  isPending: boolean;
  mode?: 'edit' | 'create';
  cateSelectItems: React.ReactNode;
}

type CateFormProviderProps = {
  children: React.ReactNode;
  cateSelectItems: React.ReactNode;
} & ({ mode: 'create'; category?: never } | { mode: 'edit'; category: Category });

const CateFormContext = createContext<InitialState | undefined>(undefined);

const CateFormProvider = ({ children, mode, category, cateSelectItems }: CateFormProviderProps) => {
  const defaultValues: CateFormSchemaType =
    mode === 'create'
      ? { name: '', description: '', parentId: '', imageUrl: '', mode }
      : {
          id: category.id,
          name: category.name,
          description: category.description ?? undefined,
          parentId: category.parentId ?? undefined,
          imageUrl: category.imageUrl,
          altText: category.altText,
          imageFile: undefined,
          mode,
        };
  const [isPending, startTransition] = useTransition();
  const form = useForm<CateFormSchemaType>({
    resolver: zodResolver(CateFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: CateFormSchemaType, btnCloseRef?: HTMLButtonElement | null) => {
    startTransition(() => {
      if (data.mode === 'create')
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
        updateCate(data).then((res) => {
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
