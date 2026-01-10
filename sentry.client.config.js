import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Performance monitoring settings
const tracesSampleRate = process.env.NODE_ENV === 'production' ? 0.2 : 1.0; // Lower in production to reduce volume
const profilesSampleRate = process.env.NODE_ENV === 'production' ? 0.1 : 1.0; // Profile sampling

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Performance Monitoring
  integrations: [
    new BrowserTracing({
      // Set tracingOrigins to your API endpoints
      tracingOrigins: [
        'localhost',
        /^https?:\/\/api\.yourdomain\.com\/.*/, // Replace with your API domain
      ],
      // Optionally capture HTTP client requests
      shouldCreateSpanForRequest: (url) => {
        // Don't create spans for these specific endpoints
        const excludedEndpoints = ['/health', '/metrics'];
        return !excludedEndpoints.some(endpoint => url.includes(endpoint));
      },
    }),
    new Sentry.Replay(),
  ],

  // Performance Monitoring
  tracesSampleRate, // Sample rate for performance traces
  profilesSampleRate, // Sample rate for performance profiles
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample rate for session replay
  replaysOnErrorSampleRate: 1.0, // Sample rate for session replay when errors occur
  
  // Performance Monitoring - Advanced
  _experiments: {
    // Enable long task monitoring
    enableLongTask: true,
    // Enable CLS, LCP, and FID metrics
    enableInteractions: true,
  },
  
  // Performance Monitoring - Network Requests
  tracePropagationTargets: [
    'localhost',
    /^https?:\/\/api\.yourdomain\.com\/.*/, // Replace with your API domain
  ],
  
  // Performance Monitoring - Browser Features
  normalizeDepth: 5, // How deep to serialize the DOM nodes with error messages
  
  // Before send hook to filter or modify events
  beforeSend(event) {
    // Filter out health check requests
    if (event.request?.url?.includes('/health')) {
      return null;
    }
    return event;
  },
  
  // Ignore specific errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    // Random plugins/extensions
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'atomicFindClose',
    // Additional errors to ignore
    /^No error$/,
    /^Script error\.?$/,
    /^Script error: .*$/i,
  ],
  
  // Ignore specific URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
  ],
});

// Add performance monitoring for navigation
if (typeof window !== 'undefined') {
  // Track page loads
  const startTime = performance.now();
  
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    Sentry.metrics.distribution('page.load_time', loadTime);
    
    // Track Web Vitals
    const getWebVitals = async () => {
      const webVitals = await import('web-vitals');
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;
      
      getCLS(metric => Sentry.metrics.distribution('web_vitals.cls', metric.value));
      getFID(metric => Sentry.metrics.distribution('web_vitals.fid', metric.value));
      getFCP(metric => Sentry.metrics.distribution('web_vitals.fcp', metric.value));
      getLCP(metric => Sentry.metrics.distribution('web_vitals.lcp', metric.value));
      getTTFB(metric => Sentry.metrics.distribution('web_vitals.ttfb', metric.value));
    };
    
    getWebVitals().catch(console.error);
  });
}

export default Sentry;
