import { auth } from '@/auth';
import { ExpectedError } from '@/lib/errors';
import { AuthError } from 'next-auth';

export const catchAsync =
  (fn: (...parameters: any[]) => Promise<{ success?: string; error?: string } | void>) =>
  async (...parameters: any[]) => {
    try {
      const session = await auth();
      if (!session) throw new ExpectedError('Unauthenticated! Please log in.');

      return await fn(...parameters);
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return { error: 'Invalid email or password!' };
          default:
            return { error: 'Something went wrong!' };
        }
      }
      if (error instanceof ExpectedError) return { error: error.message };
      if (isRedirectError(error)) throw error;
      console.error(error);
      if (error instanceof Error) return { error: 'Something went wrong!' };
    }
  };

const isRedirectError = (error: unknown): error is { digest: string } => {
  return typeof error === 'object' && error !== null && 'digest' in error;
};
