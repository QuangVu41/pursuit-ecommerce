import { z } from 'zod';

export const CreateCateSchema = z.object({
  name: z.string().toLowerCase().trim().min(2, 'Category name must be at least 2 characters long!'),
  description: z.string().optional(),
  parentId: z.string().trim().optional(),
});

export const UpdateCateSchema = CreateCateSchema.extend({
  id: z.string().nonempty(),
});

export type CreateCateSchemaType = z.infer<typeof CreateCateSchema>;
export type UpdateCateSchemaType = z.infer<typeof UpdateCateSchema>;
