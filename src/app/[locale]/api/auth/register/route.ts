import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/config/storage';

export async function POST(request: NextRequest) {
  try {
    const { username, password, full_name, email, phone, address } = await request.json();

    if (!username || !password || !full_name || !email || !phone || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
    const response = await fetch(`${backendUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, full_name, email, phone, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return NextResponse.json({ error_message: data.message || 'Registration failed' }, { status: response.status });
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch(`${backendUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      credentials: 'include', // nhận cookie refresh_token từ backend
    });
    const { access_token, expires_in, username: uname, role, id } = data.data;

    const responseLogin = NextResponse.json({ user: { id, username: uname, role } });

    responseLogin.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: Number(expires_in),
      path: '/',
    });

    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (match) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        responseLogin.cookies.set('refresh_token', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 3600,
          path: '/',
        });
      }
    }

    return responseLogin;
  } catch (error) {
    console.error('[v0] Backend register error:', error);
    return NextResponse.json({ error: 'Failed to connect to backend' }, { status: 500 });
  }
}
