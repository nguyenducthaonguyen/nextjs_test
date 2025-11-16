import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ckinxt1wmj.execute-api.ap-southeast-1.amazonaws.com/dev/';
    const res = await fetch(`${backendUrl}/api/v1/products/`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
