'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import ProdImageSection from './ProdImageSection';
import { ProdFormSchema, ProdFormSchemaType } from '@/schemas/products';
import { zodResolver } from '@hookform/resolvers/zod';
import FormWrapper from '@/components/common/FormWrapper';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ProdDetailSection from './ProdDetailSection';
import ProdVariantSection from './ProdVariantSection';
import ProdVariantForm from './ProdVariantForm';
import { ProductAttributeWithValues } from '@/types/attributes';
import ProdVariantProvider from './ProdVariantProvider';
import { usePreviewImage } from '@/hooks/use-preview-image';
import { createProd, updateProd } from '@/actions/products';
import { useTransition } from 'react';
import { ProductWithPayLoad } from '@/types/products';
import { create } from 'zustand';

interface ProdFormProps {
  cateSelectItems: React.ReactNode;
  attributes: ProductAttributeWithValues[];
  product?: ProductWithPayLoad;
  mode?: 'create' | 'edit';
}

interface HasNoImageState {
  hasNoImage: boolean;
  setHasNoImage: (value: boolean) => void;
}

interface HasNoVariantsState {
  hasNoVariants: boolean;
  setHasNoVariants: (value: boolean) => void;
}

export const useHasNoVariants = create<HasNoVariantsState>((set) => ({
  hasNoVariants: false,
  setHasNoVariants: (value: boolean) => set({ hasNoVariants: value }),
}));

export const useHasNoImage = create<HasNoImageState>((set) => ({
  hasNoImage: false,
  setHasNoImage: (value: boolean) => set({ hasNoImage: value }),
}));

const ProdForm = ({ cateSelectItems, attributes, mode = 'create', product }: ProdFormProps) => {
  const setHasNoVariants = useHasNoVariants((state) => state.setHasNoVariants);
  const setHasNoImage = useHasNoImage((state) => state.setHasNoImage);
  const defaultValues: ProdFormSchemaType =
    mode === 'create'
      ? {
          name: '',
          description: '',
          summary: '',
          categoryId: '',
          regularPrice: 0,
          variants: [],
          images: [],
        }
      : {
          id: product?.id || '',
          name: product?.name || '',
          description: product?.description || '',
          summary: product?.summary || '',
          categoryId: product?.categoryId || '',
          regularPrice: product?.regularPrice || 0,
          variants:
            product?.productVariants?.map((variant) => ({
              variantId: variant.id,
              firstAttrId: variant.firstAttrId,
              secondAttrId: variant.secondAttrId || undefined,
              altText: variant.altText || '',
              variantName: `${variant.firstAttr.name}${
                variant.secondAttr?.name ? ` - ${variant.secondAttr.name}` : ''
              }`,
              parentVariantId: `${variant.firstAttr.attributeId}${
                variant.secondAttr?.attributeId ? `,${variant.secondAttr.attributeId}` : ''
              }`,
              imageUrl: variant.imageUrl || '',
              price: variant.price,
              stock: variant.stock,
            })) || [],
          images:
            product?.productImages.map((img) => ({
              imgId: img.id,
              imageUrl: img.imageUrl,
              isPrimary: img.isPrimary,
              imageFile: new File([], img.imageUrl),
              altText: img.altText || '',
            })) || [],
        };
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProdFormSchemaType>({
    resolver: zodResolver(ProdFormSchema),
    defaultValues,
  });
  const fieldImagesArrUtils = useFieldArray({
    name: 'images',
    control: form.control,
  });
  const fieldVariantArrUtils = useFieldArray({
    name: 'variants',
    control: form.control,
  });
  const { handleFileChange, handleRemoveImage, handleCheckboxChange } = usePreviewImage(fieldImagesArrUtils);

  const handleSubmit = (data: ProdFormSchemaType) => {
    if (fieldImagesArrUtils.fields.length === 0) {
      toast.error('Please choose at least one image.');
      setHasNoImage(true);
      return;
    }
    if (!fieldImagesArrUtils.fields.some((obj) => obj.isPrimary)) {
      toast.error('Please select one image as primary.');
      return;
    }
    if (fieldVariantArrUtils.fields.length === 0) {
      toast.error('Please add at least one product variant.');
      setHasNoVariants(true);
      return;
    }
    startTransition(async () => {
      if (mode === 'create')
        try {
          const res = await createProd(data);
          if (res?.error) toast.error(res.error);
        } catch {
          toast.success('Product created successfully!');
        }
      else {
        try {
          const res = await updateProd(data);
          if (res?.error) toast.error(res.error);
        } catch {
          toast.success('Product updated successfully!');
        }
      }
    });
  };

  return (
    <FormWrapper className='p-0' form={form} isModal={false} handleSubmit={handleSubmit}>
      <ProdImageSection
        fields={fieldImagesArrUtils.fields}
        handleCheckboxChange={handleCheckboxChange}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        isPending={isPending}
      />
      <ProdDetailSection form={form} cateSelectItems={cateSelectItems} isPending={isPending} />
      <ProdVariantProvider fieldVariantArrUtils={fieldVariantArrUtils} attributes={attributes} isPending={isPending}>
        <ProdVariantSection prodVariantForm={<ProdVariantForm />} />
      </ProdVariantProvider>
      <Button className='flex shadow-md ml-auto text-base items-center' type='submit' disabled={isPending}>
        {mode === 'create' ? 'Create Product' : 'Save Changes'}
      </Button>
    </FormWrapper>
  );
};

export default ProdForm;
