import { MAX_BANNER_IMAGE_UPLOAD, MAX_IMAGE_SIZE } from '@/lib/constants';
import { BannerType } from '@prisma/client';
import { z } from 'zod';
import { IsEditModeSchema } from './attributes';

export const BannerImageSchema = z
  .object({
    imgId: z.string().optional(),
    imageUrl: z.string(),
    imageFile: z.instanceof(File),
    altText: z.string().optional(),
  })
  .array()
  .max(MAX_BANNER_IMAGE_UPLOAD)
  .refine((vals) => vals.every((val) => (val.imageFile ? val.imageFile.size <= MAX_IMAGE_SIZE : true)), {
    message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
  })
  .refine((vals) => vals.length > 0, {
    message: 'Please choose at least 1 image!',
  });

export const BannerFormsSchema = z
  .object({
    title: z.string().trim().nonempty('Title is required'),
    description: z.string().trim().nonempty('Description is required'),
    type: z.nativeEnum(BannerType),
    images: BannerImageSchema,
  })
  .and(IsEditModeSchema);

export type BannerFormSchemaType = z.infer<typeof BannerFormsSchema>;
export type BannerImageSchemaType = z.infer<typeof BannerImageSchema>;
