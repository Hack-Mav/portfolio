import { describe, it, expect } from 'vitest';
import { ROUTES } from '@/constants/routes';

describe('Routes Configuration', () => {
  it('should have the correct route paths', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.ABOUT).toBe('/about');
    expect(ROUTES.PROJECTS).toBe('/projects');
    expect(ROUTES.CONTACT).toBe('/contact');
    expect(ROUTES.UNDEFINED).toBe('*');
  });

  it('should have all routes defined', () => {
    expect(ROUTES).toHaveProperty('HOME');
    expect(ROUTES).toHaveProperty('ABOUT');
    expect(ROUTES).toHaveProperty('PROJECTS');
    expect(ROUTES).toHaveProperty('CONTACT');
    expect(ROUTES).toHaveProperty('UNDEFINED');
  });
});
