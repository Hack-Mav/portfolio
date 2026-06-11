export type CADFormat = 'STEP' | 'STL' | 'OBJ' | 'GLTF' | 'GLB';

export interface CADModel {
  id: string;
  name: string;
  format: CADFormat;
  url: string;
  size: number;
  uploadedAt: string;
  description?: string;
  thumbnail?: string;
  metadata?: {
    vertices?: number;
    faces?: number;
    fileSize?: string;
  };
}

export interface CADViewerState {
  model: CADModel | null;
  isLoading: boolean;
  error: string | null;
  viewerInitialized: boolean;
}

export interface CADUploadResponse {
  success: boolean;
  modelId?: string;
  url?: string;
  error?: string;
}
