import { motion, Variants, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiExternalLink, HiCode, HiStar, HiEye } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

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
  homepage?: string | null;
}

/**
 * Props for the ProjectCard component
 */
interface ProjectCardProps {
  project: GitHubRepository;
  index?: number;
}

// Animation variants for the card
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: custom * 0.05,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  hover: {
    scale: 1.03,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Animation for the content inside the card
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Language colors for the language indicator
const languageColors: Record<string, string> = {
  'TypeScript': 'bg-blue-500',
  'JavaScript': 'bg-yellow-400',
  'HTML': 'bg-orange-500',
  'CSS': 'bg-blue-600',
  'Python': 'bg-blue-700',
  'Java': 'bg-red-600',
  'C++': 'bg-pink-600',
  'C#': 'bg-purple-600',
  'Ruby': 'bg-red-500',
  'PHP': 'bg-purple-400',
  'Go': 'bg-cyan-500',
  'Rust': 'bg-orange-600',
  'Swift': 'bg-orange-400',
  'Kotlin': 'bg-purple-500',
  'Dart': 'bg-blue-400',
};

/**
 * A card component that displays information about a GitHub repository
 */
const ProjectCard = ({ project, index = 0 }: ProjectCardProps): JSX.Element => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const lastUpdated = formatDistanceToNow(new Date(project.updated_at), { addSuffix: true });
  
  const { 
    name = 'Unnamed Project',
    description = 'No description available',
    html_url,
    homepage,
    stargazers_count = 0,
    forks_count = 0,
    watchers_count = 0,
    language,
  } = project;

  return (
    <motion.article
      ref={ref}
      className="group relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/60 dark:border-slate-800/70 shadow-lg"
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={index}
      whileHover="hover"
      whileTap="tap"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <div className="relative p-6">
        <motion.div 
          className="space-y-4"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-start">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-300 bg-clip-text text-transparent">
              {name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <div className="flex space-x-2">
              {homepage && (
                <motion.a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="View live demo"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiExternalLink className="h-4 w-4" />
                </motion.a>
              )}
              <motion.a
                href={html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="View source code"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiCode className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300">
            {description}
          </motion.p>

          <motion.div variants={itemVariants} className="pt-2 mt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              {language && (
                <motion.div 
                  className="flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800/50"
                  whileHover={{ scale: 1.03 }}
                >
                  <span 
                    className={cn(
                      'w-2.5 h-2.5 rounded-full mr-1.5',
                      languageColors[language as keyof typeof languageColors] || 'bg-gray-400'
                    )}
                  ></span>
                  {language}
                </motion.div>
              )}
              <motion.div 
                className="flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800/50"
                whileHover={{ scale: 1.03 }}
              >
                <HiStar className="h-3.5 w-3.5 mr-1 text-amber-400" />
                <span>{stargazers_count.toLocaleString()}</span>
              </motion.div>
              <motion.div 
                className="flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800/50"
                whileHover={{ scale: 1.03 }}
              >
                <HiEye className="h-3.5 w-3.5 mr-1 text-purple-400" />
                <span>{watchers_count.toLocaleString()}</span>
              </motion.div>
              <motion.div 
                className="flex items-center px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800/50"
                whileHover={{ scale: 1.03 }}
              >
                <HiCode className="h-3.5 w-3.5 mr-1 text-blue-400 transform rotate-90" />
                <span>{forks_count.toLocaleString()}</span>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-3 text-xs text-gray-400 dark:text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Updated {lastUpdated}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;