import { NextRequest, NextResponse } from 'next/server';

// This API route handles logout by redirecting to NextAuth signout
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Redirect to NextAuth signout endpoint
  return NextResponse.redirect(new URL('/api/auth/signout', request.url));
}
