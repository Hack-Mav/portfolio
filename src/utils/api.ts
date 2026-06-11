/**
 * @file API utility module for handling HTTP requests with CSRF protection
 * @module utils/api
 * @description This module provides a pre-configured axios instance with CSRF protection
 * for all state-changing HTTP methods (POST, PUT, PATCH, DELETE).
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * @constant {AxiosInstance}
 * @description Pre-configured axios instance with base URL and credentials
 */
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

interface _CSRFConfig {
  csrfToken?: string;
  skipCSRF?: boolean;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  csrfToken?: string;
  skipCSRF?: boolean;
}

/**
 * Fetches a new CSRF token from the server
 * @async
 * @returns {Promise<string>} The CSRF token
 * @throws {Error} If the token cannot be fetched or is invalid
 */
async function fetchCSRFToken(): Promise<string> {
  const response = await fetch('/api/csrf-token');
  const data = await response.json();
  
  if (!data?.token || typeof data.token !== 'string') {
    throw new Error('Invalid CSRF token format received');
  }
  
  try {
    localStorage.setItem('csrf-token', data.token);
  } catch (storageError) {
    console.warn('Failed to store CSRF token in localStorage:', storageError);
  }
  
  return data.token;
}

/**
 * Request interceptor to automatically add CSRF token to state-changing requests
 */
api.interceptors.request.use(
  async (config: ExtendedAxiosRequestConfig) => {
    // Skip CSRF for GET/HEAD/OPTIONS requests or if explicitly disabled
    const method = config.method?.toLowerCase() || '';
    if (!['post', 'put', 'patch', 'delete'].includes(method) || config.skipCSRF) {
      return config;
    }

    try {
      // Use provided token or fetch a new one if not available
      let csrfToken = (config as ExtendedAxiosRequestConfig).csrfToken || localStorage.getItem('csrf-token') || '';
      
      if (!csrfToken) {
        csrfToken = await fetchCSRFToken();
      }
      
      // Set the CSRF token in the request headers
      if (csrfToken) {
        config.headers = config.headers || {};
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (error) {
      console.error('Failed to process CSRF token:', error);
      // Continue with the request - it will fail on the server if CSRF is required
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api;

// Export types for better type safety
export type { ExtendedAxiosRequestConfig as ApiRequestConfig };