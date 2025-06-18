'use client';

import { createAttrWithValues, updateAttWithValues } from '@/actions/attributes';
import { CreateAttrSchema, CreateAttrSchemaType, UpdateAttrSchema, UpdateAttrSchemaType } from '@/schemas/attributes';
import { ProductAttributeWithValues } from '@/types/attributes';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, useTransition } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface AttrFormProviderProps {
  children: React.ReactNode;
  mode?: 'edit' | 'create';
  attribute?: ProductAttributeWithValues;
}

interface InitialState {
  form: UseFormReturn<CreateAttrSchemaType | UpdateAttrSchemaType>;
  handleSubmit: (data: CreateAttrSchemaType | UpdateAttrSchemaType, btnCloseRef?: HTMLButtonElement | null) => void;
  isPending: boolean;
  fields: any[];
  append: (value: any) => void;
  remove: (index: number) => void;
  mode?: 'edit' | 'create';
}

const AttrFormContext = createContext<InitialState | undefined>(undefined);

const AttrFormProvider = ({ children, mode = 'create', attribute }: AttrFormProviderProps) => {
  const defaultValues =
    mode === 'create'
      ? { name: '', values: [{ value: '' }] }
      : {
          id: attribute?.id,
          name: attribute?.name,
          values: attribute?.productAttributeValues.map((val) => ({ value: val.name, fieldId: val.id })),
        };
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateAttrSchemaType | UpdateAttrSchemaType>({
    resolver: zodResolver(mode === 'create' ? CreateAttrSchema : UpdateAttrSchema),
    defaultValues: defaultValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    name: 'values',
    control: form.control,
  });

  const handleSubmit = (data: CreateAttrSchemaType, btnCloseRef?: HTMLButtonElement | null) => {
    const values = data.values.map((val) => ({ value: val.value }));
    startTransition(() => {
      replace(values);
      if (mode === 'create')
        createAttrWithValues(data).then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            form.reset();
            btnCloseRef?.click();
          }
        });
      else {
        updateAttWithValues(data).then((res) => {
          if (res?.error) toast.error(res.error);
          if (res?.success) {
            toast.success(res.success);
            btnCloseRef?.click();
          }
        });
      }
    });
  };
  return (
    <AttrFormContext.Provider
      value={{
        form,
        handleSubmit,
        isPending,
        fields,
        append,
        remove,
        mode,
      }}
    >
      {children}
    </AttrFormContext.Provider>
  );
};

export const useAttrFormContext = () => {
  const context = useContext(AttrFormContext);
  if (!context) {
    throw new Error('useAttrFormContext must be used within an AttrFormProvider');
  }
  return context;
};

export default AttrFormProvider;
