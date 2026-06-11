import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCopy, FaCheck, FaCode, FaPen } from 'react-icons/fa';
import type { PromptTemplate, PromptCategory } from '@/types/prompt';

interface PromptCardProps {
  prompt: PromptTemplate;
  index: number;
  onPreview: (prompt: PromptTemplate) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, index, onPreview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryIcon = prompt.category === 'coding' ? <FaCode /> : <FaPen />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="surface-panel p-6 h-full hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-primary-600 dark:text-primary-400">{categoryIcon}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 capitalize">
              {prompt.category}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy template"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-slate-500" />}
          </button>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          {prompt.title}
        </h3>

        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
          {prompt.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onPreview(prompt)}
          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 transition-colors"
        >
          Preview Template
        </button>
      </div>
    </motion.div>
  );
};

export default PromptCard;
