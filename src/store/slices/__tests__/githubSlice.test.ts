import { configureStore } from '@reduxjs/toolkit';
import githubReducer, {
  fetchRepositories,
  fetchRepository,
  resetRepositoriesError,
  resetRepositoryError,
  selectRepositories,
  selectRepository,
  selectRepositoriesLoading,
  selectRepositoriesError,
  type GitHubState
} from '../githubSlice';

// Mock the store type
interface AppStore {
  getState: () => { github: GitHubState };
  dispatch: (action: any) => any;
}

// Import the Repository type from the slice
import type { Repository } from '../githubSlice';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

// Import MockInstance type from vitest
import type { MockInstance } from 'vitest';

// This will use the mock from __mocks__/axios.ts
import { mockAxiosInstance } from '../../../__mocks__/axios';
vi.mock('axios');

// Use the mock instance for testing and type it properly
const mockedAxios = mockAxiosInstance as unknown as {
  get: MockInstance<typeof axios.get>;
  // Add other methods if needed
};

// Mock CACHE_DURATION if not exported from the slice
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

describe('githubSlice', () => {
  let store: AppStore;
  
  const mockRepository: Repository = {
    id: 1,
    name: 'test-repo',
    description: 'A test repository',
    html_url: 'https://github.com/test/test-repo',
    stargazers_count: 10,
    forks_count: 5,
    language: 'TypeScript',
    updated_at: '2023-01-01T00:00:00Z',
    fork: false,
  };

  const mockRepositories: Repository[] = [mockRepository];

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        github: githubReducer
      }
    });
    
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset Date.now() mock after each test
    vi.useRealTimers();
  });

  describe('fetchRepositories - Integration Tests', () => {
    it('should handle empty response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.fulfilled.type);
      expect(state.repositories.data).toEqual([]);
      expect(state.repositories.loading).toBe(false);
    });
    
    it('should handle large number of repositories', async () => {
      const largeRepoList: Repository[] = Array(100).fill(0).map((_, i) => ({
        id: i,
        name: `repo-${i}`,
        description: `Repository ${i}`,
        html_url: `https://github.com/test/repo-${i}`,
        stargazers_count: Math.floor(Math.random() * 1000),
        forks_count: Math.floor(Math.random() * 500),
        language: ['TypeScript', 'JavaScript', 'Python', 'Go'][i % 4],
        updated_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
        fork: false,
      }));
      
      mockedAxios.get.mockResolvedValueOnce({ data: largeRepoList });
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.fulfilled.type);
      expect(state.repositories.data).toHaveLength(100);
      expect(state.repositories.loading).toBe(false);
    });
    
    it('should handle malformed API response', async () => {
      mockedAxios.get.mockResolvedValueOnce({ 
        data: { 
          items: [ // GitHub API sometimes wraps in an items property
            {
              id: 1,
              name: 'test-repo',
              description: 'Test repository',
            },
            // Missing required fields
            {
              id: 2,
              name: 'incomplete-repo'
            }
          ] 
        } 
      });
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      // Should still succeed but with only valid repositories
      expect(result.type).toBe(fetchRepositories.fulfilled.type);
      expect(state.repositories.data).toHaveLength(1);
      expect(state.repositories.data?.[0].name).toBe('test-repo');
    });
  });

  describe('fetchRepositories - Edge Cases', () => {
    it('should handle initial state', () => {
      const initialState = githubReducer(undefined, { type: 'unknown' });
      expect(initialState.repositories).toEqual({
        data: null,
        loading: false,
        error: null,
        lastFetched: 0,
        retryCount: 0,
      });
    });

    it('should handle fetchRepositories.pending', () => {
      const action = { type: fetchRepositories.pending.type };
      const state = githubReducer(undefined, action);
      expect(state.repositories.loading).toBe(true);
    });

    it('should handle fetchRepositories.fulfilled', async () => {
      const mockData = mockRepositories;
      mockedAxios.get.mockResolvedValue({ data: mockData });
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.fulfilled.type);
      expect(state.repositories.data).toEqual(mockData);
      expect(state.repositories.loading).toBe(false);
      expect(state.repositories.error).toBeNull();
      expect(state.repositories.lastFetched).toBeGreaterThan(0);
    });

    it('should use cached data if not expired', async () => {
      // Mock Date.now() to control the current time
      const fixedTime = new Date('2023-01-01T00:00:00Z').getTime();
      vi.useFakeTimers().setSystemTime(fixedTime);
      
      // Initial fetch
      mockedAxios.get.mockResolvedValueOnce({ data: mockRepositories });
      await store.dispatch(fetchRepositories());
      
      // Move time forward but within cache duration
      vi.setSystemTime(fixedTime + CACHE_DURATION - 1000);
      
      // Second fetch should use cache
      const result = await store.dispatch(fetchRepositories());
      
      // Should not make a second API call
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(result.meta.requestStatus).toBe('fulfilled');
    });

    it('should refetch if cache is expired', async () => {
      // Mock Date.now() to control the current time
      const fixedTime = new Date('2023-01-01T00:00:00Z').getTime();
      vi.useFakeTimers().setSystemTime(fixedTime);
      
      // Initial fetch
      mockedAxios.get.mockResolvedValueOnce({ data: mockRepositories });
      await store.dispatch(fetchRepositories());
      
      // Move time forward past cache duration
      vi.setSystemTime(fixedTime + CACHE_DURATION + 1000);
      
      // Mock the second API call
      mockedAxios.get.mockResolvedValueOnce({ data: [...mockRepositories] });
      
      // Second fetch should make a new API call
      await store.dispatch(fetchRepositories());
      
      // Should make two API calls
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should handle fetchRepositories.rejected with rate limit error', async () => {
      const error = {
        response: {
          status: 403,
          headers: {
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': (Math.floor(Date.now() / 1000) + 60).toString(),
          },
          data: {
            message: 'API rate limit exceeded',
          },
        },
      };
      
      mockedAxios.get.mockRejectedValueOnce(error);
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.rejected.type);
      expect(state.repositories.error?.isRateLimitError).toBe(true);
      expect(state.repositories.error?.status).toBe(403);
      expect(state.repositories.retryCount).toBe(1);
    });

    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      mockedAxios.get.mockRejectedValueOnce(error);
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.rejected.type);
      expect(state.repositories.error?.isNetworkError).toBe(true);
      expect(state.repositories.error?.message).toContain('Network Error');
    });
  });

  describe('fetchRepository - Edge Cases', () => {
    let store: ReturnType<typeof configureStore<{ github: GitHubState }>>;
    const mockRepository: Repository = {
      id: 1,
      name: 'test-repo',
      description: 'A test repository',
      html_url: 'https://github.com/test/test-repo',
      stargazers_count: 10,
      forks_count: 5,
      language: 'TypeScript',
      updated_at: '2023-01-01T00:00:00Z',
      fork: false,
    };

    beforeEach(() => {
      store = configureStore({
        reducer: {
          github: githubReducer
        }
      });
      vi.clearAllMocks();
    });

    it('should handle repository with no description', async () => {
      const repoName = 'no-desc-repo';
      const mockRepo: Repository = {
        ...mockRepository,
        name: repoName,
        description: null,
      };
      
mockedAxios.get.mockResolvedValueOnce({ data: mockRepo } as AxiosResponse);
      
      const result = await store.dispatch(fetchRepository(repoName));
      const state = store.getState().github;
      
      expect(result.type).toBe(fetchRepository.fulfilled.type);
      expect(state.repositoryDetails[repoName]?.data).toEqual(mockRepo);
      expect(state.repositoryDetails[repoName]?.data?.description).toBeNull();
    });
    
    it('should handle repository with special characters in name', async () => {
      const repoName = 'test@repo#123';
      const mockRepo: Repository = {
        ...mockRepository,
        name: repoName,
      };

mockedAxios.get.mockImplementation(
        (url: string, _config?: AxiosRequestConfig) => {
          if (url.includes(encodeURIComponent(repoName))) {
            return Promise.resolve({
              data: mockRepo,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: { url, method: 'get' },
              request: {}
            } as AxiosResponse);
          }
          return Promise.reject(new Error('Invalid URL'));
        }
      );
      
      await store.dispatch(fetchRepository(repoName));
      
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(repoName)),
        expect.any(Object)
      );
    });
  });
  
  describe('Error Handling - Integration', () => {
    let store: ReturnType<typeof configureStore<{ github: GitHubState }>>;
    
    beforeEach(() => {
      store = configureStore({
        reducer: {
          github: githubReducer
        }
      });
      vi.clearAllMocks();
    });

    it('should handle 500 server error', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' },
        },
      };
      
      mockedAxios.get.mockRejectedValueOnce(error);
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.rejected.type);
      expect(state.repositories.error?.status).toBe(500);
      expect(state.repositories.retryCount).toBe(1);
    });
    
    it('should handle network disconnection', async () => {
      const error = new Error('Network Error');
      error.message = 'Network Error';
      (error as any).isNetworkError = true;
      
      mockedAxios.get.mockRejectedValueOnce(error);
      
      const result = await store.dispatch(fetchRepositories() as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepositories.rejected.type);
      expect(state.repositories.error?.isNetworkError).toBe(true);
    });
  });
  
  describe('Snapshot Tests', () => {
    it('should match initial state snapshot', () => {
      const initialState = githubReducer(undefined, { type: 'unknown' });
      expect(initialState).toMatchSnapshot();
    });
    
    it('should match repositories loading state snapshot', () => {
      const action = { type: fetchRepositories.pending.type };
      const state = githubReducer(undefined, action);
      expect(state).toMatchSnapshot();
    });
    
    it('should match repositories success state snapshot', () => {
      const action = {
        type: fetchRepositories.fulfilled.type,
        payload: {
          data: [mockRepository],
          fromCache: false,
        },
      };
      const state = githubReducer(undefined, action);
      expect(state).toMatchSnapshot();
    });
  });
  
  describe('fetchRepository - Integration', () => {
    const repoName = 'test-repo';
    
    it('should handle fetchRepository.fulfilled', async () => {
      const mockData = mockRepository;
      mockedAxios.get.mockResolvedValue({ data: mockData });
      
      const result = await store.dispatch(fetchRepository(repoName) as any);
      const state = store.getState().github as unknown as GitHubState;
      
      expect(result.type).toBe(fetchRepository.fulfilled.type);
      expect(state.repositoryDetails[repoName]?.data).toEqual(mockData);
      expect(state.repositoryDetails[repoName]?.loading).toBe(false);
      expect(state.repositoryDetails[repoName]?.error).toBeNull();
    });

    it('should handle fetchRepository.rejected', async () => {
      const error = { response: { status: 404, data: { message: 'Not Found' } } };
      mockedAxios.get.mockRejectedValueOnce(error);
      
      const result = await store.dispatch(fetchRepository('nonexistent-repo'));
      const state = store.getState().github;
      
      expect(result.type).toBe(fetchRepository.rejected.type);
      expect(state.repositoryDetails['nonexistent-repo']?.error?.status).toBe(404);
      expect(state.repositoryDetails['nonexistent-repo']?.loading).toBe(false);
    });
  });

  describe('error reset actions', () => {
    it('should reset repositories error', () => {
      // First set an error
      const errorState = githubReducer(undefined, {
        type: fetchRepositories.rejected.type,
        error: { message: 'Test error' }
      });
      
      // Then reset it
      const state = githubReducer(errorState, resetRepositoriesError());
      
      expect(state.repositories.error).toBeNull();
      expect(state.repositories.retryCount).toBe(0);
    });

    it('should reset repository error', () => {
      const repoName = 'test-repo';
      
      // First set an error for a specific repository
      const errorState = githubReducer(undefined, {
        type: fetchRepository.rejected.type,
        meta: { arg: repoName },
        error: { message: 'Test error' }
      });
      
      // Then reset it
      const state = githubReducer(errorState, resetRepositoryError(repoName));
      
      expect(state.repositoryDetails[repoName]?.error).toBeNull();
    });
  });

  describe('retry logic', () => {
    it('should increment retryCount on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Test error'));
      
      // First attempt fails
      await store.dispatch(fetchRepositories());
      let state = store.getState().github;
      expect(state.repositories.retryCount).toBe(1);
      
      // Second attempt fails
      mockedAxios.get.mockRejectedValueOnce(new Error('Test error'));
      await store.dispatch(fetchRepositories());
      state = store.getState().github;
      expect(state.repositories.retryCount).toBe(2);
      
      // Success resets retryCount
      mockedAxios.get.mockResolvedValueOnce({ data: mockRepositories });
      await store.dispatch(fetchRepositories());
      state = store.getState().github;
      expect(state.repositories.retryCount).toBe(0);
    });
  });
});
