import { describe, it, expect } from 'vitest';
import reducer, {
  setRateLimit,
  clearRepositoriesCache,
  clearRepositoryCache,
  resetRepositoriesError,
  resetRepositoryError,
} from '../githubSlice';
import type { GitHubState } from '../githubSlice.types';

const createState = (overrides: Partial<GitHubState> = {}): GitHubState => ({
  repositories: {
    data: null,
    loading: false,
    error: null,
    timestamp: null,
    lastFetched: null,
    retryCount: 0,
    ...overrides.repositories,
  },
  repositoryDetails: overrides.repositoryDetails ?? {},
  rateLimit: overrides.rateLimit ?? {
    remaining: 60,
    limit: 60,
    reset: 0,
  },
});

describe('githubSlice reducer', () => {
  it('should return initial state by default', () => {
    const initialState = reducer(undefined, { type: 'unknown' });

    expect(initialState).toEqual({
      repositories: {
        data: null,
        loading: false,
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
    });
  });

  it('should update rate limit information', () => {
    const next = reducer(
      undefined,
      setRateLimit({ remaining: 10, limit: 60, reset: 1234 })
    );

    expect(next.rateLimit).toEqual({ remaining: 10, limit: 60, reset: 1234 });
  });

  it('should clear repositories cache while preserving retry count', () => {
    const state = createState({
      repositories: {
        data: [{ id: 1 } as any],
        loading: true,
        error: { message: 'error' },
        timestamp: Date.now(),
        lastFetched: Date.now(),
        retryCount: 2,
      },
    });

    const next = reducer(state, clearRepositoriesCache());

    expect(next.repositories).toMatchObject({
      data: null,
      loading: false,
      error: null,
      retryCount: 2,
    });
  });

  it('should clear specific repository cache entry', () => {
    const state = createState({
      repositoryDetails: {
        foo: {
          data: { id: 1 } as any,
          loading: false,
          error: null,
          timestamp: null,
          lastFetched: null,
          retryCount: 0,
        },
      },
    });

    const next = reducer(state, clearRepositoryCache('foo'));

    expect(next.repositoryDetails.foo).toBeUndefined();
  });

  it('should reset repositories error state', () => {
    const state = createState({
      repositories: {
        data: null,
        loading: false,
        error: { message: 'boom' },
        timestamp: null,
        lastFetched: null,
        retryCount: 1,
      },
    });

    const next = reducer(state, resetRepositoriesError());

    expect(next.repositories.error).toBeNull();
    expect(next.repositories.retryCount).toBe(1);
  });

  it('should reset repository-specific error', () => {
    const state = createState({
      repositoryDetails: {
        foo: {
          data: null,
          loading: false,
          error: { message: 'oops' },
          timestamp: null,
          lastFetched: null,
          retryCount: 0,
        },
      },
    });

    const next = reducer(state, resetRepositoryError('foo'));

    expect(next.repositoryDetails.foo?.error).toBeNull();
  });
});
