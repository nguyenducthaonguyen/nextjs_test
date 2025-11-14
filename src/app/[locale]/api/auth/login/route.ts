// app/api/auth/login/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      credentials: 'include', // nhận cookie refresh_token từ backend
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message || 'Login failed' }, { status: 401 });
    }

    const { access_token, expires_in, username: uname, role, id } = data.data;

    const response = NextResponse.json({ user: { id, username: uname, role } });

    // ✅ Lưu access_token vào cookie domain frontend
    response.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: false, // localhost
      sameSite: 'strict',
      maxAge: Number(expires_in),
      path: '/', // 🔥 phải "/" để các route khác đọc được
    });

    // ✅ Copy refresh_token từ backend sang cookie domain frontend
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (match) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        response.cookies.set('refresh_token', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 3600,
          path: '/',
        });
      }
    }

    return response;
  } catch (error) {
    let message = 'Login failed';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
