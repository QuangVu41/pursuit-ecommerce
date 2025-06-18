import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import authConfig from '@/auth.config';
import { getUserById, updateUserById } from './services/users';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async linkAccount({ user }) {
      await updateUserById(user.id!, { emailVerified: new Date() });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});

export const getUserSession = async () => {
  const session = await auth();

  return session?.user;
};
