import { MAX_IMAGE_SIZE, MAX_PROD_IMAGE_UPLOAD, MAX_PRODUCT_PRICE, MAX_PRODUCT_STOCK } from '@/lib/constants';
import { z } from 'zod';

const IsEditableSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('edit'),
    id: z.string().nonempty(),
  }),
  z.object({
    mode: z.literal('create'),
  }),
]);

export const ProdVariantSchema = z.object({
  variantId: z.string().optional(),
  firstAttrId: z.string(),
  secondAttrId: z.string().optional(),
  variantName: z.string(),
  parentVariantId: z.string(),
  imageUrl: z.string().optional(),
  altText: z.string().optional(),
  imageFile: z
    .instanceof(File)
    .refine((val) => val.size <= MAX_IMAGE_SIZE, {
      message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
    })
    .optional(),
  price: z.coerce
    .number({ message: 'Price must be a number!' })
    .max(MAX_PRODUCT_PRICE, { message: `Price cannot exceed ${MAX_PRODUCT_PRICE}!` })
    .int(),
  stock: z.coerce
    .number({ message: 'Stock must be a number!' })
    .int()
    .max(MAX_PRODUCT_STOCK, { message: `Stock cannot exceed ${MAX_PRODUCT_STOCK}!` }),
});

export const ProdImageSchema = z
  .object({
    imgId: z.string().optional(),
    imageUrl: z.string(),
    isPrimary: z.boolean(),
    imageFile: z.instanceof(File),
    altText: z.string().optional(),
  })
  .array()
  .max(MAX_PROD_IMAGE_UPLOAD)
  .refine((vals) => vals.every((val) => (val.imageFile ? val.imageFile.size <= MAX_IMAGE_SIZE : true)), {
    message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
  })
  .refine((vals) => vals.length > 0, {
    message: 'Please choose at least 1 image!',
  })
  .refine((vals) => vals.some((obj) => obj.isPrimary), {
    message: 'Please select one image as primary.',
  });

export const ProdSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required!' }).trim(),
  description: z.string().min(100, { message: 'Description has to be at least 100 characters!' }),
  summary: z
    .string()
    .nonempty({ message: 'Summary is required!' })
    .max(250, { message: 'Summary is max 250 characters!' })
    .trim(),
  categoryId: z.string().nonempty({ message: 'Category is required!' }),
  images: ProdImageSchema,
  regularPrice: z.coerce
    .number({ message: 'Price must be a number!' })
    .max(MAX_PRODUCT_PRICE, { message: `Price cannot exceed ${MAX_PRODUCT_PRICE}!` })
    .int(),
  discountPercentage: z.coerce
    .number({ message: 'Discount must be a number!' })
    .min(0, { message: 'Discount cannot be less than 0%' })
    .max(100, { message: 'Discount cannot exceed 100%' })
    .int(),
  variants: ProdVariantSchema.array()
    .refine((vals) => vals.length > 0, {
      message: 'Please add at least one product variant!',
    })
    .refine((vals) => vals.length === new Set(vals.map((v) => v.variantName)).size, {
      message: 'Variant cannot have duplicate!',
    }),
});

export const ProdFormSchema = z.intersection(ProdSchema, IsEditableSchema);

export const AddToCartSchema = z.object({
  productId: z.string().nonempty({ message: 'Product ID is required!' }),
  firstAttrId: z.string(),
  secondAttrId: z.string().optional(),
  quantity: z.coerce
    .number({ message: 'Quantity must be a number!' })
    .int()
    .min(1, { message: 'Quantity must be at least 1!' }),
});

export type ProdFormSchemaType = z.infer<typeof ProdFormSchema>;
export type ProdVariantSchemaType = z.infer<typeof ProdVariantSchema>;
export type ProdImageSchemaType = z.infer<typeof ProdImageSchema>;
export type AddToCartSchemaType = z.infer<typeof AddToCartSchema>;
