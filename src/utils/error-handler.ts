import * as Sentry from '@sentry/react'

type LogLevel = 'info' | 'warn' | 'error'

/**
 * Capture an exception and send it to Sentry
 * @param error The error to capture
 * @param context Additional context to include with the error
 */
export const captureException = (
  error: Error,
  context?: Record<string, unknown>
): void => {
  console.error('Error:', error, context)

  // Capture the error in Sentry
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope(scope => {
      if (context) {
        scope.setExtras(context)
      }
      Sentry.captureException(error)
    })
  }
}

/**
 * Capture a message and send it to Sentry
 * @param message The message to capture
 * @param level The severity level of the message
 */
export const captureMessage = (
  message: string,
  level: LogLevel = 'info'
): void => {
  // Map our log levels to Sentry's severity levels
  const sentryLevel = level === 'warn' ? 'warning' : level

  // Log to console
  const consoleMethod = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  }[level]

  consoleMethod(message)

  // Capture in Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, sentryLevel as Sentry.SeverityLevel)
  }
}

// Re-export the AppErrorBoundary component and HOC
export {
  default as ErrorBoundary,
  withErrorBoundary,
} from '../components/AppErrorBoundary'

type FallbackRender = (props: {
  error: Error
  componentStack: string | null
  resetError: () => void
}) => React.ReactElement

export type { FallbackRender }

// Initialize Sentry in the entry point of your app
export const initSentry = (): void => {
  if (
    process.env.NODE_ENV === 'production' &&
    import.meta.env.VITE_SENTRY_DSN
  ) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      tracesSampleRate: 1.0,
      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    })
  }
}
