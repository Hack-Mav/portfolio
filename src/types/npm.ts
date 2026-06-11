export interface NpmPackage {
  name: string;
  version: string;
  description: string;
  author?: {
    name: string;
    email?: string;
  };
  keywords?: string[];
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
  license?: string;
  downloads?: {
    lastDay: number;
    lastWeek: number;
    lastMonth: number;
  };
  quality?: number;
  popularity?: number;
  maintenance?: number;
}

export interface LibraryMetadata {
  packageName: string;
  githubRepo?: string;
  category?: string;
  featured?: boolean;
}

export interface ExtendedNpmPackage extends NpmPackage {
  githubRepo?: string;
  category?: string;
  featured?: boolean;
}
