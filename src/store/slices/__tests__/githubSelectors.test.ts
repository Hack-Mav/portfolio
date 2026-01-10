import { describe, it, expect } from 'vitest';
import {
  selectRepositories,
  selectRepository,
  selectRepositoriesLoading,
  selectRepositoriesError
} from '../githubSlice';

// Import the actual types from the slice
import { GitHubState, Repository } from '../githubSlice';

// Mock RootState type for testing
interface RootState {
  github: GitHubState;
}

describe('githubSelectors', () => {
  // Mock repository data
  const mockRepository: Repository = {
    id: 1,
    name: 'test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/test/test-repo',
    stargazers_count: 10,
    forks_count: 5,
    language: 'TypeScript',
    updated_at: '2023-01-01T00:00:00Z',
    fork: false,
  };

  const initialState: RootState = {
    github: {
      repositories: {
        data: [mockRepository],
        loading: false,
        error: null,
        timestamp: Date.now(),
        lastFetched: Date.now(),
        retryCount: 0,
      },
      repositoryDetails: {
        'test-repo': {
          data: mockRepository,
          loading: false,
          error: null,
          timestamp: 1672531200000,
          lastFetched: 1672531200000,
          retryCount: 0,
        },
      },
      rateLimit: {
        remaining: 30,
        limit: 60,
        reset: 1672534800000,
      },
    },
  };

  it('should select repositories', () => {
    const result = selectRepositories(initialState);
    expect(result).toEqual(initialState.github.repositories.data);
  });

  it('should select repository by name', () => {
    const result = selectRepository('test-repo')(initialState);
    expect(result).toEqual(initialState.github.repositoryDetails['test-repo'].data);
  });

  it('should return null for non-existent repository', () => {
    const result = selectRepository('non-existent')(initialState);
    expect(result).toBeNull();
  });

  it('should select loading state', () => {
    const result = selectRepositoriesLoading(initialState);
    expect(result).toBe(false);
  });

  it('should select error state', () => {
    const result = selectRepositoriesError(initialState);
    expect(result).toBeNull();
  });
});
