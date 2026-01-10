export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
  [key: string]: any;
}

export interface GitHubError {
  message: string;
  status?: number;
  isRateLimitError?: boolean;
  isNetworkError?: boolean;
  retryAfter?: number;
}

export interface RepositoryState<T = Repository | Repository[] | null> {
  data: T;
  loading: boolean;
  error: GitHubError | null;
  lastFetched: number;
  retryCount: number;
}

export interface GitHubState {
  repositories: RepositoryState<Repository[]>;
  repositoryDetails: {
    [key: string]: RepositoryState<Repository>;
  };
}

export interface RateLimit {
  remaining: number;
  limit: number;
  reset: number;
}
