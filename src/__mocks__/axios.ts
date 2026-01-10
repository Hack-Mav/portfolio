// src/__mocks__/axios.ts
import { vi, type MockInstance } from 'vitest';
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosInterceptorManager } from 'axios';

type MockedFunction<T extends (...args: any[]) => any> = MockInstance<ReturnType<T>> & {
  mockResolvedValue: <R>(value: R) => MockedFunction<T>;
  mockResolvedValueOnce: <R>(value: R) => MockedFunction<T>;
  mockRejectedValue: (value: any) => MockedFunction<T>;
  mockRejectedValueOnce: (value: any) => MockedFunction<T>;
  mockImplementation: (fn: T) => MockedFunction<T>;
  mockImplementationOnce: (fn: T) => MockedFunction<T>;
  mockClear: () => void;
  (...args: Parameters<T>): ReturnType<T>;
};

interface MockedAxios extends Omit<AxiosInstance, 'get' | 'interceptors'> {
  get: MockedFunction<AxiosInstance['get']>;
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig> & {
      handlers: any[];
    };
    response: AxiosInterceptorManager<AxiosResponse> & {
      handlers: any[];
    };
  };
}

const createMockedFunction = <T extends (...args: any[]) => any>(): MockedFunction<T> => {
  const mock = vi.fn() as any;
  
  mock.mockImplementation = (fn: T) => {
    mock.mockImplementation(fn);
    return mock;
  };
  
  mock.mockImplementationOnce = (fn: T) => {
    mock.mockImplementationOnce(fn);
    return mock;
  };
  
  mock.mockResolvedValue = (value: any) => {
    mock.mockImplementation(() => Promise.resolve(value));
    return mock;
  };
  
  mock.mockResolvedValueOnce = (value: any) => {
    mock.mockImplementationOnce(() => Promise.resolve(value));
    return mock;
  };
  
  mock.mockRejectedValue = (value: any) => {
    mock.mockImplementation(() => Promise.reject(value));
    return mock;
  };
  
  mock.mockRejectedValueOnce = (value: any) => {
    mock.mockImplementationOnce(() => Promise.reject(value));
    return mock;
  };
  
  mock.mockClear = () => {
    mock.mockClear();
    return mock;
  };
  
  return mock as MockedFunction<T>;
};
const mockAxiosInstance: MockedAxios = {
  get: createMockedFunction<AxiosInstance['get']>(),
  interceptors: {
    request: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
      handlers: []
    },
    response: {
      use: vi.fn(),
      eject: vi.fn(),
      clear: vi.fn(),
      handlers: []
    }
  }
} as unknown as MockedAxios;

// Mock the create function to return our mock instance
const mockAxios = {
  create: vi.fn(() => mockAxiosInstance)
};

export default mockAxios;
export { mockAxiosInstance };