import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple in-memory rate limiter
class RateLimiter {
  private hits: Map<string, { count: number; resetTime: number }>;
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.hits = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async consume(ip: string): Promise<boolean> {
    const now = Date.now();
    const hit = this.hits.get(ip);

    if (hit) {
      if (hit.resetTime <= now) {
        // Reset the counter if the window has passed
        this.hits.set(ip, { count: 1, resetTime: now + this.windowMs });
        return true;
      }

      // Check if rate limit is exceeded
      if (hit.count >= this.limit) {
        return false;
      }

      // Increment the hit count
      hit.count++;
      return true;
    }

    // First hit for this IP in the current window
    this.hits.set(ip, { count: 1, resetTime: now + this.windowMs });
    return true;
  }
}

// Rate limiter instance (100 requests per minute per IP)
const rateLimiter = new RateLimiter(100, 60 * 1000);

// In-memory store for CSRF tokens (in production, use Redis or similar)
const csrfTokens = new Map<string, string>();

/**
 * Apply security headers to the response
 */
export function applySecurityHeaders(req: NextRequest, res: NextResponse) {
  // Headers are now handled in next.config.js
  return res;
}

/**
 * Apply rate limiting
 */
export async function applyRateLimit(
  req: NextRequest,
  res: NextResponse
): Promise<boolean> {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    return await rateLimiter.consume(ip);
  } catch (error) {
    console.error('Rate limiting error:', error);
    return false;
  }
}

/**
 * Generate and store a CSRF token
 */
export function generateCsrfToken(req: NextRequest): string {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.cookies.get('sessionId')?.value || crypto.randomUUID();
  csrfTokens.set(sessionId, token);
  
  // Set the session cookie if it doesn't exist
  if (!req.cookies.get('sessionId')) {
    const response = NextResponse.next();
    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
  }
  
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(
  req: NextRequest,
  res: NextResponse,
  token: string
): boolean {
  const sessionId = req.cookies.get('sessionId')?.value;
  if (!sessionId) return false;
  
  const storedToken = csrfTokens.get(sessionId);
  
  if (!storedToken || storedToken !== token) {
    return false;
  }
  
  // Invalidate the token after use
  csrfTokens.delete(sessionId);
  return true;
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
