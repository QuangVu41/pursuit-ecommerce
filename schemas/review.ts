import { z } from 'zod';

export const ReviewSchema = z.object({
  productId: z.string().nonempty(),
  rating: z.number({ coerce: true }).min(1).max(5, { message: 'Rating must be between 1 and 5' }),
  title: z.string().min(1, { message: 'Title is required' }),
  content: z
    .string()
    .min(1, { message: 'Content is required' })
    .max(500, { message: 'Content must be less than 500 characters' }),
});

export type ReviewSchemaType = z.infer<typeof ReviewSchema>;
