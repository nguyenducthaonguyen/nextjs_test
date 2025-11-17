import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/config/storage';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || BASE_URL;
    const res = await fetch(`${backendUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refresh_token=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
    }

    const data = await res.json();
    const { access_token, expires_in } = data.data;

    const response = NextResponse.json({ success: true });

    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(expires_in),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ message: 'Refresh failed' }, { status: 500 });
  }
}
