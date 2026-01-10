import React, { Component, ComponentType, ReactNode, ReactElement } from 'react';
import * as Sentry from '@sentry/react';

type FallbackProps = {
  error: Error;
  componentStack: string | null;
  resetError: () => void;
};

type FallbackRender = (props: FallbackProps) => ReactElement;

export interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement | FallbackRender;
  onError?: (error: Error, componentStack: string) => void;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
}

/**
 * A reusable error boundary component that can be used to catch and handle errors in React components.
 * It integrates with Sentry for error tracking in production.
 */
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { 
      hasError: true,
      error,
      componentStack: error.stack || null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentStack = errorInfo.componentStack || null;
    
    // Update state with the component stack for better error reporting
    this.setState({ 
      hasError: true,
      error,
      componentStack 
    });
    
    // Call the onError handler if provided
    if (this.props.onError) {
      this.props.onError(error, componentStack || '');
    }
    
    // Always log to Sentry, but in tests we'll mock the implementation
    Sentry.withScope(scope => {
      if (componentStack) {
        scope.setExtras({ componentStack });
      }
      Sentry.captureException(error);
    });
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      componentStack: null 
    });
  };

  render() {
    const { hasError, error, componentStack } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // In test environment, log the error for debugging
      if (process.env.NODE_ENV === 'test') {
        console.error('Error in component:', error);
      }
      // Default fallback UI
      const defaultFallback = (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
          <p className="mb-2">{error.toString()}</p>
          {process.env.NODE_ENV === 'development' && componentStack && (
            <pre className="text-xs bg-red-50 p-2 rounded overflow-auto">
              {componentStack}
            </pre>
          )}
          <button
            onClick={this.resetError}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      );

      // If a fallback is provided, use it
      if (fallback) {
        if (typeof fallback === 'function') {
          return fallback({ 
            error, 
            componentStack, 
            resetError: this.resetError 
          });
        }
        return fallback;
      }
      
      // Use default fallback if none provided
      return defaultFallback;
    }

    return children;
  }
}

/**
 * A higher-order component that wraps a component with the AppErrorBoundary
 * @param Component The component to wrap with the error boundary
 * @param options Options for the error boundary
 * @returns A new component wrapped with the error boundary
 */
export const withErrorBoundary = <P extends object>(
  Component: ComponentType<P>,
  options?: Omit<AppErrorBoundaryProps, 'children'>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <AppErrorBoundary {...options}>
      <Component {...props} />
    </AppErrorBoundary>
  );

  // Set a display name for the wrapped component for better debugging
  const componentName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;

  return WrappedComponent;
};

export default AppErrorBoundary;
