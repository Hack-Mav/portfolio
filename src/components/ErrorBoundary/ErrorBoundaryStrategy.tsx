/**
 * Error Boundary Strategy
 * 
 * This file consolidates the error boundary approach by providing a single, robust
 * error boundary implementation that can be used throughout the application.
 */

import React, { Component, ErrorInfo, ReactNode, ComponentType } from 'react';
import * as Sentry from '@sentry/react';

// Types for our error boundary system
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: Record<string, unknown>;
  logToConsole?: boolean;
  showDetails?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Specialized error boundary types for different use cases
export interface PageErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'showDetails'> {
  title?: string;
  subtitle?: string;
}

export interface ComponentErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback' | 'context' | 'children'> {
  componentName?: string;
  fallbackUI?: ReactNode;
  children?: ReactNode;
}

/**
 * Main Error Boundary Component
 * This is the primary error boundary that should be used throughout the app
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps = {
    logToConsole: true,
    showDetails: false,
  };

  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, context, logToConsole } = this.props;
    
    // Log error to console if enabled
    if (logToConsole) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Capture error with additional context
    Sentry.withScope(scope => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }
      scope.setExtra('componentStack', errorInfo.componentStack);
      Sentry.captureException(error);
    });

    // Call the onError handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Update state with error info for the fallback UI
    this.setState({ errorInfo });
  }

  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, showDetails } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, this.resetError)
          : fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              We're sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            
            {showDetails && process.env.NODE_ENV === 'development' && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-600 mb-2">
                  Error Details
                </summary>
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <p className="text-red-700 font-mono mb-2">{error.message}</p>
                  {errorInfo?.componentStack && (
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            
            <button
              onClick={this.resetError}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

/**
 * Page Error Boundary - For entire page failures
 */
export const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ 
  children, 
  title = "Page Error",
  subtitle = "This page encountered an error and couldn't load.",
  ...props 
}) => (
  <ErrorBoundary
    {...props}
    fallback={(error, resetError) => (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-600 mb-4">{subtitle}</p>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 mb-2">
                Technical Details
              </summary>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <p className="text-red-700 font-mono mb-2">{error.message}</p>
              </div>
            </details>
          )}
          
          <button
            onClick={resetError}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Component Error Boundary - For individual component failures
 */
export const ComponentErrorBoundary: React.FC<ComponentErrorBoundaryProps> = ({ 
  children, 
  componentName = "Component",
  fallbackUI,
  ...props 
}) => (
  <ErrorBoundary
    {...props}
    context={{ component: componentName }}
    fallback={fallbackUI || ((error, resetError) => (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {componentName} Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={resetError}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Higher-order component that wraps a component with the ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: ComponentErrorBoundaryProps = {}
): ComponentType<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ComponentErrorBoundary componentName={displayName} {...options}>
      <WrappedComponent {...(props as P)} />
    </ComponentErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
}

/**
 * Default error fallback component that can be used as a fallback prop
 */
export const ErrorFallback: React.FC<{ 
  error: Error; 
  resetError: () => void;
  className?: string;
}> = ({ error, resetError, className = '' }) => (
  <div className={`error-fallback p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong.</h3>
    <p className="text-red-700 mb-3">{error.message}</p>
    <button 
      onClick={resetError}
      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
    >
      Try again
    </button>
  </div>
);

export default ErrorBoundary;
