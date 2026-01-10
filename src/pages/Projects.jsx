import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { HiSearch, HiFilter } from 'react-icons/hi';
import ProjectCard from '@components/ui/ProjectCard';
import LoadingSpinner from '@components/ui/LoadingSpinner';
import { useGitHubRepositories } from '@/hooks/useGitHub';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  const { repositories, loading, error, refetch } = useGitHubRepositories();

  // Filter projects based on search term and selected language
  const filteredProjects = useMemo(() => {
    if (!repositories) return [];
    
    let filtered = [...repositories];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.name.toLowerCase().includes(term) ||
          (project.description && project.description.toLowerCase().includes(term))
      );
    }
    
    if (selectedLanguage) {
      filtered = filtered.filter(project => project.language === selectedLanguage);
    }
    
    return filtered;
  }, [repositories, searchTerm, selectedLanguage]);
  
  // Get unique languages for filter
  const languages = useMemo(() => {
    if (!repositories) return [];
    return [...new Set(repositories.map(p => p.language).filter(Boolean))].sort();
  }, [repositories]);
  
  const handleRetry = () => {
    refetch();
  };

  return (
    <>
      <Helmet>
        <title>Projects | Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of web development projects and open source contributions"
        />
      </Helmet>

      <div className="min-h-screen section-padding">
        <div className="container-max">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              My Projects
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A collection of projects showcasing my skills in web development,
              from full-stack applications to open source contributions.
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col sm:flex-row gap-4"
          >
            {/* Search */}
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">All Languages</option>
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Results Count */}
          {!loading && !error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-300 mb-6"
            >
              Showing {filteredProjects.length} of {repositories.length} projects
            </motion.p>
          )}

          {/* Loading State */}
          {loading && !repositories?.length ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Try Again
              </button>
            </div>
          ) : (
            <></>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    No projects found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedLanguage('')
                    }}
                    className="btn-secondary mt-4"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
