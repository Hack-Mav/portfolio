import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaUpload, FaCube, FaLink } from 'react-icons/fa';
import CADViewer from '@/components/organisms/CADViewer';
import type { CADModel, CADFormat } from '@/types/cad';

const CAD: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<CADModel | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  const handleUrlLoad = () => {
    if (!urlInput) return;

    const format = urlInput.split('.').pop()?.toUpperCase() as CADFormat;
    const validFormats: CADFormat[] = ['STEP', 'STL', 'OBJ', 'GLTF', 'GLB'];

    if (!format || !validFormats.includes(format)) {
      alert('Invalid file format. Supported formats: STEP, STL, OBJ, GLTF, GLB');
      return;
    }

    const model: CADModel = {
      id: Date.now().toString(),
      name: urlInput.split('/').pop() || 'Model',
      format,
      url: urlInput,
      size: 0,
      uploadedAt: new Date().toISOString(),
    };

    setSelectedModel(model);
    setUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toUpperCase() as CADFormat;
    const validFormats: CADFormat[] = ['STEP', 'STL', 'OBJ', 'GLTF', 'GLB'];

    if (!extension || !validFormats.includes(extension)) {
      alert('Invalid file format. Supported formats: STEP, STL, OBJ, GLTF, GLB');
      return;
    }

    const model: CADModel = {
      id: Date.now().toString(),
      name: file.name,
      format: extension,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };

    setSelectedModel(model);
  };

  return (
    <>
      <Helmet>
        <title>CAD Models | Portfolio</title>
        <meta name="description" content="View CAD 3D models with interactive viewer" />
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
            <span className="eyebrow mb-4 mx-auto">3D Design</span>
            <h1 className="font-heading text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
              CAD Models
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              Interactive 3D viewer for CAD models. Supports STEP, STL, OBJ, GLTF, and GLB formats.
            </p>
          </motion.div>

          {!selectedModel ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="surface-panel p-8"
            >
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setUploadMode('url')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    uploadMode === 'url'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <FaLink className="inline mr-2" />
                  Load from URL
                </button>
                <button
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    uploadMode === 'file'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <FaUpload className="inline mr-2" />
                  Upload File
                </button>
              </div>

              {uploadMode === 'url' ? (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Enter CAD model URL (e.g., https://example.com/model.gltf)"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleUrlLoad}
                    disabled={!urlInput}
                    className="w-full px-4 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Load Model
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <FaCube className="text-4xl text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Drop your CAD file here or click to browse
                    </p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".step,.stp,.stl,.obj,.gltf,.glb"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 cursor-pointer transition-colors"
                    >
                      Select File
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Supported: STEP, STL, OBJ, GLTF, GLB
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Supported Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {['STEP', 'STL', 'OBJ', 'GLTF', 'GLB'].map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-300 text-sm"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CADViewer model={selectedModel} onClose={() => setSelectedModel(null)} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default CAD;
