import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCube, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import type { CADModel } from '@/types/cad';

interface CADViewerProps {
  model: CADModel;
  onClose?: () => void;
}

const CADViewer: React.FC<CADViewerProps> = ({ model, onClose }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // xeokit viewer initialization would go here
    // This is a placeholder implementation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [model]);

  return (
    <div className="surface-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{model.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {model.format} · {model.size ? `${(model.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      <div
        ref={canvasRef}
        className="relative w-full h-96 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FaSpinner className="animate-spin text-4xl text-primary-500 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300">Loading 3D model...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FaCube className="text-6xl text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">
                3D Viewer Placeholder
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Install xeokit to enable 3D CAD viewing
              </p>
            </div>
          </div>
        )}
      </div>

      {model.description && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-300">{model.description}</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 transition-colors">
          Rotate
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 transition-colors">
          Zoom
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 transition-colors">
          Pan
        </button>
      </div>
    </div>
  );
};

export default CADViewer;
