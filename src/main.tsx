import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { store } from './store';
import { registerSW } from './utils/serviceWorkerRegistration';
import { initSentry, ErrorBoundary } from './utils/error-handler';
import App from './App';
import './styles/globals.css';

// Initialize Sentry for error tracking
initSentry();

// Register service worker in production
if (process.env.NODE_ENV === 'production') {
  registerSW();
}

// Define the ErrorFallback component
const ErrorFallback = ({ 
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

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

const AppContainer = () => (
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<LoadingSpinner />}>
          <HelmetProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </HelmetProvider>
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);

// Initialize the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  
  // Use requestIdleCallback if available, otherwise render immediately
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => root.render(<AppContainer />),
      { timeout: 2000 } // Wait max 2 seconds before starting render
    );
  } else {
    root.render(<AppContainer />);
  }
}
