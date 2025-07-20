import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { routing } from './libs/i18n-routing';
import { AppConfig } from './utils/app-config';
import { createRouteMatcher } from './utils/helpers';

const handleI18nRouting = createMiddleware(routing);

const protectedRoutes = createRouteMatcher([
  '/dashboard(.*)',
  `/(?<locale>${AppConfig.locales.join('|')})/dashboard(.*)`,
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const protectedRoute = protectedRoutes.find(route => route.test(pathname));

  // Get authentication token from cookies
  const token = request.cookies.get('auth.access_token')?.value;

  // If the route is protected and no token is found, redirect to login
  if (protectedRoute && !token) {
    const { locale } = pathname.match(protectedRoute)?.groups || {};
    const loginUrl = new URL(`${locale}/login`, request.url);

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
