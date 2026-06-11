import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { NpmPackage, LibraryMetadata, ExtendedNpmPackage } from '@/types/npm';
import librariesData from '@/data/libraries.json';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';

export const useNpmPackages = () => {
  const [packages, setPackages] = useState<ExtendedNpmPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const packagePromises = librariesData.map(async (lib: LibraryMetadata) => {
        try {
          const response = await axios.get<NpmPackage>(`${NPM_REGISTRY_URL}/${lib.packageName}`);
          return {
            ...response.data,
            githubRepo: lib.githubRepo,
            category: lib.category,
            featured: lib.featured,
          } as ExtendedNpmPackage;
        } catch (err) {
          console.error(`Failed to fetch ${lib.packageName}:`, err);
          return null;
        }
      });

      const results = await Promise.all(packagePromises);
      const validPackages = results.filter((pkg): pkg is ExtendedNpmPackage => pkg !== null);
      
      setPackages(validPackages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch packages');
      setPackages([]);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    loading,
    error,
    isInitialLoading,
    refetch: fetchPackages,
  };
};
