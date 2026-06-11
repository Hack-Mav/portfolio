import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { Blog, BlogApiResponse, BlogFilters } from '@/types/blog';

const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || 'https://api.example.com/blogs';

export const useBlogs = (filters?: BlogFilters) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.tag) params.append('tag', filters.tag);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);

      const response = await axios.get<BlogApiResponse>(`${BLOG_API_URL}?${params.toString()}`);
      setBlogs(response.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
      setIsInitialLoading(false);
    }
  }, [filters]);

  const fetchBlogById = useCallback(async (id: string): Promise<Blog | null> => {
    try {
      const response = await axios.get<Blog>(`${BLOG_API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blog');
      return null;
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    isInitialLoading,
    refetch: fetchBlogs,
    fetchBlogById,
  };
};
