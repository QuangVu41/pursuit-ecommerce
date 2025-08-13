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
import { ProductReviewWithPayload, ProductWithPayLoad } from '@/types/products';
import { create } from 'zustand';
import ProdReviewSection from './ProdReviewSection';

type ProdFormProps = {
  cateSelectItems: React.ReactNode;
  attributes: ProductAttributeWithValues[];
  prodReviews: ProductReviewWithPayload[];
} & ({ mode: 'create'; product?: never } | { mode: 'edit'; product: ProductWithPayLoad });

interface HasNoVariantsState {
  hasNoVariants: boolean;
  setHasNoVariants: (value: boolean) => void;
}

export const useHasNoVariants = create<HasNoVariantsState>((set) => ({
  hasNoVariants: false,
  setHasNoVariants: (value: boolean) => set({ hasNoVariants: value }),
}));

const ProdForm = ({ cateSelectItems, attributes, mode, product, prodReviews }: ProdFormProps) => {
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
          discountPercentage: 0,
          mode,
        }
      : {
          id: product.id,
          name: product.name,
          description: product.description,
          summary: product.summary,
          categoryId: product.categoryId,
          regularPrice: product.regularPrice,
          discountPercentage: product.discountPercentage,
          variants: product.productVariants.map((variant) => ({
            variantId: variant.id,
            firstAttrId: variant.firstAttrId,
            secondAttrId: variant.secondAttrId ?? undefined,
            altText: variant.altText ?? undefined,
            variantName: `${variant.firstAttr.name}${variant.secondAttr?.name ? ` - ${variant.secondAttr.name}` : ''}`,
            parentVariantId: `${variant.firstAttr.attributeId}${
              variant.secondAttr?.attributeId ? `,${variant.secondAttr.attributeId}` : ''
            }`,
            imageFile: undefined,
            imageUrl: variant.imageUrl ?? undefined,
            price: variant.price,
            stock: variant.stock,
          })),
          images: product!.productImages.map((img) => ({
            imgId: img.id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary,
            imageFile: new File([], img.imageUrl),
            altText: img.altText,
          })),
          mode,
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
    <FormWrapper className='!p-0' form={form} isModal={false} handleSubmit={handleSubmit}>
      <ProdImageSection
        form={form}
        fields={fieldImagesArrUtils.fields}
        handleCheckboxChange={handleCheckboxChange}
        handleFileChange={handleFileChange}
        handleRemoveImage={handleRemoveImage}
        isPending={isPending}
      />
      <ProdDetailSection form={form} cateSelectItems={cateSelectItems} isPending={isPending} />
      <ProdVariantProvider fieldVariantArrUtils={fieldVariantArrUtils} attributes={attributes} isPending={isPending}>
        <ProdVariantSection prodVariantForm={<ProdVariantForm />} form={form} />
      </ProdVariantProvider>
      <Button className='flex shadow-md ml-auto text-base items-center' type='submit' disabled={isPending}>
        {mode === 'create' ? 'Create Product' : 'Save Changes'}
      </Button>
      <ProdReviewSection prodReviews={prodReviews} />
    </FormWrapper>
  );
};

export default ProdForm;
