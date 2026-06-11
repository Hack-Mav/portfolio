import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaFilter, FaCode, FaPen } from 'react-icons/fa';
import PromptCard from '@/components/organisms/PromptCard';
import PromptPreview from '@/components/organisms/PromptPreview';
import promptsData from '@/data/prompts.json';
import type { PromptTemplate, PromptCategory } from '@/types/prompt';

const Prompts: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | ''>('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);

  const categories: PromptCategory[] = ['coding', 'writing'];

  const filteredPrompts = useMemo(() => {
    if (!selectedCategory) return promptsData as PromptTemplate[];
    return (promptsData as PromptTemplate[]).filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Prompt Templates | Portfolio</title>
        <meta name="description" content="Optimized prompt templates for coding and writing tasks" />
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
            <span className="eyebrow mb-4 mx-auto">AI Tools</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
              Prompt Templates
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              Optimized prompt templates for coding and writing tasks. Preview, customize, and copy to boost your productivity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface-panel p-6 mb-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <FaFilter className="text-primary-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by category:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === ''
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category === 'coding' ? <FaCode /> : <FaPen />}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {filteredPrompts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredPrompts.map((prompt, index) => (
                <PromptCard key={prompt.id} prompt={prompt} index={index} onPreview={setSelectedPrompt} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-panel text-center p-10"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No templates found
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Try selecting a different category or check back later for new templates.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <PromptPreview prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
    </>
  );
};

export default Prompts;
