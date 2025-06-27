import { z } from 'zod';
import { IsEditModeSchema } from './attributes';
import { MAX_IMAGE_SIZE } from '@/lib/constants';

export const CateFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Category name must be at least 2 characters long!'),
    description: z.string().optional(),
    parentId: z.string().trim().optional(),
    imageUrl: z.string().nonempty({ message: 'Category image is required!' }),
    altText: z.string().optional(),
    imageFile: z
      .instanceof(File)
      .refine((val) => val.size <= MAX_IMAGE_SIZE, {
        message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
      })
      .optional(),
  })
  .and(IsEditModeSchema);

export type CateFormSchemaType = z.infer<typeof CateFormSchema>;
