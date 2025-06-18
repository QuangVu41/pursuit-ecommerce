import { MAX_ALLOWED_ATTR_VALUE } from '@/lib/constants';
import { z } from 'zod';

export const CreateAttrSchema = z.object({
  name: z.string().trim().nonempty({ message: 'Name is required!' }),
  values: z
    .object({
      value: z.string({ message: 'Value is required!' }).min(1, { message: 'Value is required!' }),
      fieldId: z.string().optional(),
    })
    .array()
    .max(MAX_ALLOWED_ATTR_VALUE, { message: `Max ${MAX_ALLOWED_ATTR_VALUE} values are allowed!` }),
});

export const UpdateAttrSchema = CreateAttrSchema.extend({
  id: z.string().nonempty(),
});

export type CreateAttrSchemaType = z.infer<typeof CreateAttrSchema>;
export type UpdateAttrSchemaType = z.infer<typeof UpdateAttrSchema>;
