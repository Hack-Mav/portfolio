import { useState, useCallback, useRef, useEffect } from 'react';
import type { CADModel, CADViewerState, CADFormat } from '@/types/cad';

// Note: xeokit needs to be installed via npm
// npm install xeokit @xeokit/xeokit-sdk
// This hook provides the structure for CAD viewer integration

export const useCADViewer = () => {
  const [state, setState] = useState<CADViewerState>({
    model: null,
    isLoading: false,
    error: null,
    viewerInitialized: false,
  });

  const viewerRef = useRef<any>(null);

  const loadModel = useCallback(async (model: CADModel) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // xeokit integration would go here
      // Example:
      // const viewer = new Viewer({
      //   canvasId: 'xeokit-canvas',
      //   transparent: true,
      // });
      // viewer.scene.loadModel(model.url, model.format.toLowerCase());
      
      setState({
        model,
        isLoading: false,
        error: null,
        viewerInitialized: true,
      });
    } catch (err) {
      setState({
        model: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load CAD model',
        viewerInitialized: false,
      });
    }
  }, []);

  const unloadModel = useCallback(() => {
    if (viewerRef.current) {
      // viewerRef.current.destroy();
      viewerRef.current = null;
    }
    setState({
      model: null,
      isLoading: false,
      error: null,
      viewerInitialized: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      unloadModel();
    };
  }, [unloadModel]);

  return {
    ...state,
    loadModel,
    unloadModel,
    viewerRef,
  };
};

export const getSupportedFormats = (): CADFormat[] => {
  return ['STEP', 'STL', 'OBJ', 'GLTF', 'GLB'];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
