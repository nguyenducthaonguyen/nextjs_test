import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

type FetchWithAuthOptions = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
};

export async function fetchWithAuth(options: FetchWithAuthOptions) {
  const { url, method = 'GET', body, headers = {} } = options;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  console.log(`[v0] fetchWithAuth ${method} ${url} - accessToken: ${!!accessToken}, refreshToken: ${!!refreshToken}`);

  if (!accessToken && refreshToken) {
    console.log('[v0] No access token, attempting refresh...');
    const refreshResult = await refreshAccessToken(refreshToken);
    if (refreshResult.success) {
      accessToken = refreshResult.accessToken;
      console.log('[v0] Refresh successful before first request');
    } else {
      console.log('[v0] Refresh failed before first request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  if (!accessToken) {
    console.log('[v0] No access token available, returning 401');
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

  console.log(`[v0] Making request to ${backendUrl}${url}`);
  let response = await fetch(`${backendUrl}${url}`, requestOptions);
  console.log(`[v0] Response status: ${response.status}`);

  if (response.status === 401 && refreshToken) {
    console.log('[v0] Access token expired, refreshing...');
    const refreshResult = await refreshAccessToken(refreshToken);

    if (refreshResult.success) {
      console.log('[v0] Refresh successful, retrying original request...');
      // Retry the original request with new token
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${refreshResult.accessToken}`,
      };
      response = await fetch(`${backendUrl}${url}`, requestOptions);
      console.log(`[v0] Retry response status: ${response.status}`);
    } else {
      console.log('[v0] Refresh failed, session expired');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
  }

  const data = await response.json();

  if (!response.ok) {
    console.log(`[v0] Request failed with status ${response.status}:`, data);
    return NextResponse.json({ error: data.message || 'Request failed' }, { status: response.status });
  }

  console.log(`[v0] Request successful`);
  return NextResponse.json(data);
}

async function refreshAccessToken(refreshToken: string): Promise<{ success: boolean; accessToken?: string }> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    console.log('[v0] Calling refresh endpoint...');
    const refreshResponse = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`,
      },
    });

    console.log(`[v0] Refresh response status: ${refreshResponse.status}`);

    if (!refreshResponse.ok) {
      console.log('[v0] Refresh response not OK');
      return { success: false };
    }

    const refreshData = await refreshResponse.json();
    console.log('[v0] Refresh data structure:', JSON.stringify(refreshData));

    const newAccessToken = refreshData.data?.access_token || refreshData.access_token;

    if (!newAccessToken) {
      console.log('[v0] No access token in refresh response');
      return { success: false };
    }

    const cookieStore = await cookies();
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
    });

    console.log('[v0] Token refreshed and cookie set successfully');
    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    console.error('[v0] Refresh token error:', error);
    return { success: false };
  }
}
