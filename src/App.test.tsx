// src/App.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from './test-utils';
import App from './App';

describe('App', () => {
  it('renders the app with navigation', () => {
    render(<App />);
    
    // Check if the logo is rendered
    const logo = screen.getByText(/portfolio/i);
    expect(logo).toBeInTheDocument();
  });
});
