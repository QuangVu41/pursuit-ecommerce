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

export const UserPasswordChangeSchema = z
  .object({
    currentPassword: z.string().nonempty('Current password is required'),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters!' })
      .max(50, { message: 'Password cannot exceed 50 characters!' })
      .trim()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/, {
        message: 'Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character!',
      }),
    confirmPassword: z.string().nonempty('Confirm password is not matched'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm password is not matched',
    path: ['confirmPassword'],
  });

export type UserEditSchemaType = z.infer<typeof UserEditSchema>;
export type UserPasswordChangeSchemaType = z.infer<typeof UserPasswordChangeSchema>;
