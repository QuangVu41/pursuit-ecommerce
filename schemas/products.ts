import { MAX_IMAGE_SIZE, MAX_PRODUCT_PRICE, MAX_PRODUCT_STOCK } from '@/lib/constants';
import { z } from 'zod';

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

export const ProdImagesSchema = z
  .object({
    imgId: z.string().optional(),
    imageUrl: z.string(),
    isPrimary: z.boolean(),
    imageFile: z.instanceof(File),
    altText: z.string().optional(),
  })
  .array()
  .max(10)
  .refine((vals) => vals.every((val) => (val.imageFile ? val.imageFile.size <= MAX_IMAGE_SIZE : true)), {
    message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
  });

export const ProdFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty({ message: 'Name is required!' }).trim(),
  description: z.string().min(100, { message: 'Description has to be at least 100 characters!' }),
  summary: z
    .string()
    .nonempty({ message: 'Summary is required!' })
    .max(250, { message: 'Summary is max 250 characters!' }),
  categoryId: z.string().nonempty({ message: 'Category is required!' }),
  images: ProdImagesSchema,
  regularPrice: z.coerce
    .number({ message: 'Price must be a number!' })
    .max(MAX_PRODUCT_PRICE, { message: `Price cannot exceed ${MAX_PRODUCT_PRICE}!` })
    .int(),
  variants: ProdVariantSchema.array(),
});

export type ProdFormSchemaType = z.infer<typeof ProdFormSchema>;
export type ProdVariantSchemaType = z.infer<typeof ProdVariantSchema>;
export type ProdImagesSchemaType = z.infer<typeof ProdImagesSchema>;
