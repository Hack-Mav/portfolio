import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GitHubState, RateLimit } from './githubSlice.types';

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
    remaining: 60,
    limit: 60,
    reset: 0,
  },
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setRateLimit: (state, action: PayloadAction<RateLimit>) => {
      state.rateLimit = action.payload;
    },
    // Keep these actions for backward compatibility
    clearRepositoriesCache: (state) => {
      state.repositories = {
        ...initialState.repositories,
        retryCount: state.repositories.retryCount,
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
      }
    },
    resetRepositoryError: (state, action: PayloadAction<string>) => {
      const repoName = action.payload;
      if (state.repositoryDetails[repoName]?.error) {
        state.repositoryDetails[repoName].error = null;
      }
    },
  },
});

export const { 
  setRateLimit,
  clearRepositoriesCache,
  clearRepositoryCache,
  resetRepositoriesError,
  resetRepositoryError 
} = githubSlice.actions;

export default githubSlice.reducer;
