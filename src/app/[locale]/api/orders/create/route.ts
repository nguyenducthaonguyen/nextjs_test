import type { NextRequest } from 'next/server';
import { fetchWithAuth } from '@/lib/api-auth-fetch';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return await fetchWithAuth({
      url: '/api/v1/orders',
      method: 'POST',
      body,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
