import { motion } from 'framer-motion'
import { HiExternalLink, HiCode } from 'react-icons/hi'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {project.name}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {project.description || 'No description available'}
          </p>

          {project.language && (
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200">
                <HiCode className="w-3 h-3 mr-1" />
                {project.language}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {project.stargazers_count > 0 && (
              <span>⭐ {project.stargazers_count}</span>
            )}
            {project.forks_count > 0 && <span>🍴 {project.forks_count}</span>}
          </div>

          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            aria-label={`View ${project.name} on GitHub`}
          >
            View Code
            <HiExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
