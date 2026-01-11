import React, { useState, useMemo, useCallback } from 'react';
import { FaGithub, FaSearch, FaFilter, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/organisms/ProjectCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useGitHubRepositories } from '@/hooks/useGitHub';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ErrorFallback } from '@/components/ErrorBoundary';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  
  const {
    repositories,
    loading,
    error,
    isInitialLoading,
    isRefreshing,
    refetch,
    retryCount,
    resetError,
  } = useGitHubRepositories();

  // Extract unique languages from repositories
  const languages = useMemo(() => {
    if (!repositories) return [];
    const langSet = new Set<string>();
    repositories.forEach(repo => {
      if (repo.language) {
        langSet.add(repo.language);
      }
    });
    return Array.from(langSet).sort();
  }, [repositories]);

  // Filter repositories based on search term and language
  const { invoke: applyDebouncedSearch } = useDebouncedCallback((term: string) => {
    setDebouncedSearchTerm(term);
  }, 300);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    applyDebouncedSearch(term);
  }, [applyDebouncedSearch]);

  const filteredRepos = useMemo(() => {
    if (!repositories) return [];
    
    return repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      const matchesLanguage = !languageFilter || repo.language === languageFilter;
      
      return matchesSearch && matchesLanguage;
    });
  }, [repositories, debouncedSearchTerm, languageFilter]);

  const handleRetry = useCallback(() => {
    resetError();
    refetch();
  }, [refetch, resetError]);

  const isRateLimitError = Boolean((error as { isRateLimitError?: boolean } | null)?.isRateLimitError);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 p-6 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load projects</h3>
            <p className="text-sm text-red-700 mb-4">
              {error.message || 'An unexpected error occurred while fetching projects.'}
            </p>
            {isRateLimitError && (
              <p className="text-sm text-red-600 mb-4">
                GitHub API rate limit exceeded. Please try again later.
              </p>
            )}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaSync className="mr-2" />
                {retryCount > 0 ? 'Retry Again' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_50%_-10%,#e8efff_0%,#f9fbff_55%,#eef3ff_100%)] dark:bg-[radial-gradient(150%_160%_at_50%_-10%,#0a1325_0%,#0f172a_40%,#020817_100%)]" />
      <div className="absolute inset-x-0 top-10 -z-10 flex justify-center">
        <div className="h-64 w-[60vw] rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-900/20" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="surface-panel p-10 text-center mb-12"
        >
          <span className="eyebrow mb-4 mx-auto">Showcase</span>
          <h1 className="font-heading text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
            My Projects
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Explore a selection of experiments, tools, and production-ready builds spanning frontend polish, backend reliability, and developer experience.
          </p>
        </motion.div>

        {/* Search and filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="surface-panel p-6 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                <FaSearch className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full rounded-xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md pl-11 pr-4 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search projects, keywords, or descriptions..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <div className="relative md:w-56 w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                  <FaFilter className="h-5 w-5" />
                </div>
                <select
                  className="block w-full rounded-xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md pl-11 pr-8 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                >
                  <option value="">All Languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {(searchTerm || languageFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setDebouncedSearchTerm('');
                    setLanguageFilter('');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
                >
                  <FaSync className="h-4 w-4" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading state during refresh */}
        {isRefreshing && (
          <div className="flex justify-center py-4">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        )}

        {/* Projects grid */}
        {filteredRepos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <ProjectCard project={repo} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="surface-panel text-center p-10"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
              <FaGithub className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
              No projects found
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {searchTerm || languageFilter
                ? 'Try adjusting your keywords or language filters to uncover other repositories.'
                : 'No projects available at the moment. Check back soon for new releases.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Wrap the component with ErrorBoundary
export default () => {
  const errorFallback = (error: Error, resetError: () => void) => (
    <ErrorFallback error={error} resetError={resetError} />
  );

  return (
    <ErrorBoundary 
      fallback={errorFallback}
      onError={(error, errorInfo) => {
        console.error('Error in Projects component:', error, errorInfo);
      }}
    >
      <Projects />
    </ErrorBoundary>
  );
};
