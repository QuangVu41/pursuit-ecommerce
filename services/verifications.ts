import crypto from 'crypto';
import { db } from '@/lib/db';
import { VerificationTokenType } from '@prisma/client';

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingToken = await getEmailVerificationTokenByEmail(email);

  if (existingToken) await db.verificationToken.delete({ where: { id: existingToken.id } });

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
      type: VerificationTokenType.email,
    },
  });

  return verificationToken;
};

export const getEmailVerificationTokenByEmail = async (email: string) => {
  const verificationToken = await db.verificationToken.findUnique({
    where: {
      email_type: {
        email,
        type: VerificationTokenType.email,
      },
    },
  });

  return verificationToken;
};

export const deleteVerificationTokenById = async (id: string) => {
  await db.verificationToken.delete({ where: { id } });
};
