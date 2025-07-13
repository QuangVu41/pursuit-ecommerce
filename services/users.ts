import { getUserSession } from '@/auth';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { UserPasswordChangeSchemaType } from '@/schemas/user';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const getUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: { email },
  });

  return user;
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
  });

  return user;
};

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

export const updateUserById = async (id: string, data: Partial<User>) => {
  const user = await db.user.update({
    where: { id },
    data,
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
};
