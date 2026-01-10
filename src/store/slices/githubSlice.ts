import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { captureException } from '../../utils/error-handler';

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;  // Add this line
}

interface GitHubError {
  message: string;
  status?: number;
  isRateLimitError?: boolean;
  retryAfter?: number;
  isNetworkError?: boolean;
  resetTime?: number;
}

// Type for the rejected value in createAsyncThunk
interface RejectedValue {
  message: string;
  status?: number;
  isRateLimitError?: boolean;
  retryAfter?: number;
  isNetworkError?: boolean;
  resetTime?: number;
}

export interface GitHubState {
  repositories: {
    data: Repository[] | null;
    loading: boolean;
    error: GitHubError | null;
    timestamp: number | null;
    lastFetched: number | null;
    retryCount: number;
  };
  repositoryDetails: {
    [key: string]: {
      data: Repository | null;
      loading: boolean;
      error: GitHubError | null;
      timestamp: number | null;
      lastFetched: number | null;
      retryCount: number;
    };
  };
  rateLimit: {
    remaining: number;
    reset: number | null;
    limit: number;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const GITHUB_USERNAME = 'Hack-Mav';

const initialState: GitHubState = {
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
    remaining: 60, // Default to a safe value
    reset: null,
    limit: 60,
  },
};

// Helper function to check if cache is still valid
const isCacheValid = (timestamp: number | null): boolean => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
};

// Create an axios instance with base configuration
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 15000, // Increased timeout
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
  validateStatus: (status) => status < 500, // Don't throw for 4xx errors
});

// Response interceptor to handle rate limiting and errors
githubApi.interceptors.response.use(
  (response) => {
    // Update rate limit from headers if available
    if (response.headers['x-ratelimit-remaining'] && 
        response.headers['x-ratelimit-limit'] && 
        response.headers['x-ratelimit-reset']) {
      // This will be handled in the thunk
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors and timeouts
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timed out. Please check your internet connection.',
        isNetworkError: true,
      });
    }
    
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
      });
    }
    
    // Handle GitHub API rate limiting
    if (error.response.status === 403 && 
        error.response.headers['x-ratelimit-remaining'] === '0') {
      const resetTime = parseInt(error.response.headers['x-ratelimit-reset'] || '0') * 1000;
      const retryAfter = Math.max(0, resetTime - Date.now());
      
      return Promise.reject({
        message: 'GitHub API rate limit exceeded',
        status: 403,
        isRateLimitError: true,
        retryAfter,
        resetTime,
      });
    }
    
    // Handle other API errors
    let errorMessage = 'An unexpected error occurred';
    if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      errorMessage = (error.response.data as any).message;
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response.status,
    });
  }
);

// Thunks
export const fetchRepositories = createAsyncThunk(
  'github/fetchRepositories',
  async (_, { getState, rejectWithValue, dispatch }) => {
    const { github } = getState() as { github: GitHubState };
    
    try {
      // Return cached data if it's still valid
      if (github.repositories.data && isCacheValid(github.repositories.timestamp)) {
        return { 
          data: github.repositories.data, 
          fromCache: true 
        };
      }

      const response = await githubApi.get<Repository[]>(`/users/${GITHUB_USERNAME}/repos`, {
        params: {
          sort: 'updated',
          per_page: 50,
          type: 'owner',
        },
      });

      // Filter out forked repositories
      const repositories = response.data.filter(repo => !repo.fork);
      
      return { 
        data: repositories, 
        fromCache: false,
        rateLimit: {
          remaining: parseInt(response.headers['x-ratelimit-remaining'] || '0'),
          limit: parseInt(response.headers['x-ratelimit-limit'] || '60'),
          reset: parseInt(response.headers['x-ratelimit-reset'] || '0') * 1000,
        }
      };
    } catch (error: any) {
      // Log the error to Sentry
      captureException(error, { 
        context: 'fetchRepositories',
        username: GITHUB_USERNAME,
      });
      
      return rejectWithValue({
        message: error.message || 'Failed to fetch repositories',
        status: error.status,
        isRateLimitError: error.isRateLimitError,
        retryAfter: error.retryAfter,
      });
    }
  },
  {
    // Add retry logic
    condition: (_, { getState }) => {
      const { github } = getState() as { github: GitHubState };
      // Don't run if already loading
      if (github.repositories.loading) return false;
      // Check if we need to wait before retrying
      if (github.repositories.error?.isRateLimitError && github.repositories.retryCount >= 3) {
        return false; // Don't retry more than 3 times for rate limits
      }
      return true;
    },
  }
);

