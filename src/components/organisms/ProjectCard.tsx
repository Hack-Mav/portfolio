import { motion, Variants } from 'framer-motion';
import { HiExternalLink, HiCode } from 'react-icons/hi';

/**
 * Represents a GitHub repository with its relevant properties
 */
export interface GitHubRepository {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
}

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  /** GitHub repository data */
  project: GitHubRepository;
  /** Optional index used for staggered animations */
  index?: number;
}

// Animation variants for the card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
    },
  }),
};

/**
 * A card component that displays information about a GitHub repository
 */
const ProjectCard = ({ project, index = 0 }: ProjectCardProps): JSX.Element => {
  // Destructure with default values for optional fields
  const { 
    name = 'Unnamed Project',
    description = 'No description available',
    html_url,
    stargazers_count = 0, 
    forks_count = 0, 
    watchers_count = 0, 
    language,
    updated_at = new Date().toISOString()
  } = project;

  // Validate required fields
  if (!html_url) {
    throw new Error('ProjectCard: html_url is required');
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string provided to formatDate');
      return 'Unknown date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      custom={index}
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="card group hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {name}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {language && language.trim() !== '' && (
            <div className="flex items-center mb-4">
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                title={`Written in ${language}`}
                aria-label={`Programming language: ${language}`}
              >
                <HiCode className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{language}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {stargazers_count > 0 && (
              <span>⭐ {stargazers_count}</span>
            )}
            {forks_count > 0 && <span>🍴 {forks_count}</span>}
          </div>

          <a
            href={html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            aria-label={`View ${name} on GitHub`}
          >
            View Code
            <HiExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Updated on {formatDate(updated_at)}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;