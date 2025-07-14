import { db } from '@/lib/db';

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

export const updateUserById = async (id: string, data: any) => {
  const user = await db.user.update({
    where: { id },
    data,
  });

  return user;
};
