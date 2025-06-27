import { MAX_ALLOWED_ATTR_VALUE } from '@/lib/constants';
import { z } from 'zod';

export const IsEditModeSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('edit'),
    id: z.string().nonempty(),
  }),
  z.object({
    mode: z.literal('create'),
  }),
]);

export const AttrFormSchema = z
  .object({
    name: z.string().trim().nonempty({ message: 'Name is required!' }),
    values: z
      .object({
        value: z.string({ message: 'Value is required!' }).min(1, { message: 'Value is required!' }),
        fieldId: z.string().optional(),
      })
      .array()
      .max(MAX_ALLOWED_ATTR_VALUE, { message: `Max ${MAX_ALLOWED_ATTR_VALUE} values are allowed!` }),
  })
  .and(IsEditModeSchema);

export type AttrFormSchemaType = z.infer<typeof AttrFormSchema>;
