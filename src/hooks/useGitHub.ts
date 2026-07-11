import { useState, useEffect, useCallback, useRef } from 'react'
import type { Repository } from '@/types/github'

const GITHUB_API_URL = 'https://api.github.com'
const GITHUB_USERNAME = 'parthivrawat'
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

interface CacheEntry {
  data: Repository[]
  timestamp: number
}

let repositoriesCache: CacheEntry | null = null

interface GitHubErrorResponse {
  message?: string
  [key: string]: unknown
}

interface UseGitHubRepositoriesResult {
  repositories: Repository[] | null
  loading: boolean
  error: {
    message: string
    status?: number
    isRateLimitError?: boolean
  } | null
  lastUpdated: number | null
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

const parseError = async (response: Response): Promise<GitHubErrorResponse> => {
  try {
    return (await response.json()) as GitHubErrorResponse
  } catch {
    return {}
  }
}

export const useGitHubRepositories = (): UseGitHubRepositoriesResult => {
  const [repositories, setRepositories] = useState<Repository[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<UseGitHubRepositoriesResult['error']>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)
  const abortRef = useRef<AbortController | null>(null)

  const fetchRepositories = useCallback(async (isRefetch = false) => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const abortController = new AbortController()
    abortRef.current = abortController

    setLoading(true)
    if (isRefetch) {
      setRetryCount(prev => prev + 1)
    } else {
      setRetryCount(0)
    }

    // Return cached data without re-fetching if the cache is still fresh.
    if (!isRefetch && repositoriesCache) {
      const isCacheFresh =
        Date.now() - repositoriesCache.timestamp < CACHE_TTL_MS
      if (isCacheFresh) {
        setRepositories(repositoriesCache.data)
        setLastUpdated(repositoriesCache.timestamp)
        setLoading(false)
        setError(null)
        abortRef.current = null
        return
      }
    }

    try {
      const response = await fetch(
        `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
          },
          signal: abortController.signal,
        }
      )

      if (!response.ok) {
        const data = await parseError(response)
        const message =
          data.message || `Failed to fetch repositories (${response.status})`
        setError({
          message,
          status: response.status,
          isRateLimitError: isRateLimitError(response.status, message),
        })
        setRepositories(null)
      } else {
        const data = (await response.json()) as Repository[]
        repositoriesCache = { data, timestamp: Date.now() }
        setRepositories(data)
        setLastUpdated(Date.now())
        setError(null)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError({
        message:
          err instanceof Error
            ? err.message
            : 'An unknown network error occurred',
      })
      setRepositories(null)
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [])

  useEffect(() => {
    void fetchRepositories(false)
    return () => {
      abortRef.current?.abort()
    }
  }, [fetchRepositories])

  const refetch = useCallback(() => {
    void fetchRepositories(true)
  }, [fetchRepositories])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const isInitialLoading = loading && !repositories && !error
  const isRefreshing = loading && !!repositories

  return {
    repositories,
    loading,
    error,
    lastUpdated,
    refetch,
    retryCount,
    resetError,
    isInitialLoading,
    isRefreshing,
  }
}

export const useGitHubRepository = (repoName: string) => {
  const [repository, setRepository] = useState<Repository | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<UseGitHubRepositoriesResult['error']>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)
  const abortRef = useRef<AbortController | null>(null)

  const fetchRepository = useCallback(
    async (isRefetch = false) => {
      if (!repoName) {
        setLoading(false)
        setRepository(null)
        return
      }

      if (abortRef.current) {
        abortRef.current.abort()
      }
      const abortController = new AbortController()
      abortRef.current = abortController

      setLoading(true)
      if (isRefetch) {
        setRetryCount(prev => prev + 1)
      } else {
        setRetryCount(0)
      }

      try {
        const response = await fetch(
          `${GITHUB_API_URL}/repos/${GITHUB_USERNAME}/${repoName}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
            signal: abortController.signal,
          }
        )

        if (!response.ok) {
          const data = await parseError(response)
          const message =
            data.message || `Failed to fetch repository (${response.status})`
          setError({
            message,
            status: response.status,
            isRateLimitError: isRateLimitError(response.status, message),
          })
          setRepository(null)
        } else {
          const data = (await response.json()) as Repository
          setRepository(data)
          setLastUpdated(Date.now())
          setError(null)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        setError({
          message:
            err instanceof Error
              ? err.message
              : 'An unknown network error occurred',
        })
        setRepository(null)
      } finally {
        setLoading(false)
        abortRef.current = null
      }
    },
    [repoName]
  )

  useEffect(() => {
    void fetchRepository(false)
    return () => {
      abortRef.current?.abort()
    }
  }, [fetchRepository])

  const refetch = useCallback(() => {
    void fetchRepository(true)
  }, [fetchRepository])

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const isInitialLoading = loading && !repository && !error
  const isRefreshing = loading && !!repository

  return {
    repository,
    loading,
    error,
    lastUpdated,
    refetch,
    retryCount,
    resetError,
    isInitialLoading,
    isRefreshing,
  }
}
