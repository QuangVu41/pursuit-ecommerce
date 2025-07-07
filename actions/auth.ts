'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { signIn, signOut } from '@/auth';
import {
  SigninSchema,
  SigninSchemaType,
  SignupSchema,
  SignupSchemaType,
  VerificationCodeWithEmailSchema,
  VerificationCodeWithEmailSchemaType,
} from '@/schemas/auth';
import { createUser, getUserByEmail, updateUserById } from '@/services/users';
import {
  deleteVerificationTokenById,
  generateEmailVerificationToken,
  getEmailVerificationTokenByEmail,
} from '@/services/verifications';
import { Email } from '@/lib/email';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { catchAsync } from '../lib/catchAsync';
import { SignInOptions } from 'next-auth/react';
import { stripe } from '@/lib/stripe';

export const sendEmailVerification = catchAsync(async (email: string) => {
  const verificationToken = await generateEmailVerificationToken(email);
  await new Email(verificationToken.email, verificationToken.token).sendEmailVerification();

  return { success: 'Confirmation email sent!' };
});

export const signup = catchAsync(async (data: SignupSchemaType) => {
  const validatedFields = SignupSchema.safeParse(data);

  if (!validatedFields.success)
    return { error: `Invalid Fields! ${validatedFields.error.errors.map((err) => err.message).join(', ')}` };

  const { email, password, name } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: 'Email already in use!' };

  const hashedPassword = await bcrypt.hash(password, 12);

  await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return await sendEmailVerification(email);
});

export const signin = catchAsync(async (data: SigninSchemaType, callbackUrl?: string) => {
  const validatedFields = SigninSchema.safeParse(data);

  if (!validatedFields.success) return { error: 'Invalid email or password!' };

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: 'Email does not exist!' };

  if (!existingUser.emailVerified) {
    return await sendEmailVerification(email);
  }

  return (await signInCredentials({ email, password }, callbackUrl))!;
});

export const logout = catchAsync(async () => {
  await signOut({ redirectTo: '/' });
});

export const signInWithSocial = catchAsync(async (provider: 'google' | 'github', options: SignInOptions) => {
  await signIn(provider, options);
}, true);

export const verifyEmailVerificationToken = catchAsync(
  async (data: VerificationCodeWithEmailSchemaType | SigninSchemaType, type: 'signin' | 'signup') => {
    let validatedFields: z.SafeParseReturnType<
      VerificationCodeWithEmailSchemaType | SigninSchemaType,
      VerificationCodeWithEmailSchemaType | SigninSchemaType
    >;

    if (type === 'signup') validatedFields = VerificationCodeWithEmailSchema.safeParse(data);
    else {
      validatedFields = SigninSchema.safeParse(data);
    }

    if (!validatedFields.success) return { error: 'Invalid code!' };

    const existingUser = await getUserByEmail(data.email);

    if (!existingUser) return { error: 'Email does not exist!' };

    const verificationToken = await getEmailVerificationTokenByEmail(data.email);

    if (!verificationToken) return { error: 'Invalid code!' };

    if (verificationToken.token !== data.code) return { error: 'Invalid code!' };

    const hasExpired = new Date(verificationToken.expires) < new Date();

    if (hasExpired) return { error: 'Code expired!' };

    await updateUserById(existingUser.id, { emailVerified: new Date() });

    await deleteVerificationTokenById(verificationToken.id);

    if (type === 'signup') return { success: 'Email verified' };
    else {
      return await signInCredentials(data as z.infer<typeof SigninSchema>);
    }
  }
);

const signInCredentials = async (data: SigninSchemaType, callbackUrl?: string) => {
  await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  });
};
