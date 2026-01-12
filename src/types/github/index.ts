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
export interface GitHubError {
  message: string;
  status?: number;
  isRateLimitError?: boolean;
  isNetworkError?: boolean;
  retryAfter?: number;
  resetTime?: number;
  code?: string;
}

// Rate limit information
export interface RateLimit {
  remaining: number;
  limit: number;
  reset: number;
  used?: number;
  resource?: string;
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
