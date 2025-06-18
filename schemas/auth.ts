import { z } from 'zod';

export const VerificationCodeSchema = z.string().min(6, { message: 'Email verification code is at least 6 digest!' });

export const SigninSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email!' }),
  password: z.string().trim(),
  code: VerificationCodeSchema.min(6, { message: 'Your one-time code must be 6 characters!' }).optional(),
});

export const VerificationCodeWithEmailSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email!' }),
  code: VerificationCodeSchema,
});

export const SignupSchema = z.object({
  name: z.string().trim().min(2, { message: 'First name must be at least 2 characters!' }),
  email: z.string().email({ message: 'Please, provide a valid email!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters!' })
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/, {
      message: 'Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character!',
    }),
  code: VerificationCodeSchema.optional(),
});

export type SigninSchemaType = z.infer<typeof SigninSchema>;
export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type VerificationCodeWithEmailSchemaType = z.infer<typeof VerificationCodeWithEmailSchema>;
export type VerificationCodeSchemaType = z.infer<typeof VerificationCodeSchema>;
