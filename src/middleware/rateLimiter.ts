import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiting options
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 60 seconds per IP
  blockDuration: 60 * 5, // Block for 5 minutes after limit is reached
});

export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  
  try {
    await rateLimiter.consume(ip);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '300', // 5 minutes in seconds
      },
    });
  }
}
