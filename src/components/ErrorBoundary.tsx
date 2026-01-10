import React, { Component, ErrorInfo, ReactNode } from 'react';
import { captureException } from '../utils/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    captureException(error, { 
      componentStack: errorInfo.componentStack,
      context: 'ErrorBoundary',
    });

    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null 
    });
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Render the fallback UI
      if (typeof fallback === 'function') {
        return fallback(error, this.resetError);
      }
      
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">{error.message}</p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<Props, 'children'>
) => {
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Set a display name for the wrapped component
  const componentName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;

  return WrappedComponent;
};

export const ErrorFallback = ({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-700 mb-4">
        We're sorry, but an unexpected error occurred. Our team has been notified.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-3 rounded mb-4">
          <p className="text-sm text-red-700 font-mono">{error.message}</p>
        </div>
      )}
      <button
        onClick={resetError}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);