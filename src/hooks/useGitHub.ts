import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Repository, GitHubError } from '@/types/github'

const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_USERNAME = 'parthivrawat'
const STALE_TIME_MS = 5 * 60 * 1000 // 5 minutes

interface UseGitHubRepositoriesResult {
  repositories: Repository[] | null
  loading: boolean
  error: GitHubError | null
  lastUpdated: number
  refetch: () => void
  retryCount: number
  resetError: () => void
  isInitialLoading: boolean
  isRefreshing: boolean
}

interface UseGitHubRepositoryResult {
  repository: Repository | null
  loading: boolean
  error: GitHubError | null
  lastUpdated: number
  refetch: () => void
  retryCount: number
  resetError: () => void
  isInitialLoading: boolean
  isRefreshing: boolean
}

const isRateLimitError = (status: number, message = ''): boolean => {
  return (
    status === 403 ||
    status === 429 ||
    message.toLowerCase().includes('rate limit')
  )
}

const parseErrorResponse = async (response: Response): Promise<unknown> => {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

const createGitHubError = (
  status: number,
  message: string,
  fallback: string
): GitHubError => ({
  message: message || fallback,
  status,
  isRateLimitError: isRateLimitError(status, message),
})

const fetchRepositories = async ({
  signal,
}: {
  signal: AbortSignal
}): Promise<Repository[]> => {
  const response = await fetch(
    `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      signal,
    }
  )

  if (!response.ok) {
    const data = (await parseErrorResponse(response)) as { message?: string }
    const message = data.message || ''
    throw createGitHubError(
      response.status,
      message,
      `Failed to fetch repositories (${response.status})`
    )
  }

  return response.json() as Promise<Repository[]>
}

const fetchRepository = async (
  repoName: string,
  signal: AbortSignal
): Promise<Repository> => {
  const response = await fetch(
    `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${repoName}`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      signal,
    }
  )

  if (!response.ok) {
    const data = (await parseErrorResponse(response)) as { message?: string }
    const message = data.message || ''
    throw createGitHubError(
      response.status,
      message,
      `Failed to fetch repository (${response.status})`
    )
  }

  return response.json() as Promise<Repository>
}

export const useGitHubRepositories = (): UseGitHubRepositoriesResult => {
  const [retryCount, setRetryCount] = useState<number>(0)

  const query = useQuery<Repository[], GitHubError>({
    queryKey: ['github', 'repositories', GITHUB_USERNAME],
    queryFn: fetchRepositories,
    staleTime: STALE_TIME_MS,
    retry: false,
  })

  const refetch = useCallback(() => {
    setRetryCount(prev => prev + 1)
    void query.refetch()
  }, [query])

  const resetError = useCallback(() => {
    setRetryCount(0)
    void query.refetch()
  }, [query])

  return {
    repositories: query.data ?? null,
    loading: query.isFetching,
    error: query.error ?? null,
    lastUpdated: query.dataUpdatedAt,
    refetch,
    retryCount,
    resetError,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
  }
}

export const useGitHubRepository = (
  repoName: string
): UseGitHubRepositoryResult => {
  const [retryCount, setRetryCount] = useState<number>(0)

  const query = useQuery<Repository, GitHubError>({
    queryKey: ['github', 'repository', GITHUB_USERNAME, repoName],
    queryFn: ({ signal }) => fetchRepository(repoName, signal),
    enabled: !!repoName,
    staleTime: STALE_TIME_MS,
    retry: false,
  })

  const refetch = useCallback(() => {
    setRetryCount(prev => prev + 1)
    void query.refetch()
  }, [query])

  const resetError = useCallback(() => {
    setRetryCount(0)
    void query.refetch()
  }, [query])

  return {
    repository: query.data ?? null,
    loading: query.isFetching,
    error: query.error ?? null,
    lastUpdated: query.dataUpdatedAt,
    refetch,
    retryCount,
    resetError,
    isInitialLoading: query.isLoading,
    isRefreshing: query.isFetching && !query.isLoading,
  }
}
