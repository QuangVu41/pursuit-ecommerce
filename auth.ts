import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import { getUserById, updateUserById } from './services/user-queries';
import { stripe } from '@/lib/stripe';
import authConfig from '@/auth.config';
import { UserRole } from '@prisma/client';

export type ExtendedUser = {
  role: UserRole;
  stripeConnectedLinked: boolean;
} & DefaultSession['user'];

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}

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
      token.role = existingUser.role;
      token.stripeConnectedLinked = existingUser.stripeConnectedLinked;

      return token;
    },
    session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;

      if (token.role && session.user) session.user.role = token.role as UserRole;

      if (token.stripeConnectedLinked && session.user)
        session.user.stripeConnectedLinked = token.stripeConnectedLinked as boolean;

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
