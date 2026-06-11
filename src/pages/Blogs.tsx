import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaFilter, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import BlogCard from '@/components/organisms/BlogCard';
import { useBlogs } from '@/hooks/useBlogs';
import type { Blog } from '@/types/blog';
import type { BlogFilters } from '@/types/blog';

const Blogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const { blogs, loading, error, isInitialLoading, refetch } = useBlogs();

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [blogs, searchTerm, selectedTag]);

  const handleRetry = () => {
    refetch();
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading blogs...</p>
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
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load blogs</h3>
            <p className="text-sm text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <FaSync className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blogs | Portfolio</title>
        <meta name="description" content="Read my latest blog articles and insights" />
      </Helmet>

      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_50%_-10%,#e8efff_0%,#f9fbff_55%,#eef3ff_100%)] dark:bg-[radial-gradient(150%_160%_at_50%_-10%,#0a1325_0%,#0f172a_40%,#020817_100%)]" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="surface-panel p-10 text-center mb-12"
          >
            <span className="eyebrow mb-4 mx-auto">Insights</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
              Blog Articles
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              Thoughts, tutorials, and insights on software development, cloud architecture, and emerging technologies.
            </p>
          </motion.div>

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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 md:justify-end">
                <div className="relative md:w-56 w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                    <FaFilter className="h-5 w-5" />
                  </div>
                  <select
                    className="block w-full rounded-xl border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md pl-11 pr-8 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {(searchTerm || selectedTag) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('');
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

          {filteredBlogs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredBlogs.map((blog: Blog, index: number) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel text-center p-10"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {searchTerm || selectedTag
                  ? 'Try adjusting your search or filter to find articles.'
                  : 'No articles available at the moment. Check back soon for new content.'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blogs;
