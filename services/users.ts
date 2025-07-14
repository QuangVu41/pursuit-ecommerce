import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import { ExpectedError } from '@/lib/errors';
import { stripe } from '@/lib/stripe';
import { UserPasswordChangeSchemaType } from '@/schemas/user';
import bcrypt from 'bcryptjs';
import { getUserById, updateUserById } from './user-queries';

export const getUserByConnectedAccountId = async (connectedAccountId: string) => {
  const user = await db.user.findUnique({
    where: { connectedAccountId },
  });

  return user;
};

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const account = await stripe.accounts.create({
    email: data.email,
    controller: {
      losses: {
        payments: 'application',
      },
      fees: {
        payer: 'application',
      },
      stripe_dashboard: {
        type: 'express',
      },
    },
  });

  const user = await db.user.create({
    data: {
      ...data,
      connectedAccountId: account.id,
    },
  });

  return user;
};

export const checkIfUserUsedOauthProvider = async () => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated');
  const account = await db.account.findFirst({
    where: {
      userId: user.id,
    },
  });

  return !!account;
};

export const changeUserPassword = async (data: UserPasswordChangeSchemaType) => {
  const user = await getUserSession();
  if (!user) throw new Error('Unauthenticated');

  const existingUser = await getUserById(user.id as string);

  if (!existingUser) throw new Error('User not found');

  const isCurrentPasswordMatched = await bcrypt.compare(data.currentPassword, existingUser.password as string);

  if (!isCurrentPasswordMatched) throw new ExpectedError('Current password is incorrect');

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await updateUserById(user.id as string, { password: hashedPassword });
};
