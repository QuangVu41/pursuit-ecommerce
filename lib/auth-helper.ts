import { getUserSession } from '@/auth';
import { getUserById } from '@/services/user-queries';
import { redirect } from 'next/navigation';

export const checkStripeAccountLinked = async () => {
  const user = await getUserSession();

  if (user && user.id) {
    const userPayload = await getUserById(user.id);
    if (userPayload && userPayload.stripeConnectedLinked === false) redirect('/billing');
  }
};

export const isAuthenticated = async (callbackUrl?: string) => {
  const user = await getUserSession();
  callbackUrl = callbackUrl ? `?callbackUrl=${callbackUrl}` : '';

  if (!user) {
    redirect(`/auth/signin/${callbackUrl}`);
  }

  return true;
};
