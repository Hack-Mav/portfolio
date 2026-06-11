import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Repository, GitHubError as _GitHubError, GitHubRateLimit as _GitHubRateLimit } from '@/types/github';
import type { RootState } from '../store';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_USERNAME = 'Hack-Mav';

// Extend the BaseQueryMeta type to include headers
interface CustomMeta {
  response?: {
    headers: {
      get: (header: string) => string | null;
    };
  };
  request?: unknown;
  meta?: unknown;
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: GITHUB_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/vnd.github.v3+json');
      return headers;
    },
  }) as any, // Temporary type assertion to handle custom meta
  tagTypes: ['Repositories', 'Repository'],
  endpoints: (builder) => ({
    getRepositories: builder.query<Repository[], void>({
      query: () => `users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      providesTags: ['Repositories'],
      transformResponse: (response: Repository[]) => response,
      onQueryStarted: async (_, { dispatch: _dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Update rate limit information if available
          if (data && 'meta' in data) {
            const meta = data.meta as CustomMeta;
            const headers = meta?.response?.headers;
            const _rateLimit = {
              remaining: parseInt(headers?.get('x-ratelimit-remaining') || '60', 10),
              limit: parseInt(headers?.get('x-ratelimit-limit') || '60', 10),
              reset: parseInt(headers?.get('x-ratelimit-reset') || '0', 10),
            };
            // You can dispatch an action here to update rate limit in your store if needed
          }
        } catch (error) {
          console.error('Error fetching repositories:', error);
        }
      },
    }),
    getRepository: builder.query<Repository, string>({
      query: (repoName) => `repos/${GITHUB_USERNAME}/${repoName}`,
      providesTags: (result, error, repoName) => [{ type: 'Repository', id: repoName }],
      transformResponse: (response: Repository) => response,
    }),
  }),
});

export const { 
  useGetRepositoriesQuery, 
  useGetRepositoryQuery,
  useLazyGetRepositoriesQuery,
  useLazyGetRepositoryQuery 
} = githubApi;

// Export selectors
export const selectRepositories = (state: RootState) => 
  githubApi.endpoints.getRepositories.select()(state)?.data || [];

export const selectRepository = (repoName: string) => (state: RootState) => 
  githubApi.endpoints.getRepository.select(repoName)(state)?.data || null;

export const selectRepositoriesByLanguage = (language: string) => (state: RootState) => {
  const repos = selectRepositories(state);
  return repos.filter(repo => repo.language === language);
};

export const selectStarredRepositories = (state: RootState) => {
  const repos = selectRepositories(state);
  return repos.filter(repo => repo.stargazers_count > 0);
};

// Export hooks for usage in functional components
export const { endpoints } = githubApi;
