import { db } from '@/lib/db';
import { User } from '@prisma/client';

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

export const createUser = async (data: { name: string; email: string; password: string }) => {
  const user = await db.user.create({
    data,
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
