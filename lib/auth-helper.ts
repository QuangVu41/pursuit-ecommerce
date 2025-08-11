import { getUserSession } from '@/auth';
import { getUserById } from '@/services/user-queries';
import { UserRole } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

export const checkStripeAccountLinked = async () => {
  const user = await getUserSession();

  if (user && user.id) {
    const userPayload = await getUserById(user.id);
    if (user.role === 'admin') return;
    if (userPayload && userPayload.stripeConnectedLinked === false) redirect('/billing');
  }
};

export const checkUserHasAdminRole = async () => {
  const user = await getUserSession();

  if (user && user.role !== UserRole.admin) {
    notFound();
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
