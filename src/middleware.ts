// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders, applyRateLimit, validateCsrfToken, generateCsrfToken } from './middleware/securityUtils';

// Helper to create a response with security headers
function createSecureResponse() {
  const response = NextResponse.next();
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add CSP header (complementing the one in next.config.js)
  response.headers.set(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"
  );
  
  return response;
}

// Paths that should be public (no authentication/CSRF required)
const publicPaths = [
  '/api/health',
  '/_next/static',
  '/_next/image',
  '/favicon.ico',
  '/assets',
];

// Check if the current path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath =>
    path.startsWith(publicPath)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = createSecureResponse();
  
  // Skip middleware for public paths
  if (isPublicPath(pathname)) {
    return response;
  }
  
  // Apply rate limiting to all API routes
  if (pathname.startsWith('/api/')) {
    const isAllowed = await applyRateLimit(request, response);
    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: response.headers }
      );
    }

    // Add CSRF protection for state-changing methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const csrfToken = request.headers.get('x-csrf-token');
      if (!csrfToken || !validateCsrfToken(request, response, csrfToken)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or missing CSRF token' }),
          { status: 403, headers: response.headers }
        );
      }
    }
    
    // Add CSRF token to API responses for subsequent requests
    if (['GET', 'HEAD'].includes(request.method)) {
      const csrfToken = generateCsrfToken(request);
      response.headers.set('x-csrf-token', csrfToken);
    }
  }
  
  return response;
}

// Apply middleware to all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
  ],
};