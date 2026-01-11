// Base repository interface with required fields
export interface BaseRepository {
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
  fork: boolean;
  [key: string]: unknown; // Use unknown instead of any for better type safety
}

// Extended repository type that can be used for API responses
export type Repository = Readonly<BaseRepository>;

// Type guard for GitHub API errors
export function isGitHubError(error: unknown): error is GitHubError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as GitHubError).message === 'string'
  );
}

// Type for GitHub API error responses
export interface GitHubApiError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

// Application error type
export type GitHubError = {
  message: string;
  status?: number;
  isRateLimitError?: boolean;
  isNetworkError?: boolean;
  retryAfter?: number;
  resetTime?: number;
  code?: string;
};

// Base state interface for repository data
export interface RepositoryStateBase<T> {
  data: T;
  loading: boolean;
  error: GitHubError | null;
  timestamp: number | null;
  lastFetched: number | null;
  retryCount: number;
}

// State type for repositories list
export interface RepositoriesState extends RepositoryStateBase<Repository[] | null> {}

// State type for single repository
export interface RepositoryState extends RepositoryStateBase<Repository | null> {}

// Type guard for repository state
export function isRepositoryState(state: unknown): state is RepositoryState {
  return (
    typeof state === 'object' &&
    state !== null &&
    'data' in state &&
    'loading' in state &&
    'error' in state
  );
}

// Root state for GitHub-related data
export interface GitHubState {
  repositories: RepositoriesState;
  repositoryDetails: {
    [key: string]: RepositoryState;
  };
  rateLimit: {
    remaining: number;
    limit: number;
    reset: number;
  };
}

// Type for GitHub API rate limit response
export interface GitHubRateLimit {
  resources: {
    core: RateLimit;
    search: RateLimit;
    graphql: RateLimit;
  };
  rate: RateLimit;
}

// Type for GitHub API headers
export interface GitHubHeaders {
  'x-ratelimit-limit'?: string;
  'x-ratelimit-remaining'?: string;
  'x-ratelimit-reset'?: string;
  'x-ratelimit-used'?: string;
  'retry-after'?: string;
  'x-github-request-id'?: string;
  'x-github-media-type'?: string;
}

// Type for GitHub API response metadata
export interface GitHubResponseMeta {
  headers: GitHubHeaders;
  status: number;
  statusText: string;
  request?: {
    responseURL?: string;
  };
}

// Type for paginated GitHub API responses
export interface GitHubPaginatedResponse<T> {
  data: T;
  meta: GitHubResponseMeta;
  nextPage?: () => Promise<GitHubPaginatedResponse<T>>;
  hasNextPage: boolean;
}

// Rate limit information
export interface RateLimit {
  remaining: number;
  limit: number;
  reset: number; // Unix timestamp in seconds
  used?: number;
  resource?: string;
}

// Type for GitHub API rate limit response
export interface GitHubRateLimitResponse {
  resources: {
    core: RateLimit;
    search: RateLimit;
    graphql: RateLimit;
  };
  rate: RateLimit;
}

// Type for GitHub API error response
export interface GitHubApiErrorResponse {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}

// Type for repository search results
export interface RepositorySearchResult {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

// Type for repository search parameters
export interface RepositorySearchParams {
  q: string;
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

// Type for repository list parameters
export interface RepositoryListParams {
  username: string;
  type?: 'all' | 'owner' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
