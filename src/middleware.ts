import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { AppConfig } from '@/constants/app-config';
import { AUTH_STORAGE_KEY } from '@/constants/storage';
import { routing } from '@/libs/i18n-routing';
import { createRouteMatcher } from '@/utils/helpers';

const handleI18nRouting = createMiddleware(routing);

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  `/(?<locale>${AppConfig.locales.join('|')})/dashboard(.*)`,
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => route.test(pathname));

  // Get authentication token from cookies
  const token = request.cookies.get(AUTH_STORAGE_KEY.ACCESS_TOKEN)?.value;

  // If the route is protected and no token is found, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('login', request.url);

    return NextResponse.redirect(loginUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
