import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        // Log error to Sentry
        if (process.env.NODE_ENV === 'production') {
          const eventId = Sentry.captureException(error, {
            level: 'error',
            tags: {
              type: 'api_error',
              status: error.response?.status || 'no_response',
              url: error.config?.url || 'unknown',
            },
            extra: {
              status: error.response?.status,
              statusText: error.response?.statusText,
              data: error.response?.data,
              url: error.config?.url,
              method: error.config?.method,
              params: error.config?.params,
            },
          });

          // Add event ID to error for reference
          return Promise.reject({
            ...error,
            sentryEventId: eventId,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // CRUD methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Add other methods as needed (PATCH, etc.)
}

// Create an instance with your API base URL
const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL || '/api');

export default apiClient;
