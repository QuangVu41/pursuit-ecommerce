import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { NextAuthConfig } from 'next-auth';
import { SigninSchema } from './schemas/auth';
import { getUserByEmail } from './services/users';
import { stripe } from './lib/stripe';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = SigninSchema.safeParse(credentials);

        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) return null;

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
