// src/utils/csrf.ts
import { randomBytes } from 'crypto';

export function generateCsrfToken() {
  return randomBytes(32).toString('hex');
}

export function validateCsrfToken(token: string, cookieToken: string): boolean {
  return token === cookieToken;
}