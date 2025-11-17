import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

import { routing } from '@/lib/i18n-routing';
import { createRouteMatcher } from '@/lib/route-matcher';
import { Logger } from './lib/logger';
import {BASE_URL} from "@/config/storage";

const middlewareLogger = Logger.create('middleware');
const handleI18nRouting = createMiddleware(routing);

const isProtectedMatcher = createRouteMatcher([
  `/{:locale/}dashboard{/*path}`,
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const isProtectedRoute = isProtectedMatcher(request);

  // Get authentication token from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  middlewareLogger.info(`Handling request for pathname: ${pathname} with token: ${accessToken ? 'present' : 'absent'}`);

  // If the route is protected and no token is found, redirect to login
  if (isProtectedRoute && refreshToken && !accessToken) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
      const refreshRes = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const { access_token, expires_in } = data.data;

        const response = NextResponse.next();

        response.cookies.set('access_token', access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: Number(expires_in),
          path: '/',
        });

        middlewareLogger.info(`[middleware] INFO Token refreshed successfully for ${pathname}`);
        return response;
      }
    } catch (error) {
      console.error('[middleware] ERROR Token refresh failed:', error);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
};
