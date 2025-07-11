import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import authConfig from '@/auth.config';
import { getUserById, updateUserById } from './services/users';
import { stripe } from './lib/stripe';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  events: {
    async linkAccount({ user }) {
      const account = await stripe.accounts.create({
        email: user.email || undefined,
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
      await updateUserById(user.id!, { emailVerified: new Date(), connectedAccountId: account.id });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.picture = existingUser.image;

      return token;
    },
    session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      if (session.user) {
        session.user.name = token.name;
        session.user.image = token.picture;
      }

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
