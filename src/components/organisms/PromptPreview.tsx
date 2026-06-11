import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCopy, FaCheck, FaTimes, FaCode } from 'react-icons/fa';
import type { PromptTemplate } from '@/types/prompt';

interface PromptPreviewProps {
  prompt: PromptTemplate | null;
  onClose: () => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [variables, setVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prompt) {
      const initialVars: Record<string, string> = {};
      prompt.variables?.forEach((v) => {
        initialVars[v.name] = v.defaultValue || '';
      });
      setVariables(initialVars);
    }
  }, [prompt]);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTemplate = (template: string, vars: Record<string, string>) => {
    let rendered = template;
    Object.entries(vars).forEach(([key, value]) => {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value || `{{${key}}}`);
    });
    return rendered;
  };

  if (!prompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="surface-panel w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {prompt.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">{prompt.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FaTimes className="text-slate-500" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {prompt.variables && prompt.variables.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaCode />
                  Variables
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {prompt.variables.map((variable) => (
                    <div key={variable.name}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {variable.name}
                        {variable.description && (
                          <span className="text-slate-500 text-xs ml-2">({variable.description})</span>
                        )}
                      </label>
                      <input
                        type="text"
                        value={variables[variable.name] || ''}
                        onChange={(e) =>
                          setVariables({ ...variables, [variable.name]: e.target.value })
                        }
                        placeholder={variable.defaultValue}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Preview</h3>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 transition-colors"
                >
                  {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
                <pre className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200 font-mono">
                  {renderTemplate(prompt.template, variables)}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptPreview;
