import { MAX_IMAGE_SIZE } from '@/lib/constants';
import { z } from 'zod';

export const UserEditSchema = z.object({
  id: z.string().nonempty('ID is required'),
  name: z.string().nonempty('Name is required'),
  email: z.string().nonempty('Email is required'),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => (val ? val.length === 10 : true), {
      message: 'Phone number must be 10 digits',
    }),
  birthOfDate: z.date().optional(),
  imageUrl: z.string().nonempty().optional(),
  imageFile: z
    .instanceof(File)
    .refine((val) => val.size <= MAX_IMAGE_SIZE, {
      message: `Image size cannot exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB!`,
    })
    .optional(),
});

export type UserEditSchemaType = z.infer<typeof UserEditSchema>;
