// src/App.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children,
  Helmet: () => <title>Test Title</title>,
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: any }) => (
    <a href={to} {...props}>{children}</a>
  ),
  NavLink: ({ children, to, ...props }: { children: React.ReactNode; to: string; [key: string]: any }) => (
    <a href={to} {...props}>{children}</a>
  ),
}));

// Mock child components to avoid loading the entire app
vi.mock('@components/organisms/Header', () => ({
  default: () => <header>Mock Header</header>
}));

vi.mock('@components/atoms/LoadingSpinner', () => ({
  default: () => <div>Loading...</div>
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders the app container', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(<App />);
    expect(screen.getByText('Mock Header')).toBeInTheDocument();
  });
});
