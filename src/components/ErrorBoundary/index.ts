/**
 * Consolidated Error Boundary Index
 * 
 * This file provides a single entry point for all error boundary functionality
 * and deprecates the old duplicate implementations.
 */

import ErrorBoundaryComponent from './ErrorBoundaryStrategy';

export { 
  PageErrorBoundary,
  ComponentErrorBoundary,
  withErrorBoundary,
  ErrorFallback,
  type ErrorBoundaryProps,
  type ErrorBoundaryState,
  type PageErrorBoundaryProps,
  type ComponentErrorBoundaryProps
} from './ErrorBoundaryStrategy';

// Export the default with a clear name
export { ErrorBoundaryComponent as ErrorBoundary };

// Re-export for backward compatibility but mark as deprecated
/**
 * @deprecated Use ErrorBoundaryStrategy instead
 */
export { default as AppErrorBoundary } from '../AppErrorBoundary';
