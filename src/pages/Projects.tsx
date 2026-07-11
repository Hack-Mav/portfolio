import React, { useState, useMemo, useCallback } from 'react'
import {
  FaGithub,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa'
import { HiArrowSmRight } from 'react-icons/hi'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/organisms/ProjectCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import { useGitHubRepositories } from '@/hooks/useGitHub'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { PageSection } from '@components/templates/PageSection'
import AppErrorBoundary from '@/components/AppErrorBoundary'

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [languageFilter, setLanguageFilter] = useState('')

  const caseStudies = [
    {
      title: 'URL Shortener Application',
      timeframe: 'Jul 2022 – Aug 2022',
      description:
        'Go (Golang) platform backed by Gin, Google Cloud Datastore, and Redis for high-performance redirection and analytics-ready telemetry.',
      impact:
        'Enabled frictionless sharing workflows with sub-20ms redirects at scale, deployed on GCP App Engine for zero-downtime rollouts.',
      links: [
        {
          label: 'GitHub Repo',
          href: 'https://github.com/parthivrawat/url-shortener',
        },
      ],
    },
    {
      title: 'Heart Disease Monitoring System',
      timeframe: 'Jan 2021 – Apr 2021',
      description:
        'Analytics pipeline applying Logistic Regression, Naive Bayes, SVM, K-NN, Decision Tree, Random Forest, and Neural Networks over medical datasets.',
      impact:
        'Delivered high-confidence predictions to surface probable heart disease correlations, guiding early interventions and research insights.',
      links: [
        {
          label: 'Project GitHub',
          href: 'https://github.com/parthivrawat/heart-disease-monitoring',
        },
      ],
    },
  ]

  const {
    repositories,
    loading: _loading,
    error,
    isInitialLoading,
    isRefreshing,
    refetch,
    retryCount,
    resetError,
  } = useGitHubRepositories()

  // Extract unique languages from repositories
  const languages = useMemo(() => {
    if (!repositories) return []
    const langSet = new Set<string>()
    repositories.forEach(repo => {
      if (repo.language) {
        langSet.add(repo.language)
      }
    })
    return Array.from(langSet).sort()
  }, [repositories])

  // Filter repositories based on search term and language
  const { invoke: applyDebouncedSearch } = useDebouncedCallback(
    (term: string) => {
      setDebouncedSearchTerm(term)
    },
    300
  )

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term)
      applyDebouncedSearch(term)
    },
    [applyDebouncedSearch]
  )

  const filteredRepos = useMemo(() => {
    if (!repositories) return []

    return repositories.filter(repo => {
      const matchesSearch =
        repo.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (repo.description &&
          repo.description
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()))

      const matchesLanguage =
        !languageFilter || repo.language === languageFilter

      return matchesSearch && matchesLanguage
    })
  }, [repositories, debouncedSearchTerm, languageFilter])

  const handleRetry = useCallback(() => {
    resetError()
    refetch()
  }, [refetch, resetError])

  const isRateLimitError = Boolean(
    (error as { isRateLimitError?: boolean } | null)?.isRateLimitError
  )

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 p-6 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to load projects
            </h3>
            <p className="text-sm text-red-700 mb-4">
              {error.message ||
                'An unexpected error occurred while fetching projects.'}
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
    )
  }

  return (
    <PageSection
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8"
      backgroundClassName="bg-[radial-gradient(120%_140%_at_50%_-10%,#e8efff_0%,#f9fbff_55%,#eef3ff_100%)] dark:bg-[radial-gradient(150%_160%_at_50%_-10%,#0a1325_0%,#0f172a_40%,#020817_100%)]"
      header={{
        title: (
          <>
            <span className="eyebrow mb-4 mx-auto">Showcase</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
              My Projects
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              Explore a selection of experiments, tools, and production-ready
              builds spanning frontend polish, backend reliability, and
              developer experience.
            </p>
          </>
        ),
        className: 'surface-panel p-10 text-center mb-12',
      }}
    >
      {/* Case studies directly from resume */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="surface-panel p-10 mb-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <span className="eyebrow mb-4 block">Case Studies</span>
            <h2 className="text-3xl font-heading text-slate-900 dark:text-white">
              Spotlight Projects from the Resume
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
            Gradient of self-initiated and academic work where I fused
            cloud-native architecture, performance engineering, and modern web
            technologies to deliver impactful solutions.
          </p>
        </div>
      </motion.div>

      {/* Case Studies Section */}
      <div className="mt-16 relative">
        <h2 className="font-heading text-3xl text-slate-900 dark:text-white mb-8 text-center">
          Case Studies
        </h2>
        <div className="grid gap-8 md:grid-cols-2 relative z-10" role="list">
          {caseStudies.map((study, index) => (
            <div
              key={study.title}
              className="surface-panel border border-white/40 dark:border-slate-800 p-6 space-y-4"
              role="listitem"
              aria-setsize={caseStudies.length}
              aria-posinset={index + 1}
            >
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {study.title}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-300">
                  {study.timeframe}
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                {study.description}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {study.impact}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {study.links.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
                  >
                    {link.label}
                    <HiArrowSmRight className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

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
              onChange={e => handleSearchChange(e.target.value)}
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
                onChange={e => setLanguageFilter(e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {(searchTerm || languageFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setDebouncedSearchTerm('')
                  setLanguageFilter('')
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
          role="list"
        >
          {filteredRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              role="listitem"
              aria-setsize={filteredRepos.length}
              aria-posinset={index + 1}
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
    </PageSection>
  )
}

// Wrap the component with AppErrorBoundary
const ProjectsWithErrorBoundary = () => {
  const errorFallback = ({
    error,
    resetError,
  }: {
    error: Error
    componentStack: string | null
    resetError: () => void
  }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We're sorry, but an error occurred while loading the projects.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4">
            <p className="text-sm text-red-700 dark:text-red-400 font-mono">
              {error.message}
            </p>
          </div>
        )}
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <AppErrorBoundary
      fallback={errorFallback}
      onError={(error, errorInfo) => {
        console.error('Error in Projects component:', error, errorInfo)
      }}
    >
      <Projects />
    </AppErrorBoundary>
  )
}

ProjectsWithErrorBoundary.displayName = 'ProjectsWithErrorBoundary'

export default ProjectsWithErrorBoundary
