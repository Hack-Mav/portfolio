import { useMemo } from 'react';
import { 
  useGetRepositoriesQuery,
  useLazyGetRepositoriesQuery,
  useGetRepositoryQuery,
  useLazyGetRepositoryQuery,
  selectRepositories,
  selectRepository
} from '../store/api/githubApi';
import { useAppSelector } from '../store';

interface UseGitHubRepositoriesResult {
  repositories: any[] | null;
  loading: boolean;
  error: {
    message: string;
    status?: number;
  } | null;
  lastUpdated: number | null;
  refetch: () => void;
  retryCount: number;
  resetError: () => void;
  isInitialLoading: boolean;
  isRefreshing: boolean;
}

export const useGitHubRepositories = (): UseGitHubRepositoriesResult => {
  const { 
    data: repositories, 
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    requestId,
    status,
    startedTimeStamp,
    fulfilledTimeStamp,
  } = useGetRepositoriesQuery(undefined, {
    // Optional: Add any additional options like polling, refetchOnMount, etc.
    refetchOnMountOrArgChange: true,
  });

  const isInitialLoading = status === 'pending' && !repositories && !isError;
  const isRefreshing = isFetching && !!repositories;

  // Transform the error to match the expected format
  const transformedError = useMemo(() => {
    if (!error) return null;
    
    if ('status' in error) {
      // Handle RTK Query error
      return {
        message: 'data' in error ? 
          (error.data as { message?: string })?.message || 'An error occurred' :
          'An error occurred',
        status: error.status,
      };
    }
    
    return {
      message: error.message || 'An unknown error occurred',
    };
  }, [error]);

  // RTK Query handles refetching and caching automatically
  const resetError = () => {
    // RTK Query handles error states internally
  };

  return {
    repositories: repositories || null,
    loading: isLoading,
    error: transformedError,
    lastUpdated: fulfilledTimeStamp || null,
    refetch,
    retryCount: 0, // RTK Query handles retries internally
    resetError,
    isInitialLoading,
    isRefreshing,
  };
};

interface UseGitHubRepositoryResult {
  repository: any | null;
  loading: boolean;
  error: {
    message: string;
    status?: number;
  } | null;
  lastUpdated: number | null;
  refetch: () => void;
  retryCount: number;
  resetError: () => void;
  isInitialLoading: boolean;
  isRefreshing: boolean;
}

export const useGitHubRepository = (repoName: string): UseGitHubRepositoryResult => {
  const { 
    data: repository, 
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    requestId,
    status,
    startedTimeStamp,
    fulfilledTimeStamp,
  } = useGetRepositoryQuery(repoName, {
    skip: !repoName,
    refetchOnMountOrArgChange: true,
  });

  const isInitialLoading = status === 'pending' && !repository && !isError;
  const isRefreshing = isFetching && !!repository;

  // Transform the error to match the expected format
  const transformedError = useMemo(() => {
    if (!error) return null;
    
    if ('status' in error) {
      // Handle RTK Query error
      return {
        message: 'data' in error ? 
          (error.data as { message?: string })?.message || 'An error occurred' :
          'An error occurred',
        status: error.status,
      };
    }
    
    return {
      message: error.message || 'An unknown error occurred',
    };
  }, [error]);

  // RTK Query handles refetching and caching automatically
  const resetError = () => {
    // RTK Query handles error states internally
  };

  return {
    repository: repository || null,
    loading: isLoading,
    error: transformedError,
    lastUpdated: fulfilledTimeStamp || null,
    refetch,
    retryCount: 0, // RTK Query handles retries internally
    resetError,
    isInitialLoading,
    isRefreshing,
  };
};
