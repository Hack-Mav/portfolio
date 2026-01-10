import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../store';
import { 
  fetchRepositories, 
  fetchRepository, 
  resetRepositoriesError, 
  resetRepositoryError 
} from '../store/slices/githubSlice';
import { captureException } from '../utils/error-handler';

interface UseGitHubRepositoriesResult {
  repositories: any[] | null;
  loading: boolean;
  error: {
    message: string;
    status?: number;
    isRateLimitError?: boolean;
    retryAfter?: number;
    isNetworkError?: boolean;
    resetTime?: number;
  } | null;
  lastUpdated: Date | null;
  refetch: () => void;
  retryCount: number;
  resetError: () => void;
  isInitialLoading: boolean;
  isRefreshing: boolean;
}

export const useGitHubRepositories = (): UseGitHubRepositoriesResult => {
  const dispatch = useAppDispatch();
  const { 
    data: repositories, 
    loading, 
    error, 
    timestamp, 
    retryCount,
    lastFetched
  } = useAppSelector((state: RootState) => ({
    ...state.github.repositories,
    lastFetched: state.github.repositories.lastFetched || 0,
  }));

  const isInitialLoading = loading && !repositories && !error;
  const isRefreshing = loading && !!repositories;

  const fetchData = useCallback(() => {
    dispatch(fetchRepositories())
      .unwrap()
      .catch((err: Error) => {
        // Error is already handled in the slice, but we can add additional logging if needed
        console.error('Failed to fetch repositories:', err);
        captureException(err, { context: 'useGitHubRepositories' });
      });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleResetError = useCallback(() => {
    dispatch(resetRepositoriesError());
  }, [dispatch]);

  return useMemo(() => ({
    repositories,
    loading,
    error,
    lastUpdated: timestamp ? new Date(timestamp) : null,
    refetch: handleRefetch,
    retryCount: retryCount || 0,
    resetError: handleResetError,
    isInitialLoading,
    isRefreshing,
  }), [
    repositories, 
    loading, 
    error, 
    timestamp, 
    handleRefetch, 
    retryCount, 
    handleResetError,
    isInitialLoading,
    isRefreshing,
  ]);
};

interface UseGitHubRepositoryResult {
  repository: any | null;
  loading: boolean;
  error: {
    message: string;
    status?: number;
    isRateLimitError?: boolean;
    retryAfter?: number;
    isNetworkError?: boolean;
    resetTime?: number;
  } | null;
  lastUpdated: Date | null;
  refetch: () => void;
  retryCount: number;
  resetError: () => void;
  isInitialLoading: boolean;
  isRefreshing: boolean;
}

export const useGitHubRepository = (repoName: string): UseGitHubRepositoryResult => {
  const dispatch = useAppDispatch();
  
  const {
    data: repository,
    loading,
    error,
    timestamp,
    retryCount = 0,
    lastFetched = 0,
  } = useAppSelector((state: RootState) => ({
    ...(state.github.repositoryDetails[repoName] || {
      data: null,
      loading: false,
      error: null,
      timestamp: null,
      retryCount: 0,
      lastFetched: 0,
    }),
  }));

  const isInitialLoading = loading && !repository && !error;
  const isRefreshing = loading && !!repository;

  const fetchData = useCallback(() => {
    if (!repoName) return;
    
    dispatch(fetchRepository(repoName))
      .unwrap()
      .catch((err: Error) => {
        // Error is already handled in the slice, but we can add additional logging if needed
        console.error(`Failed to fetch repository ${repoName}:`, err);
        captureException(err, { 
          context: 'useGitHubRepository',
          repository: repoName 
        });
      });
  }, [dispatch, repoName]);

  useEffect(() => {
    if (repoName) {
      fetchData();
    }
  }, [repoName, fetchData]);

  const handleRefetch = useCallback(() => {
    if (repoName) {
      fetchData();
    }
  }, [repoName, fetchData]);

  const handleResetError = useCallback(() => {
    if (repoName) {
      dispatch(resetRepositoryError(repoName));
    }
  }, [dispatch, repoName]);

  return useMemo(() => ({
    repository,
    loading,
    error,
    lastUpdated: timestamp ? new Date(timestamp) : null,
    refetch: handleRefetch,
    retryCount,
    resetError: handleResetError,
    isInitialLoading,
    isRefreshing,
  }), [
    repository, 
    loading, 
    error, 
    timestamp, 
    handleRefetch, 
    retryCount, 
    handleResetError,
    isInitialLoading,
    isRefreshing,
  ]);
};
