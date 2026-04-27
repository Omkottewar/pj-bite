import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Per-user rate limit map: sessionToken -> timestamp[]
const rateLimitMap = new Map<string, number[]>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitMap.entries()) {
    if (timestamps.every(ts => now - ts > 60000)) {
      rateLimitMap.delete(key);
    }
  }
}, 300000);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/checkout')) {
    const now = Date.now();

    // Use session token to identify USER, not IP
    // This allows thousands of different users to order simultaneously
    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value ||
      // Fallback to IP only if no session (unauthenticated = treat as bot)
      (request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1');

    const timestamps = rateLimitMap.get(sessionToken) || [];
    const recentCalls = timestamps.filter(ts => now - ts < 60000);

    // Each user: max 10 checkout attempts/min (they only ever need 2 per order)
    // This blocks bots/script attacks while NEVER affecting real concurrent users
    if (recentCalls.length >= 10) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please wait a moment before trying again." }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    recentCalls.push(now);
    rateLimitMap.set(sessionToken, recentCalls);
  }

  // Security Headers on all matched routes
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/api/checkout/:path*',
    '/api/orders/:path*',
    '/api/shipping/:path*',
  ],
};
