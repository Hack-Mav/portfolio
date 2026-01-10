import React, { useState, useMemo, useCallback } from 'react';
import { FaGithub, FaSearch, FaFilter, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ui/ProjectCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useGitHubRepositories } from '@/hooks/useGitHub';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ErrorFallback } from '@/components/ErrorBoundary';

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
  const filteredRepos = useMemo(() => {
    if (!repositories) return [];
    
    return repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLanguage = !languageFilter || repo.language === languageFilter;
      
      return matchesSearch && matchesLanguage;
    });
  }, [repositories, searchTerm, languageFilter]);

  const handleRetry = useCallback(() => {
    resetError();
    refetch();
  }, [refetch, resetError]);

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
            {error.isRateLimitError && (
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            My Projects
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            A collection of my open-source projects and contributions
          </p>
        </div>

        {/* Search and filter */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard {...repo} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <FaGithub className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || languageFilter 
                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                : 'No projects available at the moment.'}
            </p>
          </div>
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
