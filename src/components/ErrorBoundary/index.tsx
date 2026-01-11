import React, { Component, ErrorInfo, ReactNode, ComponentType, ReactElement } from 'react';
import { captureException } from '../../utils/error-handler';

type ErrorBoundaryProps = {
  children: ReactNode;
  /**
   * Fallback UI to render when an error occurs
   * Can be a React element or a function that receives error and resetError
   */
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  /**
   * Called when an error is caught by the boundary
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Context to help identify where the error occurred
   */
  context?: Record<string, unknown>;
  /**
   * Whether to log the error to the console
   * @default true
   */
  logToConsole?: boolean;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

/**
 * A robust error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI when an error occurs.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public static defaultProps = {
    logToConsole: true,
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
    captureException(error, {
      ...context,
      componentStack: errorInfo.componentStack,
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
    const { children, fallback } = this.props;

    if (hasError && error) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(error, this.resetError)
          : fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details</summary>
            <p>{error.toString()}</p>
            {errorInfo?.componentStack && (
              <pre>{errorInfo.componentStack}</pre>
            )}
          </details>
          <button onClick={this.resetError}>Try again</button>
        </div>
      );
    }

    return children;
  }
}

/**
 * Higher-order component that wraps a component with the ErrorBoundary
 */
function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...(props as P)} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
}

/**
 * Default error fallback component that can be used as a fallback prop
 */
const ErrorFallback: React.FC<{ 
  error: Error; 
  resetError: () => void;
  className?: string;
}> = ({ error, resetError, className = '' }) => (
  <div className={`error-fallback ${className}`}>
    <h3>Oops! Something went wrong.</h3>
    <p>{error.message}</p>
    <button onClick={resetError}>Try again</button>
  </div>
);

export default ErrorBoundary;
export { withErrorBoundary, ErrorFallback };

export type { ErrorBoundaryProps, ErrorBoundaryState };
