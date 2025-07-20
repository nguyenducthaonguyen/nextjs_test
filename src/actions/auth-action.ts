'use server';

import type { LoginFormData } from '@/validations/login-validation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(data: LoginFormData) {
  // Simulate authentication delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { email, password } = data;

  // Simulate authentication logic
  if (email === 'admin@example.com' && password === 'password123') {
    // Store the JWT token in cookies
    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === 'production';
    cookieStore.set('auth.access_token', '<JWT_TOKEN>', {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      path: '/',
    });

    redirect('/');
  }

  return {
    success: false,
    message: 'Invalid email or password. Please try again.',
  };
}
