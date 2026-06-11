import { motion } from 'framer-motion';
import { FaGithub, FaNpm, FaDownload, FaStar } from 'react-icons/fa';
import type { ExtendedNpmPackage } from '@/types/npm';

interface LibraryCardProps {
  pkg: ExtendedNpmPackage;
  index: number;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ pkg, index }) => {
  const npmUrl = `https://www.npmjs.com/package/${pkg.name}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="surface-panel p-6 h-full hover:shadow-lg transition-shadow duration-300">
        {pkg.featured && (
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 mb-3">
            Featured
          </span>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex-1">
            {pkg.name}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
            v{pkg.version}
          </span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
          {pkg.description || 'No description available'}
        </p>

        {pkg.category && (
          <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 mb-4">
            {pkg.category}
          </span>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {pkg.keywords && pkg.keywords.slice(0, 3).map((keyword) => (
            <span
              key={keyword}
              className="text-xs px-2 py-1 rounded bg-primary-500/5 text-primary-600 dark:text-primary-400"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          {pkg.downloads && (
            <div className="flex items-center">
              <FaDownload className="mr-1" />
              <span>{(pkg.downloads.lastWeek / 1000).toFixed(1)}k/week</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href={npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FaNpm className="mr-2" />
            npm
          </a>
          {pkg.githubRepo && (
            <a
              href={pkg.githubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <FaGithub className="mr-2" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LibraryCard;
