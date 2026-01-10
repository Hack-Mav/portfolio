// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders, applyRateLimit, validateCsrfToken } from './middleware/security';

// Helper to convert NextRequest to Node.js compatible request/response
function createNodeLikeResponse() {
  const response = new NextResponse();
  const headers = new Headers();
  
  return {
    setHeader: (name: string, value: string) => {
      headers.set(name, value);
      return response;
    },
    getHeader: (name: string) => headers.get(name),
    end: () => response,
    headers
  };
}

export async function middleware(request: NextRequest) {
  // Create a Node.js-like response object
  const nodeRes = createNodeLikeResponse();
  
  // Apply security headers
  applySecurityHeaders(request as any, nodeRes as any);
  
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const isRateLimited = !applyRateLimit(request as any, nodeRes as any);
    if (isRateLimited) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: Object.fromEntries(nodeRes.headers.entries())
      });
    }

    // Apply CSRF protection to state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      if (!csrfToken || !validateCsrfToken(request as any, nodeRes as any, csrfToken)) {
        return new NextResponse('Invalid CSRF token', {
          status: 403,
          headers: Object.fromEntries(nodeRes.headers.entries())
        });
      }
    }
  }

  // Convert headers back to NextResponse
  const response = new NextResponse(null, {
    status: 200,
    headers: Object.fromEntries(nodeRes.headers.entries())
  });

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};