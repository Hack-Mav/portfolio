import { describe, it, expect } from 'vitest';
import {
  isRepositoryState,
  type RepositoryState,
  type GitHubState,
  type GitHubError,
} from '../githubSlice.types';

describe('github slice type utilities', () => {
  it('should identify a valid repository state', () => {
    const repoState: RepositoryState = {
      data: {
        id: 1,
        name: 'example',
        full_name: 'owner/example',
        description: null,
        html_url: 'https://github.com/owner/example',
        stargazers_count: 0,
        forks_count: 0,
        watchers_count: 0,
        language: 'TypeScript',
        updated_at: new Date().toISOString(),
        fork: false,
      },
      loading: false,
      error: null,
      timestamp: Date.now(),
      lastFetched: Date.now(),
      retryCount: 0,
    };

    expect(isRepositoryState(repoState)).toBe(true);
  });

  it('should reject an invalid repository state', () => {
    const invalidState = {
      data: null,
      // missing loading and error keys
    };

    expect(isRepositoryState(invalidState)).toBe(false);
  });

  it('should allow constructing GitHubState shape', () => {
    const state: GitHubState = {
      repositories: {
        data: null,
        loading: true,
        error: null,
        timestamp: null,
        lastFetched: null,
        retryCount: 0,
      },
      repositoryDetails: {},
      rateLimit: {
        remaining: 60,
        limit: 60,
        reset: 0,
      },
    };

    expect(state.rateLimit.limit).toBe(60);
  });

  it('should support GitHubError metadata flags', () => {
    const error: GitHubError = {
      message: 'Rate limited',
      status: 403,
      isRateLimitError: true,
      retryAfter: 60,
    };

    expect(error.isRateLimitError).toBe(true);
    expect(error.status).toBe(403);
  });
});
