import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/config/storage';

type FetchWithAuthOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

export async function fetchWithAuth(options: FetchWithAuthOptions) {
  const { url, method = 'GET', body, headers = {} } = options;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  if (!accessToken && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);
    if (refreshResult.success) {
      accessToken = refreshResult.accessToken;
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...headers,
    },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  let response = await fetch(`${backendUrl}${url}`, requestOptions);

  if (response.status === 401 && refreshToken) {
    const refreshResult = await refreshAccessToken(refreshToken);

    if (refreshResult.success) {
      // Retry the original request with new token
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${refreshResult.accessToken}`,
      };
      response = await fetch(`${backendUrl}${url}`, requestOptions);
    } else {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
  }

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: data.message || 'Request failed' }, { status: response.status });
  }

  return NextResponse.json(data);
}

async function refreshAccessToken(refreshToken: string): Promise<{ success: boolean; accessToken?: string }> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
    const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`,
      },
    });
    if (!refreshResponse.ok) {
      return { success: false };
    }

    const refreshData = await refreshResponse.json();

    const newAccessToken = refreshData.data?.access_token || refreshData.access_token;

    if (!newAccessToken) {
      return { success: false };
    }

    const cookieStore = await cookies();
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
    });

    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    console.error('[v0] Refresh token error:', error);
    return { success: false };
  }
}
