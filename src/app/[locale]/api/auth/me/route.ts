import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/config/storage';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
    const cookieStore = await cookies();

    let accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!accessToken && refreshToken) {
      const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken}`,
        },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.data?.access_token || refreshData.access_token;

        if (accessToken) {
          cookieStore.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15,
          });
        }
      } else {
        const errorText = await refreshResponse.text();
        console.error(' Refresh failed with error:', errorText);
      }
    }

    if (!accessToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.status === 401 && refreshToken) {
      try {
        const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refresh_token=${refreshToken}`,
          },
        });
        if (!refreshResponse.ok) {
          return NextResponse.json({ user: null }, { status: 401 });
        }

        const refreshData = await refreshResponse.json();

        const newAccessToken = refreshData.data?.access_token || refreshData.access_token;

        if (!newAccessToken) {
          return NextResponse.json({ user: null }, { status: 401 });
        }

        cookieStore.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 15,
        });
        // Retry with new token
        const retryRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        if (retryRes.ok) {
          const data = await retryRes.json();
          return NextResponse.json({ user: data }, { status: 200 });
        }
      } catch (refreshError) {
        console.error(' Exception during refresh:', refreshError);
      }

      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err) {
    console.error('Auth check error:', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
