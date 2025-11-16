import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ckinxt1wmj.execute-api.ap-southeast-1.amazonaws.com/dev';
    const cookieStore = await cookies();

    let accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;

    console.log('[v0] /api/auth/me - accessToken exists:', !!accessToken, 'refreshToken exists:', !!refreshToken);

    if (!accessToken && refreshToken) {
      console.log('[v0] No access token, refreshing...');
      const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken}`,
        },
      });

      console.log('[v0] Refresh response status:', refreshResponse.status);

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        console.log('[v0] Refresh data structure:', JSON.stringify(refreshData));
        accessToken = refreshData.data?.access_token || refreshData.access_token;

        if (accessToken) {
          cookieStore.set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 15,
          });
          console.log('[v0] New access token set in cookies');
        } else {
          console.log('[v0] No access token in refresh response');
        }
      } else {
        const errorText = await refreshResponse.text();
        console.log('[v0] Refresh failed with error:', errorText);
      }
    }

    if (!accessToken) {
      console.log('[v0] Still no access token after refresh attempt, returning 401');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const res = await fetch(`${backendUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('[v0] /api/v1/auth/me response status:', res.status);

    if (res.status === 401 && refreshToken) {
      console.log('[v0] Access token expired, refreshing and retrying...');

      try {
        const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `refresh_token=${refreshToken}`,
          },
        });

        console.log('[v0] Refresh response status:', refreshResponse.status);

        if (!refreshResponse.ok) {
          const errorText = await refreshResponse.text();
          console.log('[v0] Refresh failed with status:', refreshResponse.status, 'error:', errorText);
          return NextResponse.json({ user: null }, { status: 401 });
        }

        const refreshData = await refreshResponse.json();
        console.log('[v0] Refresh data structure:', JSON.stringify(refreshData));

        const newAccessToken = refreshData.data?.access_token || refreshData.access_token;

        if (!newAccessToken) {
          console.log('[v0] No access_token found in refresh response');
          return NextResponse.json({ user: null }, { status: 401 });
        }

        console.log('[v0] New access token received, setting cookie...');
        cookieStore.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 15,
        });

        console.log('[v0] Token refreshed, retrying /api/v1/auth/me...');

        // Retry with new token
        const retryRes = await fetch(`${backendUrl}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        console.log('[v0] Retry response status:', retryRes.status);

        if (retryRes.ok) {
          const data = await retryRes.json();
          console.log('[v0] User data retrieved successfully after refresh');
          return NextResponse.json({ user: data }, { status: 200 });
        } else {
          const retryError = await retryRes.text();
          console.log('[v0] Retry failed with error:', retryError);
        }
      } catch (refreshError) {
        console.error('[v0] Exception during refresh:', refreshError);
      }

      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: res.status });
    }

    const data = await res.json();
    console.log('[v0] User data retrieved successfully');
    return NextResponse.json({ user: data }, { status: 200 });
  } catch (err) {
    console.error('[v0] Auth check error:', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
