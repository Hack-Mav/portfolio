import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { motion } from 'framer-motion';
import ProjectCard from '../ProjectCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    article: ({ children }: { children: React.ReactNode }) => <article>{children}</article>,
    a: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  },
  useInView: () => true,
}));

// Mock react-tooltip
vi.mock('react-tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: () => '2 days ago',
}));

// Mock utils
vi.mock('@/utils/cn', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      ui: () => ({
        theme: { mode: 'light', systemPreference: 'light' },
        notifications: { notifications: [], maxNotifications: 5 },
        loading: { global: false, components: {} },
        sidebar: { isOpen: false, isMobile: false },
      }),
      githubApi: () => ({}),
      ...initialState,
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
};

// Mock project data
const mockProject = {
  name: 'test-project',
  description: 'A test project for testing purposes',
  html_url: 'https://github.com/test/test-project',
  stargazers_count: 42,
  forks_count: 10,
  watchers_count: 15,
  language: 'TypeScript',
  updated_at: '2024-01-15T10:30:00Z',
  homepage: 'https://test-project.vercel.app',
};

describe('ProjectCard', () => {
  const defaultProps = {
    project: mockProject,
    index: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders project information correctly', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    // Check project name
    expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
    
    // Check description
    expect(screen.getByText('A test project for testing purposes')).toBeInTheDocument();
    
    // Check language
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText('42')).toBeInTheDocument(); // stars
    expect(screen.getByText('15')).toBeInTheDocument(); // watchers
    expect(screen.getByText('10')).toBeInTheDocument(); // forks
  });

  it('renders GitHub link correctly', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const githubLink = screen.getByRole('link', { name: /view source code/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/test-project');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders homepage link when available', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const homepageLink = screen.getByRole('link', { name: /view live demo/i });
    expect(homepageLink).toBeInTheDocument();
    expect(homepageLink).toHaveAttribute('href', 'https://test-project.vercel.app');
    expect(homepageLink).toHaveAttribute('target', '_blank');
    expect(homepageLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render homepage link when not available', () => {
    const projectWithoutHomepage = {
      ...mockProject,
      homepage: null,
    };

    render(
      <TestWrapper>
        <ProjectCard project={projectWithoutHomepage} index={0} />
      </TestWrapper>
    );

    const homepageLink = screen.queryByRole('link', { name: /view live demo/i });
    expect(homepageLink).not.toBeInTheDocument();
  });

  it('handles missing description gracefully', () => {
    const projectWithoutDescription = {
      ...mockProject,
      description: null,
    };

    render(
      <TestWrapper>
        <ProjectCard project={projectWithoutDescription} index={0} />
      </TestWrapper>
    );

    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('displays language color correctly', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const languageElement = screen.getByText('TypeScript').closest('div');
    expect(languageElement).toBeInTheDocument();
    
    // Check if the language indicator has the correct class
    const languageIndicator = languageElement?.querySelector('.bg-blue-500');
    expect(languageIndicator).toBeInTheDocument();
  });

  it('displays updated time', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    expect(screen.getByText(/Updated 2 days ago/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    
    // Check ARIA labels on links
    const githubLink = screen.getByRole('link', { name: /view source code/i });
    expect(githubLink).toHaveAttribute('aria-label');
    
    if (mockProject.homepage) {
      const homepageLink = screen.getByRole('link', { name: /view live demo/i });
      expect(homepageLink).toHaveAttribute('aria-label');
    }
  });

  it('handles missing language gracefully', () => {
    const projectWithoutLanguage = {
      ...mockProject,
      language: null,
    };

    render(
      <TestWrapper>
        <ProjectCard project={projectWithoutLanguage} index={0} />
      </TestWrapper>
    );

    // Language should not be displayed
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  it('formats project name correctly', () => {
    const projectWithComplexName = {
      ...mockProject,
      name: 'my-awesome-project-with-dashes',
    };

    render(
      <TestWrapper>
        <ProjectCard project={projectWithComplexName} index={0} />
      </TestWrapper>
    );

    expect(screen.getByText(/My Awesome Project With Dashes/i)).toBeInTheDocument();
  });

  it('displays correct tooltip IDs', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    // Check that tooltip elements have correct IDs
    const tooltipElements = screen.getAllByTestId(/project-tooltip/);
    expect(tooltipElements.length).toBeGreaterThan(0);
  });

  it('handles large numbers correctly', () => {
    const projectWithLargeNumbers = {
      ...mockProject,
      stargazers_count: 1234567,
      forks_count: 987654,
      watchers_count: 555555,
    };

    render(
      <TestWrapper>
        <ProjectCard project={projectWithLargeNumbers} index={0} />
      </TestWrapper>
    );

    expect(screen.getByText('1,234,567')).toBeInTheDocument(); // stars
    expect(screen.getByText('555,555')).toBeInTheDocument(); // watchers
    expect(screen.getByText('987,654')).toBeInTheDocument(); // forks
  });

  it('has correct CSS classes', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const card = screen.getByRole('article');
    expect(card).toHaveClass('group');
    expect(card).toHaveClass('relative');
    expect(card).toHaveClass('bg-white');
  });

  it('is accessible via keyboard', async () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} />
      </TestWrapper>
    );

    const githubLink = screen.getByRole('link', { name: /view source code/i });
    
    // Test keyboard navigation
    githubLink.focus();
    expect(githubLink).toHaveFocus();
    
    // Test Enter key
    fireEvent.keyDown(githubLink, { key: 'Enter' });
    // In a real test, this would navigate to the GitHub page
  });

  it('supports different index values', () => {
    render(
      <TestWrapper>
        <ProjectCard {...defaultProps} index={5} />
      </TestWrapper>
    );

    // The card should render correctly regardless of index
    expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
  });

  it('handles edge cases in project data', () => {
    const edgeCaseProject = {
      name: '',
      description: '',
      html_url: '',
      stargazers_count: 0,
      forks_count: 0,
      watchers_count: 0,
      language: '',
      updated_at: '',
      homepage: null,
    };

    render(
      <TestWrapper>
        <ProjectCard project={edgeCaseProject} index={0} />
      </TestWrapper>
    );

    // Should handle empty data gracefully
    expect(screen.getByText('Unnamed Project')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });
});