export const fetchRepository = createAsyncThunk(
  'github/fetchRepository',
  async (repoName: string, { getState, rejectWithValue }) => {
    const { github } = getState() as { github: GitHubState };
    
    try {
      // Return cached data if it's still valid
      if (
        github.repositoryDetails[repoName]?.data && 
        isCacheValid(github.repositoryDetails[repoName]?.timestamp)
      ) {
        return { 
          data: github.repositoryDetails[repoName].data, 
          repoName,
          fromCache: true 
        };
      }

      const response = await githubApi.get<Repository>(`/repos/${GITHUB_USERNAME}/${repoName}`);
      
      return { 
        data: response.data, 
        repoName, 
        fromCache: false,
        rateLimit: {
          remaining: parseInt(response.headers['x-ratelimit-remaining'] || '0'),
          limit: parseInt(response.headers['x-ratelimit-limit'] || '60'),
          reset: parseInt(response.headers['x-ratelimit-reset'] || '0') * 1000,
        }
      };
    } catch (error: any) {
      // Log the error to Sentry
      captureException(error, { 
        context: 'fetchRepository',
        username: GITHUB_USERNAME,
        repository: repoName,
      });
      
      return rejectWithValue({
        message: error.message || `Failed to fetch repository: ${repoName}`,
        status: error.status,
        isRateLimitError: error.isRateLimitError,
        retryAfter: error.retryAfter,
      });
    }
  },
  {
    // Add retry logic
    condition: (repoName, { getState }) => {
      const { github } = getState() as { github: GitHubState };
      const repoState = github.repositoryDetails[repoName] || {
        loading: false,
        retryCount: 0,
        error: null,
      };
      
      // Don't run if already loading
      if (repoState.loading) return false;
      
      // Check if we need to wait before retrying
      if (repoState.error?.isRateLimitError && repoState.retryCount >= 3) {
        return false; // Don't retry more than 3 times for rate limits
      }
      
      return true;
    },
  }
);

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    clearRepositoriesCache: (state) => {
      state.repositories = {
        ...initialState.repositories,
        retryCount: state.repositories.retryCount, // Keep retry count
      };
    },
    clearRepositoryCache: (state, action: PayloadAction<string>) => {
      const repoName = action.payload;
      if (state.repositoryDetails[repoName]) {
        delete state.repositoryDetails[repoName];
      }
    },
    resetRepositoriesError: (state) => {
      if (state.repositories.error) {
        state.repositories.error = null;
        state.repositories.retryCount = 0;
      }
    },
    resetRepositoryError: (state, action: PayloadAction<string>) => {
      const repoName = action.payload;
      if (state.repositoryDetails[repoName]?.error) {
        state.repositoryDetails[repoName].error = null;
        state.repositoryDetails[repoName].retryCount = 0;
      }
    },
  },
  extraReducers: (builder) => {
    // fetchRepositories cases
    builder.addCase(fetchRepositories.pending, (state) => {
      state.repositories.loading = true;
      state.repositories.error = null;
      state.repositories.lastFetched = Date.now();
    });
    
    builder.addCase(fetchRepositories.fulfilled, (state, action) => {
      state.repositories.loading = false;
      state.repositories.retryCount = 0; // Reset retry count on success
      
      if (!action.payload.fromCache) {
        state.repositories.data = action.payload.data;
        state.repositories.timestamp = Date.now();
        
        // Update rate limit if available
        if (action.payload.rateLimit) {
          state.rateLimit = {
            remaining: action.payload.rateLimit.remaining,
            limit: action.payload.rateLimit.limit,
            reset: action.payload.rateLimit.reset,
          };
        }
      }
    });
    
    builder.addCase(fetchRepositories.rejected, (state, action) => {
      state.repositories.loading = false;
      state.repositories.retryCount = (state.repositories.retryCount || 0) + 1;
      
      // Handle the rejected value from rejectWithValue
      const payload = action.payload as RejectedValue | undefined;
      const error = action.error;
      
      state.repositories.error = {
        message: payload?.message || error.message || 'An unknown error occurred',
        status: payload?.status,
        isRateLimitError: payload?.isRateLimitError,
        retryAfter: payload?.retryAfter,
        isNetworkError: payload?.isNetworkError,
        resetTime: payload?.resetTime,
      };
    });

    // fetchRepository cases
    builder.addCase(fetchRepository.pending, (state, action) => {
      const repoName = action.meta.arg;
      if (!state.repositoryDetails[repoName]) {
        state.repositoryDetails[repoName] = {
          data: null,
          loading: true,
          error: null,
          timestamp: null,
          lastFetched: Date.now(),
          retryCount: 0,
        };
      } else {
        state.repositoryDetails[repoName].loading = true;
        state.repositoryDetails[repoName].error = null;
        state.repositoryDetails[repoName].lastFetched = Date.now();
      }
    });
    
    builder.addCase(fetchRepository.fulfilled, (state, action) => {
      const { repoName, data } = action.payload;
      
      if (!state.repositoryDetails[repoName]) {
        state.repositoryDetails[repoName] = {
          data: null,
          loading: false,
          error: null,
          timestamp: null,
          lastFetched: Date.now(),
          retryCount: 0,
        };
      }
      
      if (!action.payload.fromCache) {
        state.repositoryDetails[repoName].data = data;
        state.repositoryDetails[repoName].timestamp = Date.now();
        state.repositoryDetails[repoName].retryCount = 0; // Reset retry count on success
        
        // Update rate limit if available
        if (action.payload.rateLimit) {
          state.rateLimit = {
            remaining: action.payload.rateLimit.remaining,
            limit: action.payload.rateLimit.limit,
            reset: action.payload.rateLimit.reset,
          };
        }
      }
      
      state.repositoryDetails[repoName].loading = false;
    });
    
    builder.addCase(fetchRepository.rejected, (state, action) => {
      const repoName = action.meta.arg;
      
      if (!state.repositoryDetails[repoName]) {
        state.repositoryDetails[repoName] = {
          data: null,
          loading: false,
          error: null,
          timestamp: null,
          lastFetched: Date.now(),
          retryCount: 1,
        };
      } else {
        state.repositoryDetails[repoName].loading = false;
        state.repositoryDetails[repoName].retryCount = 
          (state.repositoryDetails[repoName].retryCount || 0) + 1;
      }
      
      // Handle the rejected value from rejectWithValue
      const payload = action.payload as RejectedValue | undefined;
      const error = action.error;
      
      state.repositoryDetails[repoName].error = {
        message: payload?.message || error.message || `An unknown error occurred while fetching ${repoName}`,
        status: payload?.status,
        isRateLimitError: payload?.isRateLimitError,
        retryAfter: payload?.retryAfter,
        isNetworkError: payload?.isNetworkError,
        resetTime: payload?.resetTime,
      };
    });
  },
});

// Selectors
export const selectRepositories = (state: { github: GitHubState }) => state.github.repositories.data;

export const selectRepository = (repoName: string) => 
  (state: { github: GitHubState }) => state.github.repositoryDetails[repoName]?.data || null;

export const selectRepositoriesLoading = (state: { github: GitHubState }) => 
  state.github.repositories.loading;

export const selectRepositoriesError = (state: { github: GitHubState }) => 
  state.github.repositories.error;

export const { 
  clearRepositoriesCache, 
  clearRepositoryCache,
  resetRepositoriesError,
  resetRepositoryError 
} = githubSlice.actions;
export default githubSlice.reducer;
