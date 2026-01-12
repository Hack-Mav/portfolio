// src/middleware/security.ts
import type { IncomingMessage, ServerResponse } from 'http';
import { randomUUID } from 'crypto';

// Rate limiting configuration
const RATE_LIMIT = 100; // requests
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store for rate limiting (consider using Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface ViteRequest extends IncomingMessage {
  originalUrl?: string;
  ip?: string;
  headers: IncomingMessage['headers'] & {
    [key: string]: string | string[] | undefined;
  };
}

// Security headers middleware
export function applySecurityHeaders(
  req: ViteRequest,
  res: ServerResponse
): void {
  const nonce = randomUUID();
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Set CSP Header
  const isDev = process.env.NODE_ENV === 'development';
  const cspDirectives = isDev
  ? [
      // Development CSP - more permissive
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' http: https:`,
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: http: ws: wss:",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'"
    ]
  : [
      // Production CSP - more strict
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.github.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'"
    ];
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  
  // Add nonce to request for later use in components
  req.headers['x-nonce'] = nonce;
}

// Rate limiting middleware
export function applyRateLimit(
  req: ViteRequest,
  res: ServerResponse
): boolean {
  const ip = req.socket.remoteAddress || '127.0.0.1';
  const currentTime = Date.now();
  const rateLimitEntry = rateLimitStore.get(ip);

  if (rateLimitEntry) {
    // Reset rate limit if window has passed
    if (currentTime > rateLimitEntry.resetTime) {
      rateLimitStore.delete(ip);
    } else {
      // Check if rate limit exceeded
      if (rateLimitEntry.count >= RATE_LIMIT) {
        res.setHeader('Retry-After', Math.ceil(
          (rateLimitEntry.resetTime - currentTime) / 1000
        ).toString());
        res.statusCode = 429;
        res.end('Too Many Requests');
        return false;
      }
      // Increment request count
      rateLimitEntry.count += 1;
    }
  } else {
    // Initialize new rate limit entry
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: currentTime + RATE_LIMIT_WINDOW_MS,
    });
  }
  return true;
}

// CSRF protection middleware
export function validateCsrfToken(
  req: ViteRequest,
  res: ServerResponse,
  csrfToken: string
): boolean {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
    const requestToken = req.headers['x-csrf-token'];
    
    if (!requestToken || requestToken !== csrfToken) {
      res.statusCode = 403;
      res.end('Invalid CSRF token');
      return false;
    }
  }
  return true;
}