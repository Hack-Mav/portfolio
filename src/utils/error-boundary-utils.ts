import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary, { withErrorBoundary as withBoundary } from '../components/ErrorBoundary';

type ErrorFallback = React.ReactNode | ((error: Error, resetError: () => void) => React.ReactNode);

interface ErrorBoundaryConfig {
  /**
   * Custom fallback component or element
   */
  fallback?: ErrorFallback;
  /**
   * Called when an error is caught by the boundary
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

/**
 * @deprecated Use the withErrorBoundary from '../components/ErrorBoundary' instead
 */
const withErrorBoundary = <P extends object>(
  config: ErrorBoundaryConfig = {}
) => {
  return <T extends P>(WrappedComponent: ComponentType<T>) => {
    return withBoundary(WrappedComponent, config);
  };
};

/**
 * Creates a boundary component that wraps its children with an error boundary
 */
const createErrorBoundary = (config: ErrorBoundaryConfig = {}) => {
  const { fallback, onError } = config;
  
  const ErrorBoundaryWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return React.createElement(ErrorBoundary, {
      fallback,
      onError,
      children
    });
  };

  return ErrorBoundaryWrapper;
};

export type { ErrorFallback, ErrorBoundaryConfig };
export { withErrorBoundary, createErrorBoundary };