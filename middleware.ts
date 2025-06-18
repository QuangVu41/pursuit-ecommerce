import authConfig from '@/auth.config';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authRoutes, DEFAULT_LOGIN_REDIRECT, secretRoutePrefix } from './routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isSecretRoute = nextUrl.pathname.startsWith(secretRoutePrefix);

  if (isAuthRoute) {
    if (isLoggedIn) return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin));
    return NextResponse.next();
  }

  if (isSecretRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl.origin));
  }

  NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
